-- =====================================================
-- SAFE UPDATE: Populate value field for existing patients
-- =====================================================
-- This script updates the value field for existing patients based on:
-- - 23.5 if attendance_type = 'Clinica' AND state_type IN ('Reformado', 'Estudante')
-- - 28.5 if attendance_type = 'Clinica' AND state_type = 'Ativo'
-- - NULL (no change) if attendance_type = 'Domicilio'

-- SAFETY CHECK: First, let's see what patients will be affected
-- Run this query first to preview the changes before applying them
SELECT 
    id,
    name,
    attendance_type,
    state_type,
    value as current_value,
    CASE 
        WHEN attendance_type = 'Clinica' AND state_type IN ('Reformado', 'Estudante') THEN 23.5
        WHEN attendance_type = 'Clinica' AND state_type = 'Ativo' THEN 28.5
        ELSE value -- Keep current value if doesn't match criteria
    END as new_value
FROM "Patient"
WHERE attendance_type = 'Clinica' -- Only show clinic patients
ORDER BY id;

-- =====================================================
-- ACTUAL UPDATE SCRIPT
-- =====================================================
-- Only run this after reviewing the preview above!

-- Update patients with Clinica + Reformado/Estudante → 23.5
UPDATE "Patient" 
SET value = 23.5
WHERE attendance_type = 'Clinica' 
  AND state_type IN ('Reformado', 'Estudante')
  AND value IS NULL; -- Only update if value is currently NULL

-- Update patients with Clinica + Ativo → 28.5  
UPDATE "Patient"
SET value = 28.5
WHERE attendance_type = 'Clinica'
  AND state_type = 'Ativo'
  AND value IS NULL; -- Only update if value is currently NULL

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check how many patients were updated
SELECT 
    'Total Clinic Patients' as category,
    COUNT(*) as count
FROM "Patient" 
WHERE attendance_type = 'Clinica'

UNION ALL

SELECT 
    'Patients with 23.5€ (Reformado/Estudante)' as category,
    COUNT(*) as count
FROM "Patient" 
WHERE attendance_type = 'Clinica' 
  AND state_type IN ('Reformado', 'Estudante')
  AND value = 23.5

UNION ALL

SELECT 
    'Patients with 28.5€ (Ativo)' as category,
    COUNT(*) as count
FROM "Patient" 
WHERE attendance_type = 'Clinica'
  AND state_type = 'Ativo' 
  AND value = 28.5

UNION ALL

SELECT 
    'Domicilio Patients (should have NULL value)' as category,
    COUNT(*) as count
FROM "Patient" 
WHERE attendance_type = 'Domicilio';

-- =====================================================
-- DETAILED VERIFICATION
-- =====================================================
-- Show all patients with their updated values
SELECT 
    id,
    name,
    attendance_type,
    state_type,
    value,
    CASE 
        WHEN attendance_type = 'Clinica' AND state_type IN ('Reformado', 'Estudante') AND value = 23.5 THEN '✅ Correct'
        WHEN attendance_type = 'Clinica' AND state_type = 'Ativo' AND value = 28.5 THEN '✅ Correct'
        WHEN attendance_type = 'Domicilio' AND value IS NULL THEN '✅ Correct'
        WHEN attendance_type = 'Clinica' AND value IS NOT NULL THEN '⚠️ Manual Value'
        ELSE '❌ Check Required'
    END as status
FROM "Patient"
ORDER BY attendance_type, state_type, id;

-- =====================================================
-- ROLLBACK SCRIPT (if needed - DO NOT RUN unless you want to undo)
-- =====================================================
-- ONLY run this if you need to undo the changes
-- 
-- UPDATE "Patient" 
-- SET value = NULL
-- WHERE (attendance_type = 'Clinica' AND state_type IN ('Reformado', 'Estudante') AND value = 23.5)
--    OR (attendance_type = 'Clinica' AND state_type = 'Ativo' AND value = 28.5);
