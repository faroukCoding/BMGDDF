-- Create User Roles Enum Type
CREATE TYPE user_role AS ENUM ('admin', 'assistant_admin', 'affiliate', 'call_center_agent', 'driver');

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    commission NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Status Enum Type
CREATE TYPE order_status AS ENUM (
    'pending_review', -- By Assistant Admin
    'pending_admin_review', -- Special case for Admin
    'confirmed',
    'rejected',
    'out_for_delivery',
    'delivered',
    'failed_delivery',
    'no_answer'
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    product_id INTEGER REFERENCES products(id),
    affiliate_id INTEGER REFERENCES users(id),
    driver_id INTEGER REFERENCES users(id) NULL,
    call_center_agent_id INTEGER REFERENCES users(id) NULL,
    status order_status NOT NULL DEFAULT 'pending_review',
    commission NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payouts Table for Affiliates
CREATE TABLE payouts (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES users(id) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    request_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_date TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT
);
