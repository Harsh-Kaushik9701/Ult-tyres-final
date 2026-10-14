CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('dealer','admin')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);
CREATE TABLE IF NOT EXISTS dealers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  abn text,
  phone text NOT NULL,
  state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS dealer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_name text NOT NULL,
  abn text,
  state text NOT NULL,
  message text,
  password_hash text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS products (
  id integer PRIMARY KEY,
  brand text NOT NULL,
  application text NOT NULL,
  pattern text NOT NULL,
  size text NOT NULL,
  ply_rating text,
  load_speed text,
  measuring_rim text,
  overall_diameter_mm text,
  overall_width_mm text,
  tread_depth_mm text,
  load_single text,
  load_dual text,
  image text,
  active boolean NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS products_browse_idx ON products (brand,application,pattern,size);
CREATE TABLE IF NOT EXISTS stock (
  product_id integer PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0 CHECK(quantity >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS dealer_prices (
  dealer_id uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  unit_price numeric(12,2) NOT NULL CHECK(unit_price >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (dealer_id,product_id)
);
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id uuid NOT NULL REFERENCES dealers(id),
  status text NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','processing','fulfilled','cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK(quantity > 0),
  unit_price numeric(12,2),
  UNIQUE(order_id,product_id)
);
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK(kind IN ('contact','dealer-application','careers')),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_name text,
  abn text,
  state text,
  topic text,
  role_interest text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  suburb text NOT NULL,
  state text NOT NULL,
  postcode text,
  phone text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  active boolean NOT NULL DEFAULT true
);
