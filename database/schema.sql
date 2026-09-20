-- ============================================================
-- MY PLACE — Private Beachfront Villa
-- PostgreSQL schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Admin users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          VARCHAR(30) NOT NULL DEFAULT 'admin',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Bookings / reservation inquiries
-- ------------------------------------------------------------
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE booking_type AS ENUM ('holiday', 'honeymoon', 'family_stay', 'group_stay', 'long_stay', 'other');

CREATE TABLE IF NOT EXISTS bookings (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name         VARCHAR(150) NOT NULL,
    email             VARCHAR(150) NOT NULL,
    phone             VARCHAR(40) NOT NULL,
    whatsapp_number   VARCHAR(40),
    check_in          DATE NOT NULL,
    check_out         DATE NOT NULL,
    adults            INTEGER NOT NULL DEFAULT 1,
    children          INTEGER NOT NULL DEFAULT 0,
    booking_type      booking_type NOT NULL DEFAULT 'holiday',
    airport_transfer  BOOLEAN NOT NULL DEFAULT false,
    message           TEXT,
    status            booking_status NOT NULL DEFAULT 'pending',
    admin_notes       TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_dates CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings (check_in, check_out);

-- ------------------------------------------------------------
-- General contact inquiries (non-booking)
-- ------------------------------------------------------------
CREATE TYPE inquiry_status AS ENUM ('new', 'read', 'contacted');

CREATE TABLE IF NOT EXISTS inquiries (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name    VARCHAR(150) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    phone        VARCHAR(40),
    subject      VARCHAR(200),
    message      TEXT NOT NULL,
    status       inquiry_status NOT NULL DEFAULT 'new',
    admin_notes  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries (status);

-- ------------------------------------------------------------
-- Gallery images
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(150) NOT NULL,
    category      VARCHAR(60) NOT NULL,
    image_url     TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images (category);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_images (display_order);

-- ------------------------------------------------------------
-- Blocked / unavailable dates (manual blocks + confirmed bookings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blocked_dates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    reason      VARCHAR(200),
    booking_id  UUID REFERENCES bookings(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_block_dates CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_range ON blocked_dates (start_date, end_date);

-- ------------------------------------------------------------
-- Villa-wide editable settings (single row, key/value style)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS villa_settings (
    id                 INTEGER PRIMARY KEY DEFAULT 1,
    villa_description  TEXT,
    contact_email      VARCHAR(150),
    contact_phone      VARCHAR(40),
    whatsapp_number    VARCHAR(40),
    check_in_time      VARCHAR(20) DEFAULT '2:00 PM',
    check_out_time     VARCHAR(20) DEFAULT '10:00 AM',
    amenities          JSONB DEFAULT '[]',
    policies           JSONB DEFAULT '{}',
    location_info      TEXT,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO villa_settings (id, villa_description, contact_email, contact_phone, whatsapp_number, location_info)
VALUES (
    1,
    'Welcome to My Place, a private beachfront villa designed for those who value space, serenity, and the natural rhythm of the Indian Ocean.',
    'info@myplacediani.example',
    '+254700000000',
    '+254700000000',
    'Diani Beach, Kenya — approximately 45 minutes from Ukunda Airstrip.'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- Keep updated_at fresh
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bookings_updated ON bookings;
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_inquiries_updated ON inquiries;
CREATE TRIGGER trg_inquiries_updated BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_gallery_updated ON gallery_images;
CREATE TRIGGER trg_gallery_updated BEFORE UPDATE ON gallery_images
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated ON villa_settings;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON villa_settings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
