-- ============================================================
-- 1. INSERT
-- ============================================================

-- Add a new department
INSERT INTO departments (name, description)
VALUES ('Dermatology', 'Skin, hair, and nail care');

-- Add a new patient
INSERT INTO patients (name, age, gender, phone, email, blood_group)
VALUES ('Test Patient', 30, 'Male', '9999999999', 'test.patient@mail.com', 'O+');


-- ============================================================
-- 2. SELECT
-- ============================================================

-- Get every column for every patient
SELECT * FROM patients;

-- Get only specific columns (better practice than SELECT *)
SELECT name, age, blood_group FROM patients;


-- ============================================================
-- 3. UPDATE
-- ============================================================

-- Update a patient's phone number
UPDATE patients
SET phone = '9999900000'
WHERE id = 1;

-- Mark an appointment as completed
UPDATE appointments
SET status = 'Completed'
WHERE id = 4;


-- ============================================================
-- 4. DELETE
-- ============================================================

-- Delete a cancelled appointment
DELETE FROM appointments
WHERE status = 'Cancelled' AND id = 7;
-- Note: because appointments has ON DELETE CASCADE to patients/doctors,
-- deleting a PATIENT would also delete their appointments automatically.


-- ============================================================
-- 5. WHERE (filtering)
-- ============================================================

-- Patients older than 40
SELECT name, age FROM patients WHERE age > 40;

-- Patients with a specific blood group
SELECT name, blood_group FROM patients WHERE blood_group = 'O+';

-- Doctors from the Cardiology department (department_id = 1)
SELECT name, specialization FROM doctors WHERE department_id = 1;

-- Appointments that are still Scheduled
SELECT * FROM appointments WHERE status = 'Scheduled';

-- Patients whose name starts with "A"  (LIKE)
SELECT name FROM patients WHERE name LIKE 'A%';

-- Appointments within a date range (BETWEEN)
SELECT * FROM appointments
WHERE appointment_date BETWEEN '2026-08-10' AND '2026-08-15';

-- Combine conditions with AND / OR
SELECT name, age, gender FROM patients
WHERE age > 30 AND gender = 'Female';

SELECT name, blood_group FROM patients
WHERE blood_group = 'O+' OR blood_group = 'O-';

-- Multiple values with IN (cleaner than many ORs)
SELECT name, blood_group FROM patients
WHERE blood_group IN ('O+', 'O-', 'AB+');

-- ORDER BY — sort patients by age, oldest first
SELECT name, age FROM patients ORDER BY age DESC;

-- LIMIT — only the 5 most recent appointments
SELECT * FROM appointments ORDER BY appointment_date DESC LIMIT 5;


-- ============================================================
-- 6. ORDER BY (extra examples)
-- ============================================================

-- Doctors sorted alphabetically by name
SELECT name, specialization FROM doctors ORDER BY name ASC;


-- ============================================================
-- 7. LIKE (pattern search) 
-- ============================================================

-- Patients whose name CONTAINS "an" anywhere
SELECT name FROM patients WHERE name LIKE '%an%';

-- Patients whose email ends with "@mail.com"
SELECT name, email FROM patients WHERE email LIKE '%@mail.com';


-- ============================================================
-- 8. AGGREGATE FUNCTIONS
-- ============================================================

-- Count total patients
SELECT COUNT(*) AS total_patients FROM patients;

-- Total number of appointments
SELECT COUNT(*) AS total_appointments FROM appointments;

-- Average patient age
SELECT AVG(age) AS average_age FROM patients;

-- Youngest and oldest patient age
SELECT MIN(age) AS youngest, MAX(age) AS oldest FROM patients;

-- (SUM example) Total number of Completed appointments using SUM + CASE
SELECT SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_count
FROM appointments;


-- ============================================================
-- 9. GROUP BY
-- ============================================================

-- Count doctors in each department
SELECT department_id, COUNT(*) AS doctor_count
FROM doctors
GROUP BY department_id;

-- Number of appointments handled by each doctor
SELECT doctor_id, COUNT(*) AS appointment_count
FROM appointments
GROUP BY doctor_id
ORDER BY appointment_count DESC;

-- Count patients by blood group
SELECT blood_group, COUNT(*) AS patient_count
FROM patients
GROUP BY blood_group
ORDER BY patient_count DESC;


-- ============================================================
-- 10. HAVING
-- ============================================================
-- WHERE filters ROWS before grouping.
-- HAVING filters GROUPS after grouping/aggregation.

-- Doctors who have more than 2 appointments
SELECT doctor_id, COUNT(*) AS appointment_count
FROM appointments
GROUP BY doctor_id
HAVING COUNT(*) > 2
ORDER BY appointment_count DESC;

-- Departments that have more than 1 doctor
SELECT department_id, COUNT(*) AS doctor_count
FROM doctors
GROUP BY department_id
HAVING COUNT(*) > 1;


-- ============================================================
-- 11. INNER JOIN
-- ============================================================
-- Returns only rows that have a match in BOTH tables.

-- Show each doctor's name along with their department name
SELECT d.name AS doctor_name, d.specialization, dept.name AS department_name
FROM doctors d
INNER JOIN departments dept ON d.department_id = dept.id
ORDER BY dept.name;


-- ============================================================
-- 12. LEFT JOIN
-- ============================================================
-- Returns ALL rows from the left table, plus matches from the
-- right table (or NULL if there's no match).

-- Show all doctors, INCLUDING doctors who currently have no appointments
SELECT d.name AS doctor_name, a.id AS appointment_id, a.appointment_date
FROM doctors d
LEFT JOIN appointments a ON d.id = a.doctor_id
ORDER BY d.name;

-- Count appointments per doctor, including doctors with ZERO appointments
-- (an INNER JOIN would silently drop doctors with no appointments)
SELECT d.name AS doctor_name, COUNT(a.id) AS appointment_count
FROM doctors d
LEFT JOIN appointments a ON d.id = a.doctor_id
GROUP BY d.name
ORDER BY appointment_count DESC;


-- ============================================================
-- 13. MULTIPLE JOIN
-- ============================================================
-- Chain: patients -> appointments -> doctors -> departments

SELECT
    p.name             AS patient_name,
    doc.name           AS doctor_name,
    dept.name          AS department,
    a.appointment_date,
    a.status
FROM appointments a
JOIN patients p       ON a.patient_id = p.id
JOIN doctors doc      ON a.doctor_id = doc.id
JOIN departments dept ON doc.department_id = dept.id
ORDER BY a.appointment_date;

-- Step by step:
--   1. Start from appointments (the table connecting everyone)
--   2. JOIN patients   -> get the patient's name
--   3. JOIN doctors    -> get the doctor's name
--   4. JOIN departments-> get the doctor's department name
--   5. ORDER BY appointment_date to see them in chronological order


-- ============================================================
-- 14. SUBQUERY
-- ============================================================

-- Patients whose age is greater than the average patient age
SELECT name, age
FROM patients
WHERE age > (SELECT AVG(age) FROM patients);

-- Doctors who have MORE appointments than the average doctor
SELECT doctor_id, COUNT(*) AS appointment_count
FROM appointments
GROUP BY doctor_id
HAVING COUNT(*) > (
    SELECT AVG(appointment_counts.cnt)
    FROM (
        SELECT COUNT(*) AS cnt
        FROM appointments
        GROUP BY doctor_id
    ) AS appointment_counts
);

-- Patients who have never had an appointment (subquery with NOT IN)
SELECT name FROM patients
WHERE id NOT IN (SELECT DISTINCT patient_id FROM appointments);


-- ============================================================
-- 15. CTE (Common Table Expression)
-- ============================================================
-- A CTE is a temporary, named result set you can reference like a table.
-- It exists only for the duration of the query.
-- Difference from a subquery: a CTE is defined once at the top with
-- WITH ... AS (...) and can be reused / read top-to-bottom, which is
-- easier to follow than a subquery nested inside another query.

WITH appointment_counts AS (
    SELECT doctor_id, COUNT(*) AS total_appointments
    FROM appointments
    GROUP BY doctor_id
)
SELECT d.name AS doctor_name, ac.total_appointments
FROM appointment_counts ac
JOIN doctors d ON d.id = ac.doctor_id
ORDER BY ac.total_appointments DESC;

-- A second CTE example: patients with more than 1 prescription
WITH prescription_counts AS (
    SELECT patient_id, COUNT(*) AS total_prescriptions
    FROM prescriptions
    GROUP BY patient_id
)
SELECT p.name, pc.total_prescriptions
FROM prescription_counts pc
JOIN patients p ON p.id = pc.patient_id
WHERE pc.total_prescriptions > 1;


-- ============================================================
-- 16. VIEW
-- ============================================================
-- A view is a saved SELECT query that acts like a virtual table.
-- It does NOT store data itself — it just re-runs the query each
-- time you SELECT from it. Useful for reusing a common JOIN.

-- (Already created in schema.sql, shown here again for reference)
-- CREATE OR REPLACE VIEW patient_appointment_details AS
-- SELECT
--     a.id AS appointment_id,
--     p.name AS patient_name,
--     d.name AS doctor_name,
--     dept.name AS department_name,
--     a.appointment_date,
--     a.status
-- FROM appointments a
-- JOIN patients p ON a.patient_id = p.id
-- JOIN doctors d ON a.doctor_id = d.id
-- JOIN departments dept ON d.department_id = dept.id;

-- Use the view exactly like a table
SELECT * FROM patient_appointment_details
WHERE status = 'Scheduled'
ORDER BY appointment_date;


-- ============================================================
-- 17. TRANSACTION
-- ============================================================
-- A transaction groups multiple statements into one all-or-nothing unit.
-- COMMIT saves all the changes permanently.
-- ROLLBACK undoes everything since BEGIN, as if it never happened.

-- Example: booking an appointment safely
BEGIN;

INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason)
VALUES (2, 3, '2026-08-25 10:00', 'Scheduled', 'Neurology consultation');

-- Imagine we also wanted to update something else here, e.g. a
-- "last_visit" field. If ANYTHING in between fails, nothing is saved.

COMMIT;

-- Example of ROLLBACK (undoing a mistake before it's saved)
BEGIN;

DELETE FROM patients WHERE id = 1; -- oops, wrong patient!

ROLLBACK; -- undo it — patient 1 is safe, nothing was actually deleted


-- ============================================================
-- 18. INDEX
-- ============================================================
-- (Indexes are already created in schema.sql — shown here for reference)

-- CREATE INDEX idx_patients_name ON patients(name);
-- CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- An index works like a book's table of contents: instead of scanning
-- every row (a "sequential scan"), PostgreSQL can jump straight to the
-- matching rows. Don't index every column — indexes speed up SELECTs
-- but slow down INSERT/UPDATE/DELETE (the index must be updated too),
-- and they use extra disk space.


-- ============================================================
-- 19. EXPLAIN / EXPLAIN ANALYZE
-- ============================================================
-- EXPLAIN shows the query PLAN PostgreSQL intends to use (no execution).
-- EXPLAIN ANALYZE actually RUNS the query and shows real timing too.

EXPLAIN SELECT * FROM patients WHERE name = 'Amit Sharma';

EXPLAIN ANALYZE
SELECT * FROM appointments WHERE appointment_date > '2026-08-14';

-- What to look for:
--   "Seq Scan"    = scanned the whole table row by row (slow on big tables)
--   "Index Scan"  = used an index to jump directly to matching rows (fast)
--   "cost="       = PostgreSQL's estimated effort (lower is generally better)
--   "actual time="= real time taken (only shown with ANALYZE)
