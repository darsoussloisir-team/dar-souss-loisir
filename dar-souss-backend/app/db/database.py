"""
Async-friendly wrapper around Turso (libSQL) for this project's raw-SQL routers.

The libsql package itself is synchronous, so every call is offloaded to a
thread via asyncio.to_thread to avoid blocking the event loop. This wrapper
mirrors just the parts of the aiosqlite API that contact.py and booking.py
actually use:
  - `cursor = await db.execute(sql, params)` then `cursor.lastrowid`
  - `await db.execute(sql, params)` then `await db.commit()`
  - `async with db.execute(sql, params) as cursor: rows = await cursor.fetchall()`
    where each row behaves like a dict (`dict(row)` works)
"""
import asyncio
import libsql
from app.config import get_settings

settings = get_settings()


class _Cursor:
    def __init__(self, raw_cursor):
        self._raw = raw_cursor

    @property
    def lastrowid(self):
        return self._raw.lastrowid

    async def fetchall(self):
        def _fetch():
            # libsql cursors return plain tuples, not dict-like rows, so we
            # zip them against the DB-API `description` ourselves.
            cols = [c[0] for c in self._raw.description] if self._raw.description else []
            return [dict(zip(cols, row)) for row in self._raw.fetchall()]
        return await asyncio.to_thread(_fetch)

    async def fetchone(self):
        rows = await self.fetchall()
        return rows[0] if rows else None


class _ExecuteContext:
    """Returned by Connection.execute(). Works both as `await db.execute(...)`
    and as `async with db.execute(...) as cursor:` — matching how aiosqlite
    is used throughout this project's routers."""

    def __init__(self, conn, sql, params):
        self._conn = conn
        self._sql = sql
        self._params = params or ()
        self._cursor = None

    async def _run(self):
        if self._cursor is None:
            raw = await asyncio.to_thread(self._conn.execute, self._sql, self._params)
            self._cursor = _Cursor(raw)
        return self._cursor

    def __await__(self):
        return self._run().__await__()

    async def __aenter__(self):
        return await self._run()

    async def __aexit__(self, exc_type, exc, tb):
        return False


class Connection:
    def __init__(self, raw_conn):
        self._conn = raw_conn

    def execute(self, sql, params=None):
        return _ExecuteContext(self._conn, sql, params)

    async def commit(self):
        await asyncio.to_thread(self._conn.commit)

    async def close(self):
        await asyncio.to_thread(self._conn.close)


def _connect():
    return libsql.connect(
        database=settings.DATABASE_URL,
        auth_token=settings.DATABASE_AUTH_TOKEN,
    )


async def get_db() -> Connection:
    """Dependency: yields an open DB connection, closes it after the request."""
    raw = await asyncio.to_thread(_connect)
    conn = Connection(raw)
    try:
        yield conn
    finally:
        await conn.close()


async def init_db() -> None:
    """Create tables if they don't exist (called once at startup)."""
    raw = await asyncio.to_thread(_connect)
    conn = Connection(raw)

    await conn.execute("""
        CREATE TABLE IF NOT EXISTS contact_messages (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            email       TEXT    NOT NULL,
            phone       TEXT,
            message     TEXT    NOT NULL,
            created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            email_sent      INTEGER NOT NULL DEFAULT 0,
            whatsapp_sent   INTEGER NOT NULL DEFAULT 0
        )
    """)

    await conn.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT    NOT NULL,
            email           TEXT    NOT NULL,
            phone           TEXT,
            package         TEXT    NOT NULL,
            date            TEXT    NOT NULL,
            adults          INTEGER NOT NULL DEFAULT 1,
            children        INTEGER NOT NULL DEFAULT 0,
            infants         INTEGER NOT NULL DEFAULT 0,
            special_notes   TEXT,
            total_price     REAL,
            created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
            email_sent      INTEGER NOT NULL DEFAULT 0,
            whatsapp_sent   INTEGER NOT NULL DEFAULT 0
        )
    """)

    await conn.commit()
    await conn.close()
    print("Turso database initialised at", settings.DATABASE_URL)