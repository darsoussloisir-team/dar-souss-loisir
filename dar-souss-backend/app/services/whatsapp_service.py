"""
WhatsApp notification service via Twilio API.

Setup guide:
  1. Create account at https://console.twilio.com
  2. Go to Messaging → Try it out → Send a WhatsApp message
  3. Follow sandbox join instructions (send "join <word>" to Twilio's number)
  4. For production: submit a WhatsApp Business Profile at console.twilio.com
     → Messaging → Senders → WhatsApp senders

Environment variables needed:
  TWILIO_ACCOUNT_SID   — from Twilio Console dashboard
  TWILIO_AUTH_TOKEN    — from Twilio Console dashboard
  TWILIO_WHATSAPP_FROM — "whatsapp:+14155238886" (sandbox) or your approved number
  WHATSAPP_TO          — "whatsapp:+212615726781"
"""
import logging
import base64

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

TWILIO_URL = (
    f"https://api.twilio.com/2010-04-01/Accounts/"
    f"{settings.TWILIO_ACCOUNT_SID}/Messages.json"
)


async def _send_whatsapp(body: str) -> bool:
    """Low-level POST to Twilio REST API; returns True on success."""
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        logger.warning("Twilio credentials not configured — skipping WhatsApp.")
        return False
    try:
        credentials = base64.b64encode(
            f"{settings.TWILIO_ACCOUNT_SID}:{settings.TWILIO_AUTH_TOKEN}".encode()
        ).decode()
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                TWILIO_URL,
                headers={"Authorization": f"Basic {credentials}"},
                data={
                    "From": settings.TWILIO_WHATSAPP_FROM,
                    "To": settings.WHATSAPP_TO,
                    "Body": body,
                },
            )
        if resp.status_code in (200, 201):
            logger.info("WhatsApp sent successfully.")
            return True
        else:
            logger.error("WhatsApp failed (%s): %s", resp.status_code, resp.text)
            return False
    except Exception as exc:
        logger.error("WhatsApp exception: %s", exc)
        return False


async def send_contact_whatsapp(name: str, email: str, phone: str | None, message: str) -> bool:
    phone_line = f"\n📞 Phone: {phone}" if phone else ""
    body = (
        f"📩 *New Contact — Dar Souss Loisir*\n\n"
        f"👤 Name: {name}\n"
        f"✉️ Email: {email}"
        f"{phone_line}\n\n"
        f"💬 Message:\n{message}"
    )
    return await _send_whatsapp(body)


async def send_booking_whatsapp(data: dict) -> bool:
    phone_line = f"\n📞 Phone: {data['phone']}" if data.get("phone") else ""
    notes_line = f"\n📝 Notes: {data['special_notes']}" if data.get("special_notes") else ""
    body = (
        f"🐪 *New Booking — Dar Souss Loisir*\n\n"
        f"📦 Package: {data['package_label']}\n"
        f"👤 Name: {data['name']}\n"
        f"✉️ Email: {data['email']}"
        f"{phone_line}\n"
        f"📅 Date: {data['date']}\n"
        f"👥 Adults: {data['adults']}  Children: {data['children']}  Infants: {data['infants']}\n"
        f"👥 Total guests: {data['total_guests']}"
        f"{notes_line}\n\n"
        f"💰 *Total Price: €{data['total_price']:.2f}*"
    )
    return await _send_whatsapp(body)