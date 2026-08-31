"""
POST /api/contact
  - Validates input
  - Saves to SQLite
  - Sends email notification to the business
  - Returns success + a pre-filled WhatsApp URL the frontend can open
    so the visitor can message the business directly on WhatsApp
"""
import logging
from datetime import datetime, timezone
from urllib.parse import quote

import aiosqlite
from fastapi import APIRouter, Body, Depends, HTTPException, status

from app.db.database import get_db
from app.models.schemas import ContactRequest, ContactResponse
from app.services.email_service import send_contact_email
from app.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()

WHATSAPP_NUMBER = "212615726781"


def build_whatsapp_url(name: str, message: str) -> str:
    text = f"Hi, I'm {name}. {message}"
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={quote(text)}"


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(
    payload: ContactRequest = Body(...),
    db: aiosqlite.Connection = Depends(get_db),
) -> ContactResponse:

    # 1. Persist
    try:
        cursor = await db.execute(
            """
            INSERT INTO contact_messages (name, email, phone, message, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                payload.name,
                payload.email,
                payload.phone,
                payload.message,
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        await db.commit()
        record_id = cursor.lastrowid
    except Exception as exc:
        logger.error("DB insert failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save your message. Please try again.",
        )

    # 2. Send email
    email_ok = await send_contact_email(
        payload.name, payload.email, payload.phone, payload.message
    )

    await db.execute(
        "UPDATE contact_messages SET email_sent=? WHERE id=?",
        (int(email_ok), record_id),
    )
    await db.commit()

    # 3. Build WhatsApp URL
    whatsapp_url = build_whatsapp_url(payload.name, payload.message)

    return ContactResponse(
        success=True,
        message="Thank you! We received your message and will get back to you shortly.",
        id=record_id,
        whatsapp_url=whatsapp_url,
    )