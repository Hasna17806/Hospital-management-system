-- ============================================================
-- HOSPITAL MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================================
-- This file creates all 6 tables, in an order that respects
-- foreign key dependencies (parent tables before child tables).
--
-- Order:
--   1. departments        (no dependencies)
--   2. doctors            (depends on departments)
--   3. patients           (no dependencies)
--   4. appointments       (depends on patients, doctors)
--   5. medical_records    (depends on patients, doctors)
--   6. prescriptions      (depends on patients, doctors)
-- ============================================================

-- Drop tables if they already exist (useful while learning/testing)
-- CASCADE also removes anything that depends on them (like foreign keys)
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 0. USERS
-- ============================================================
-- Staff accounts that can log in and use the system.
-- We NEVER store the plain password — only a bcrypt hash of it.
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================
-- The "parent" table for doctors. One department -> many doctors.
CREATE TABLE departments (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,   -- no two departments with the same name
    description TEXT
);

-- ============================================================
-- 2. DOCTORS
-- ============================================================
-- Each doctor belongs to exactly one department (department_id).
CREATE TABLE doctors (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    specialization  VARCHAR(100) NOT NULL,
    phone           VARCHAR(20)  NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    department_id   INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index to speed up "find doctors in department X" and JOINs on department_id
CREATE INDEX idx_doctors_department_id ON doctors(department_id);

-- ============================================================
-- 3. PATIENTS
-- ============================================================
CREATE TABLE patients (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    age         INTEGER NOT NULL CHECK (age > 0 AND age < 130),
    gender      VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    phone       VARCHAR(20)  NOT NULL,
    email       VARCHAR(100) UNIQUE,
    blood_group VARCHAR(5) CHECK (
        blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')
    ),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for fast name search (used by the LIKE '%name%' search feature)
CREATE INDEX idx_patients_name ON patients(name);

-- ============================================================
-- 4. APPOINTMENTS
-- ============================================================
-- Connects a patient to a doctor at a specific date/time.
-- This is a "many-to-many" bridge in practice: one patient can have
-- many appointments, one doctor can have many appointments.
CREATE TABLE appointments (
    id                SERIAL PRIMARY KEY,
    patient_id        INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id         INTEGER NOT NULL REFERENCES doctors(id)  ON DELETE CASCADE,
    appointment_date  TIMESTAMP NOT NULL,
    status            VARCHAR(20) NOT NULL DEFAULT 'Scheduled'
                          CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    reason            VARCHAR(255),
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index to speed up JOINs / lookups by patient and doctor
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id  ON appointments(doctor_id);
-- Index for filtering/sorting by date (dashboard "today's appointments")
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- ============================================================
-- 5. MEDICAL_RECORDS
-- ============================================================
CREATE TABLE medical_records (
    id          SERIAL PRIMARY KEY,
    patient_id  INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id   INTEGER NOT NULL REFERENCES doctors(id)  ON DELETE CASCADE,
    diagnosis   VARCHAR(255) NOT NULL,
    treatment   VARCHAR(255),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);

-- ============================================================
-- 6. PRESCRIPTIONS
-- ============================================================
CREATE TABLE prescriptions (
    id                  SERIAL PRIMARY KEY,
    patient_id          INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id           INTEGER NOT NULL REFERENCES doctors(id)  ON DELETE CASCADE,
    medicine_name       VARCHAR(100) NOT NULL,
    dosage              VARCHAR(50)  NOT NULL,   -- e.g. "500mg twice a day"
    duration             VARCHAR(50),             -- e.g. "5 days"
    prescription_date   DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);

-- ============================================================
-- A USEFUL VIEW (see section 15 of the learning plan)
-- ============================================================
-- Combines patient + appointment + doctor + department info into
-- one simple "table-like" object we can SELECT from directly.
CREATE OR REPLACE VIEW patient_appointment_details AS
SELECT
    a.id                AS appointment_id,
    a.patient_id,
    a.doctor_id,
    p.name              AS patient_name,
    d.name              AS doctor_name,
    dept.name           AS department_name,
    a.appointment_date,
    a.status,
    a.reason
FROM appointments a
JOIN patients p     ON a.patient_id = p.id
JOIN doctors d      ON a.doctor_id = d.id
JOIN departments dept ON d.department_id = dept.id;
