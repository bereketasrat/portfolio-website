-- ============================================================
-- portfolio_db — Database Schema
-- Run this script in phpMyAdmin or MySQL CLI to set up the DB.
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Select the database
USE portfolio_db;

-- 3. Create the messages table
CREATE TABLE IF NOT EXISTS messages (
  id         INT           NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL,
  subject    VARCHAR(200)  DEFAULT NULL,          -- optional subject field
  message    TEXT          NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_email (email),                        -- index for quick lookups by email
  INDEX idx_created (created_at)                  -- index for sorting by date
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Optional: view all submitted messages
-- SELECT id, name, email, subject, LEFT(message,60) AS preview, created_at
-- FROM messages
-- ORDER BY created_at DESC;
-- ============================================================
