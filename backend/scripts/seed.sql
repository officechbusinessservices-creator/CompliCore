-- create tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  confirmation_code TEXT UNIQUE,
  listing_id INTEGER,
  guest_name TEXT NOT NULL,
  property TEXT,
  check_in TEXT,
  check_out TEXT,
  access_code TEXT,
  wifi_name TEXT,
  wifi_password TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES ('Dev User', 'dev@local') ON CONFLICT DO NOTHING;

INSERT INTO bookings (confirmation_code, listing_id, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status)
VALUES
  ('HX4K9M2', 101, 'Alex Johnson', 'Modern Downtown Loft', '3:00 PM', '11:00 AM', '4829', 'LoftGuest', 'Welcome2024', 'confirmed'),
  ('1234', 102, 'Test Guest', 'Cozy Studio', '4:00 PM', '10:00 AM', '0000', 'StudioGuest', 'password', 'pending')
ON CONFLICT DO NOTHING;
