"""
POST /api/booking

- Validates input
- Calculates total price server-side
- Saves to SQLite
- Sends email
- Returns confirmation + pre-filled WhatsApp URL
"""

import logging
from datetime import datetime, timezone
from urllib.parse import quote

import aiosqlite
from fastapi import APIRouter, Body, Depends, HTTPException, status

from app.db.database import get_db, Connection
from app.models.schemas import BookingRequest, BookingResponse, PACKAGE_LABELS
from app.services.email_service import send_booking_email


logger = logging.getLogger(__name__)

router = APIRouter()

WHATSAPP_NUMBER = "212615726781"


def build_booking_whatsapp_url(data: dict) -> str:
    text = (
        "Hi! I just submitted a booking on your website and would like to confirm.\n\n"
        f"Package: {data['package_label']}\n"
        f"Date: {data['date']}\n"
        f"Name: {data['name']}\n"
        f"Adults: {data['adults']}  Children: {data['children']}  Infants: {data['infants']}\n"
        f"Total: EUR {data['total_price']:.2f}"
    )

    if data.get("special_notes"):
        text += f"\nNotes: {data['special_notes']}"

    return f"https://wa.me/{WHATSAPP_NUMBER}?text={quote(text)}"


@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_booking(
    payload: BookingRequest = Body(...),
    db: Connection = Depends(get_db),
) -> BookingResponse:

    # 1. Calculate total price server-side
    total_price = payload.total_price
    package_label = PACKAGE_LABELS[payload.package]
    total_guests = payload.total_guests

    if total_guests > 15:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Maximum 15 guests per booking. You requested {total_guests}.",
        )

    # 2. Persist booking
    try:
        cursor = await db.execute(
            """
            INSERT INTO bookings
                (
                    name,
                    email,
                    phone,
                    package,
                    date,
                    adults,
                    children,
                    infants,
                    special_notes,
                    total_price,
                    created_at
                )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.name,
                payload.email,
                payload.phone,
                payload.package,
                payload.date.isoformat(),
                payload.adults,
                payload.children,
                payload.infants,
                payload.special_notes,
                total_price,
                datetime.now(timezone.utc).isoformat(),
            ),
        )

        await db.commit()

        record_id = cursor.lastrowid

    except Exception as exc:
        logger.error("DB insert failed: %s", exc)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save your booking. Please try again.",
        )

    # 3. Prepare notification data
    notification_data = {
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "package": payload.package,
        "package_label": package_label,
        "date": payload.date.isoformat(),
        "adults": payload.adults,
        "children": payload.children,
        "infants": payload.infants,
        "total_guests": total_guests,
        "special_notes": payload.special_notes,
        "total_price": total_price,
    }

    # 4. Send email
    email_ok = await send_booking_email(notification_data)

    await db.execute(
        "UPDATE bookings SET email_sent=? WHERE id=?",
        (int(email_ok), record_id),
    )

    await db.commit()

    # 5. Build WhatsApp URL
    whatsapp_url = build_booking_whatsapp_url(notification_data)

    # 6. Return confirmation
    return BookingResponse(
        success=True,
        message=(
            f"Booking received! We will contact you at {payload.email} "
            f"to finalise the details. See you on {payload.date.isoformat()}!"
        ),
        id=record_id,
        total_price=total_price,
        package_label=package_label,
        whatsapp_url=whatsapp_url,
    )


@router.get("/list")
async def list_bookings(
    db: aiosqlite.Connection = Depends(get_db),
    limit: int = 50,
    offset: int = 0,
):
    async with db.execute(
        "SELECT * FROM bookings ORDER BY created_at DESC LIMIT ? OFFSET ?",
        (limit, offset),
    ) as cursor:
        rows = await cursor.fetchall()

    return [dict(row) for row in rows]