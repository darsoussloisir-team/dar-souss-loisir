"""
POST /api/agent/chat
  - Loads knowledge from knowledge_base.pdf at startup (simple RAG — full text injected into system prompt)
  - Calls Groq API (free tier, Llama 3 model — fast and cheap)
  - Returns the assistant reply
  - Appends every exchange to conversations.log for monitoring
"""
import logging
from datetime import datetime, timezone
from pathlib import Path
from functools import lru_cache

import httpx
from fastapi import APIRouter, Body, HTTPException, status
from pydantic import BaseModel

from app.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()

# ── Paths ─────────────────────────────────────────────────────────────────────
LOG_PATH = Path("conversations.log")
PDF_PATH = Path("knowledge_base.pdf")   # drop your PDF here in the backend root


# ── PDF text extraction ───────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def load_knowledge_base() -> str:
    """
    Extract text from knowledge_base.pdf and return it as a plain string.
    Cached so the file is only read once per server run.
    Falls back to an empty string if the file is missing or unreadable.
    """
    if not PDF_PATH.exists():
        logger.warning("knowledge_base.pdf not found — agent will use built-in fallback only.")
        return ""
    try:
        import pypdf
        reader = pypdf.PdfReader(str(PDF_PATH))
        text = "\n\n".join(
            page.extract_text() or "" for page in reader.pages
        ).strip()
        logger.info("Loaded knowledge_base.pdf — %d characters extracted.", len(text))
        return text
    except Exception as exc:
        logger.error("Could not read knowledge_base.pdf: %s", exc)
        return ""


# ── System prompt builder ─────────────────────────────────────────────────────

BASE_INSTRUCTIONS = """You are a helpful AI assistant for Dar Souss Loisir, a family-run camel ride business in Agadir, Morocco, operating since 2005.

Your job is to answer questions from tourists ONLY about our activities, experiences, prices, pickup logistics, health restrictions, and bookings.

Rules:
- Be warm, professional, and concise.
- Never use emojis.
- Always reply in the same language the visitor uses (French, English, Spanish, German, Arabic, etc.).
- If a question is completely unrelated to Dar Souss Loisir (politics, other businesses, general travel advice, etc.), politely say you can only help with questions about our experiences.
- If you do not know the answer from the knowledge base below, tell the visitor to contact us directly at +212 615 726 781 (WhatsApp) or contact@darsoussloisir.com. Never invent information.

--- KNOWLEDGE BASE ---

{knowledge}

--- END OF KNOWLEDGE BASE ---"""


def build_system_prompt() -> str:
    knowledge = load_knowledge_base()
    if not knowledge:
        # Minimal fallback if PDF is missing
        knowledge = (
            "Dar Souss Loisir offers three camel ride experiences in Agadir, Morocco:\n"
            "1. Camel Ride at Sunset — €25/adult, 2 hours, daily at 6:30 pm\n"
            "2. Camel Ride & Barbecue — €37/adult, 3 hours, daily at 6:30 pm\n"
            "3. Camel Ride with Couscous — €30/adult, 3 hours, daily at 7:00 pm\n"
            "Contact: +212 615 726 781 | contact@darsoussloisir.com\n"
            "Location: Aghroud Village, Bensergao, Agadir, Morocco.\n"
            "Hotel pickup included for Agadir city centre and coast hotels only."
        )
    return BASE_INSTRUCTIONS.format(knowledge=knowledge)


# ── Models ────────────────────────────────────────────────────────────────────

class Message(BaseModel):
    role: str       # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    session_id: str = "anonymous"


# ── Log helper ────────────────────────────────────────────────────────────────

def append_to_log(session_id: str, messages: list[Message], reply: str) -> None:
    try:
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        last_user = next((m.content for m in reversed(messages) if m.role == "user"), "")
        entry = (
            f"\n{'─' * 60}\n"
            f"[{timestamp}]  session={session_id}\n"
            f"USER:      {last_user}\n"
            f"ASSISTANT: {reply}\n"
        )
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(entry)
    except Exception as exc:
        logger.error("Log write failed: %s", exc)


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/chat")
async def agent_chat(payload: ChatRequest = Body(...)):
    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI agent is not configured. Set GROQ_API_KEY in .env",
        )

    messages_for_api = [
        {"role": m.role, "content": m.content}
        for m in payload.messages
        if m.role in ("user", "assistant")
    ]

    if not messages_for_api or messages_for_api[-1]["role"] != "user":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Last message must be from the user.",
        )

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "openai/gpt-oss-20b",  # free, very fast
                    "max_tokens": 512,
                    "temperature": 0.4,
                    "messages": [
                        {"role": "system", "content": build_system_prompt()},
                        *messages_for_api,
                    ],
                },
            )

        if response.status_code != 200:
            logger.error("Groq API error %s: %s", response.status_code, response.text)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="The assistant is temporarily unavailable. Please contact us directly.",
            )

        data = response.json()
        reply = data["choices"][0]["message"]["content"]

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="The assistant took too long to respond. Please try again.",
        )

    append_to_log(payload.session_id, payload.messages, reply)
    return {"reply": reply}