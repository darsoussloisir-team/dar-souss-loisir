# 🐪 Dar Souss Loisir — Backend API

FastAPI backend for the Dar Souss Loisir tourism website.  
Handles contact messages and booking requests — persists everything to SQLite,
then fires email (Gmail SMTP) and WhatsApp (Twilio) notifications concurrently.

---

## Project Structure

```
dar-souss-backend/
├── app/
│   ├── main.py              #FastAPIapp, CORS, router registration
│   ├── config.py             # Pydantic settings (reads from .env)
│   ├── db/
│   │   └── database.py       # SQLite init + async connection dependency
│   ├── models/
│   │   └── schemas.py        # Pydantic request/response models + pricing
│   ├── routers/
│   │   ├── health.py         # GET /health
│   │   ├── contact.py        # POST /api/contact
│   │   └── booking.py        # POST /api/booking  |  GET /api/booking/list
│   └── services/
│       ├── email_service.py  # aiosmtplib Gmail sender
│       └── whatsapp_service.py # Twilio WhatsApp sender
├── .env.example              # Template — copy to .env and fill in secrets
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Quick Start

### 1. Clone & create virtual environment

```bash
git clone <your-repo>
cd dar-souss-backend

python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Open .env in your editor and fill in all values
```

### 4. Run the development server

```bash
uvicorn app.main:app --reload --port 8000
```

Visit **http://localhost:8000/docs** to explore the interactive API docs (Swagger UI).

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/contact` | Submit a contact message |
| POST | `/api/booking` | Submit a booking request |
| GET | `/api/booking/list` | List all bookings (protect before prod!) |

### POST /api/contact

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+33612345678",        // optional
  "message": "Do you offer private group tours?"
}
```

### POST /api/booking

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+33698765432",        // optional
  "package": "bbq",              // "sunset" | "bbq" | "couscous"
  "date": "2025-04-15",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "special_notes": "Vegetarian please"   // optional
}
```

---

## Package Pricing

| Package | Adult | Child | Infant |
|---------|-------|-------|--------|
| `sunset` — Camel Ride at Sunset | €25 | €12.50 | Free |
| `bbq` — Camel Ride & Barbecue | €37 | €25 | Free |
| `couscous` — Camel Ride with Couscous | €30 | €20 | Free |

> Prices are calculated **server-side** — the client never controls the total.

---

## Setting Up Gmail (SMTP)

1. Enable **2-Step Verification** on the Gmail account you want to send from:  
   https://myaccount.google.com/security

2. Generate an **App Password**:  
   https://myaccount.google.com/apppasswords  
   → Select "Mail" and your device → **Generate**

3. Copy the 16-character password (no spaces) into `SMTP_PASSWORD` in `.env`.

```env
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop   # paste exactly as shown
EMAIL_FROM=youremail@gmail.com
EMAIL_TO=contact@darsoussloisir.com
```

---

## Setting Up WhatsApp (Twilio)

### Development (Sandbox — free)

1. Sign up at https://console.twilio.com
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. Follow the instructions — send `join <word>` from your phone to the Twilio sandbox number
4. Copy your `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` from the dashboard

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_TO=whatsapp:+212615726781
```

### Production (Real WhatsApp number)

1. In Twilio Console → **Messaging → Senders → WhatsApp senders**
2. Submit your WhatsApp Business Profile (takes 1–3 days to approve)
3. Once approved, update `TWILIO_WHATSAPP_FROM` to your real number

---

## Deployment (VPS / Railway / Render)

### With a process manager (recommended for VPS)

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### One-click platforms

- **Railway**: Connect your GitHub repo → set env vars in the dashboard → deploy.
- **Render**: New Web Service → Python → set `uvicorn app.main:app --host 0.0.0.0 --port $PORT` as start command.

### CORS in production

In `app/main.py`, update `allow_origins`:
```python
allow_origins=["https://darsoussloisir.com", "https://www.darsoussloisir.com"]
```

### Protect the booking list endpoint

Before going live, add an API key or HTTP Basic Auth to `GET /api/booking/list`:
```python
from fastapi import Security, HTTPException
from fastapi.security.api_key import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key")

@router.get("/list")
async def list_bookings(api_key: str = Security(api_key_header), ...):
    if api_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=403)
    ...
```

---

## SQLite Database

The database file `dar_souss.db` is created automatically on first startup.

### Tables

**contact_messages**
```
id, name, email, phone, message, created_at, email_sent, whatsapp_sent
```

**bookings**
```
id, name, email, phone, package, date, adults, children, infants,
special_notes, total_price, created_at, email_sent, whatsapp_sent
```

### Quick inspection

```bash
sqlite3 dar_souss.db
.tables
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10;
.quit
```

---

## Roadmap — AI Agent Integration

When you're ready to add the AI agent (Phase 2):

1. **Add a `GET /api/messages`** endpoint that returns all contact messages +
   bookings in a unified format for the agent's context window.

2. **Add a `POST /api/agent/chat`** endpoint that:
   - Receives a visitor's question
   - Queries the DB for relevant past messages (RAG-lite)
   - Calls the Claude API with business context + conversation history
   - Logs the Q&A pair to a new `agent_conversations` table
   - Returns the response to the frontend

3. The `email_sent` / `whatsapp_sent` flags already in place let you audit
   exactly which notifications succeeded — no hallucination blind spots.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI 0.115 |
| Validation | Pydantic v2 |
| Server | Uvicorn (async ASGI) |
| Database | SQLite via aiosqlite |
| Email | aiosmtplib (Gmail SMTP) |
| WhatsApp | Twilio REST API via httpx |
| Config | pydantic-settings + python-dotenv |