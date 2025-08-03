DROP TABLE IF EXISTS recipes, users CASCADE;

-- Create "users" table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create "recipes" table (no reference to users)
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
