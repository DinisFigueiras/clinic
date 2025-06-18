-- =====================================================
-- SAFE MIGRATION: Add 3 new optional fields to Patient table
-- =====================================================
-- This migration adds 3 new optional fields without affecting existing data
-- Run this in Supabase SQL Editor if Prisma migration fails

-- Add the new fields to the Patient table
-- All fields are optional (nullable) to preserve existing data
ALTER TABLE "Patient" 
ADD COLUMN "value" DECIMAL,
ADD COLUMN "profession" TEXT,
ADD COLUMN "family" TEXT;

-- Verify the migration worked
-- This query should show the new columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Patient' 
AND column_name IN ('value', 'profession', 'family');

-- Optional: Check existing data is intact
-- This should return all your existing patients with NULL values for new fields
SELECT id, name, email, "value", profession, family 
FROM "Patient" 
LIMIT 5;

-- =====================================================
-- ROLLBACK (if needed - DO NOT RUN unless you want to remove the fields)
-- =====================================================
-- ALTER TABLE "Patient" 
-- DROP COLUMN "value",
-- DROP COLUMN "profession", 
-- DROP COLUMN "family";
