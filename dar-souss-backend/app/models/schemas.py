"""
Pydantic v2 models — request validation + response shapes.
"""
from __future__ import annotations
from datetime import date
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Contact ───────────────────────────────────────────────────────────────────

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    success: bool
    message: str
    id: int
    whatsapp_url: str   # frontend opens this so visitor can follow up on WhatsApp


# ── Booking ───────────────────────────────────────────────────────────────────

PackageType = Literal["sunset", "bbq", "couscous"]

PACKAGE_PRICES: dict[str, dict[str, float]] = {
    "sunset":   {"adult": 25.0,  "child": 12.5, "infant": 0.0},
    "bbq":      {"adult": 37.0,  "child": 25.0, "infant": 0.0},
    "couscous": {"adult": 30.0,  "child": 20.0, "infant": 0.0},
}

PACKAGE_LABELS: dict[str, str] = {
    "sunset":   "Camel Ride at Sunset",
    "bbq":      "Camel Ride & Barbecue Dinner",
    "couscous": "Camel Ride with Couscous",
}


class BookingRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    package: PackageType
    date: date
    adults: int = Field(1, ge=1, le=15)
    children: int = Field(0, ge=0, le=15)
    infants: int = Field(0, ge=0, le=15)
    special_notes: Optional[str] = Field(None, max_length=500)

    @field_validator("date")
    @classmethod
    def date_must_be_future(cls, v: date) -> date:
        from datetime import date as _date
        if v <= _date.today():
            raise ValueError("Booking date must be in the future.")
        return v

    @property
    def total_guests(self) -> int:
        return self.adults + self.children + self.infants

    @property
    def total_price(self) -> float:
        p = PACKAGE_PRICES[self.package]
        return round(
            self.adults   * p["adult"]  +
            self.children * p["child"]  +
            self.infants  * p["infant"],
            2,
        )


class BookingResponse(BaseModel):
    success: bool
    message: str
    id: int
    total_price: float
    package_label: str
    whatsapp_url: str   # frontend opens this so visitor can confirm on WhatsApp