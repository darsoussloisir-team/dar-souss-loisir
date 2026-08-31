"""
Async SQLite via aiosqlite + raw SQL (no ORM overhead for this project size).
All tables are created here on first startup.
"""
import aiosqlite
from app.config import get_settings

settings = get_settings()

# Strip the SQLAlchemy-style prefix so we get a plain file path
DB_PATH = settings.DATABASE_URL.replace("sqlite+aiosqlite:///", "")


async def get_db() -> aiosqlite.Connection:
    """Dependency: yields an open DB connection, closes it after the request."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db


async def init_db() -> None:
    """Create tables if they don't exist (called once at startup)."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT    NOT NULL,
                email       TEXT    NOT NULL,
                phone       TEXT,
                message     TEXT    NOT NULL,
                created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
                -- useful for your future AI agent
                email_sent      INTEGER NOT NULL DEFAULT 0,
                whatsapp_sent   INTEGER NOT NULL DEFAULT 0
            )
        """)

        await db.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                name            TEXT    NOT NULL,
                email           TEXT    NOT NULL,
                phone           TEXT,
                package         TEXT    NOT NULL,  -- 'sunset' | 'bbq' | 'couscous'
                date            TEXT    NOT NULL,  -- ISO date string YYYY-MM-DD
                adults          INTEGER NOT NULL DEFAULT 1,
                children        INTEGER NOT NULL DEFAULT 0,
                infants         INTEGER NOT NULL DEFAULT 0,
                special_notes   TEXT,
                total_price     REAL,
                created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
                -- useful for your future AI agent
                email_sent      INTEGER NOT NULL DEFAULT 0,
                whatsapp_sent   INTEGER NOT NULL DEFAULT 0
            )
        """)
        await db.commit()
    print("Database initialised at", DB_PATH)