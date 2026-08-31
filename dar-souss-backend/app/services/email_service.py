"""
Async email service via aiosmtplib (Gmail SMTP / any SMTP provider).

How to set up Gmail:
  1. Google Account → Security → 2-Step Verification → ON
  2. Google Account → Security → App passwords
  3. Select "Mail" + your device → Generate
  4. Paste the 16-char password into SMTP_PASSWORD in your .env
"""
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _build_contact_email(name: str, email: str, phone: str | None, message: str) -> MIMEMultipart:
    phone_line = f"<p><strong>Phone:</strong> {phone}</p>" if phone else ""
    html = f"""
    <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px">
      <div style="background:#c8a46e;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0">📩 New Contact Message — Dar Souss Loisir</h2>
      </div>
      <div style="border:1px solid #ddd;padding:24px;border-radius:0 0 8px 8px">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
        {phone_line}
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:4px solid #c8a46e;padding-left:16px;color:#555">
          {message}
        </blockquote>
      </div>
      <p style="font-size:12px;color:#999;margin-top:8px">Dar Souss Loisir — darsoussloisir.com</p>
    </body></html>
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Contact] New message from {name}"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = settings.EMAIL_TO
    msg["Reply-To"] = email
    msg.attach(MIMEText(html, "html"))
    return msg


def _build_booking_email(data: dict) -> MIMEMultipart:
    phone_line = f"<p><strong>Phone:</strong> {data['phone']}</p>" if data.get("phone") else ""
    notes_line = f"<p><strong>Notes:</strong> {data['special_notes']}</p>" if data.get("special_notes") else ""
    html = f"""
    <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px">
      <div style="background:#8b5e3c;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0">🐪 New Booking Request — Dar Souss Loisir</h2>
      </div>
      <div style="border:1px solid #ddd;padding:24px;border-radius:0 0 8px 8px">
        <h3 style="color:#8b5e3c">{data['package_label']}</h3>
        <p><strong>Name:</strong> {data['name']}</p>
        <p><strong>Email:</strong> <a href="mailto:{data['email']}">{data['email']}</a></p>
        {phone_line}
        <p><strong>Date:</strong> {data['date']}</p>
        <p><strong>Adults:</strong> {data['adults']} &nbsp;|&nbsp;
           <strong>Children:</strong> {data['children']} &nbsp;|&nbsp;
           <strong>Infants:</strong> {data['infants']}</p>
        <p><strong>Total Guests:</strong> {data['total_guests']}</p>
        {notes_line}
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
        <p style="font-size:18px;color:#8b5e3c">
          <strong>Total Price: €{data['total_price']:.2f}</strong>
        </p>
      </div>
      <p style="font-size:12px;color:#999;margin-top:8px">Dar Souss Loisir — darsoussloisir.com</p>
    </body></html>
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Booking] {data['package_label']} on {data['date']} — {data['name']}"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = settings.EMAIL_TO
    msg["Reply-To"] = data["email"]
    msg.attach(MIMEText(html, "html"))
    return msg


async def send_email(msg: MIMEMultipart) -> bool:
    """Send an email; returns True on success, False on failure (non-blocking)."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured — skipping email.")
        return False
    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=True,          # SSL on port 465
        )
        logger.info("Email sent: %s", msg["Subject"])
        return True
    except Exception as exc:
        logger.error("Email send failed: %s", exc)
        return False


async def send_contact_email(name: str, email: str, phone: str | None, message: str) -> bool:
    msg = _build_contact_email(name, email, phone, message)
    return await send_email(msg)


async def send_booking_email(data: dict) -> bool:
    msg = _build_booking_email(data)
    return await send_email(msg)