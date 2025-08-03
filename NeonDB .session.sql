DROP TABLE IF EXISTS recipes, users CASCADE;

-- Create "users" table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  confirmed BOOLEAN DEFAULT false,
  token TEXT
);


-- Create "recipes" table
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
