-- ============================================================
-- SEED DATA
-- Small, realistic sample data — enough to practice JOINs,
-- GROUP BY, aggregates, filtering, etc. without overwhelming you.
-- Run this AFTER schema.sql.
-- ============================================================

-- 1. DEPARTMENTS (5)
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart and blood vessel care'),
('Neurology', 'Brain and nervous system care'),
('Pediatrics', 'Medical care for children'),
('Orthopedics', 'Bones, joints, and muscles'),
('General Medicine', 'General checkups and common illnesses');

-- 2. DOCTORS (8)
INSERT INTO doctors (name, specialization, phone, email, department_id) VALUES
('Dr. Anil Menon',      'Cardiologist',       '9876543210', 'anil.menon@hospital.com',      1),
('Dr. Priya Nair',      'Cardiac Surgeon',    '9876543211', 'priya.nair@hospital.com',      1),
('Dr. Rahul Verma',     'Neurologist',        '9876543212', 'rahul.verma@hospital.com',     2),
('Dr. Sneha Iyer',      'Pediatrician',       '9876543213', 'sneha.iyer@hospital.com',      3),
('Dr. Kiran Das',       'Pediatric Surgeon',  '9876543214', 'kiran.das@hospital.com',       3),
('Dr. Arjun Pillai',    'Orthopedic Surgeon', '9876543215', 'arjun.pillai@hospital.com',    4),
('Dr. Fathima Rasheed', 'General Physician',  '9876543216', 'fathima.rasheed@hospital.com', 5),
('Dr. Vishnu Kumar',    'General Physician',  '9876543217', 'vishnu.kumar@hospital.com',    5);

-- 3. PATIENTS (15)
INSERT INTO patients (name, age, gender, phone, email, blood_group) VALUES
('Amit Sharma',      34, 'Male',   '9000000001', 'amit.sharma@mail.com',      'B+'),
('Anjali Gupta',     28, 'Female', '9000000002', 'anjali.gupta@mail.com',     'O+'),
('Arun Kumar',       45, 'Male',   '9000000003', 'arun.kumar@mail.com',       'A+'),
('Divya Menon',      52, 'Female', '9000000004', 'divya.menon@mail.com',     'AB+'),
('Farhan Ali',       19, 'Male',   '9000000005', 'farhan.ali@mail.com',       'O-'),
('Gayathri Raj',     61, 'Female', '9000000006', 'gayathri.raj@mail.com',     'B-'),
('Harish Chandran',  38, 'Male',   '9000000007', 'harish.chandran@mail.com',  'A-'),
('Irfan Sheikh',     8,  'Male',   '9000000008', 'irfan.sheikh@mail.com',     'O+'),
('Jyothi Suresh',    70, 'Female', '9000000009', 'jyothi.suresh@mail.com',    'AB-'),
('Kavya Pillai',     25, 'Female', '9000000010', 'kavya.pillai@mail.com',     'B+'),
('Manoj Varma',      41, 'Male',   '9000000011', 'manoj.varma@mail.com',      'A+'),
('Neha Thomas',      33, 'Female', '9000000012', 'neha.thomas@mail.com',      'O+'),
('Omar Faruk',       56, 'Male',   '9000000013', 'omar.faruk@mail.com',       'B+'),
('Priya Balan',      6,  'Female', '9000000014', 'priya.balan@mail.com',      'A+'),
('Rohit Nambiar',    47, 'Male',   '9000000015', 'rohit.nambiar@mail.com',    'O-');

-- 4. APPOINTMENTS (20)
-- Mixed statuses and dates so filtering/aggregation is meaningful.
INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason) VALUES
(1,  1, '2026-08-10 09:00', 'Completed',  'Chest pain checkup'),
(2,  7, '2026-08-10 10:00', 'Completed',  'General fever'),
(3,  6, '2026-08-11 11:00', 'Completed',  'Knee pain'),
(4,  1, '2026-08-11 12:00', 'Scheduled',  'Follow-up ECG'),
(5,  8, '2026-08-12 09:30', 'Completed',  'Routine checkup'),
(6,  3, '2026-08-12 10:30', 'Scheduled',  'Frequent headaches'),
(7,  2, '2026-08-13 11:30', 'Cancelled',  'Heart surgery consult'),
(8,  4, '2026-08-13 14:00', 'Completed',  'Child vaccination'),
(9,  1, '2026-08-14 09:00', 'Completed',  'Blood pressure check'),
(10, 7, '2026-08-14 15:00', 'Scheduled',  'Skin allergy'),
(11, 6, '2026-08-15 09:00', 'Completed',  'Fracture follow-up'),
(12, 8, '2026-08-15 10:00', 'Scheduled',  'General weakness'),
(13, 3, '2026-08-16 11:00', 'Completed',  'Migraine treatment'),
(14, 5, '2026-08-16 12:00', 'Completed',  'Child health checkup'),
(15, 1, '2026-08-17 09:00', 'Scheduled',  'Heart palpitations'),
(1,  1, '2026-08-20 09:00', 'Scheduled',  'Follow-up visit'),
(2,  7, '2026-08-20 10:00', 'Scheduled',  'Cold and cough'),
(3,  6, '2026-08-21 11:00', 'Scheduled',  'Physiotherapy review'),
(9,  2, '2026-08-21 13:00', 'Scheduled',  'Cardiac review'),
(11, 6, '2026-08-22 09:00', 'Scheduled',  'X-ray review');

-- 5. MEDICAL RECORDS (10)
INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment, record_date) VALUES
(1,  1, 'Mild angina',            'Prescribed medication and rest',        '2026-08-10'),
(2,  7, 'Viral fever',            'Rest and paracetamol',                  '2026-08-10'),
(3,  6, 'Ligament strain',        'Physiotherapy for 2 weeks',             '2026-08-11'),
(5,  8, 'Healthy - routine check','No treatment needed',                   '2026-08-12'),
(7,  2, 'Cardiac arrhythmia',     'Referred for further tests',            '2026-08-13'),
(8,  4, 'Routine vaccination',    'MMR vaccine administered',              '2026-08-13'),
(9,  1, 'High blood pressure',    'Prescribed BP medication',              '2026-08-14'),
(11, 6, 'Fractured wrist',        'Cast applied, follow-up in 4 weeks',    '2026-08-15'),
(13, 3, 'Chronic migraine',       'Prescribed pain relief and diet plan',  '2026-08-16'),
(14, 5, 'Healthy - growth check', 'No treatment needed',                   '2026-08-16');

-- 6. PRESCRIPTIONS (15)
INSERT INTO prescriptions (patient_id, doctor_id, medicine_name, dosage, duration, prescription_date) VALUES
(1,  1, 'Aspirin',        '75mg once daily',        '30 days', '2026-08-10'),
(1,  1, 'Atorvastatin',   '10mg once daily',         '30 days', '2026-08-10'),
(2,  7, 'Paracetamol',    '500mg twice daily',       '5 days',  '2026-08-10'),
(3,  6, 'Ibuprofen',      '400mg twice daily',       '7 days',  '2026-08-11'),
(5,  8, 'Multivitamin',   '1 tablet daily',          '30 days', '2026-08-12'),
(7,  2, 'Metoprolol',     '25mg once daily',         '30 days', '2026-08-13'),
(8,  4, 'ORS Solution',   'As needed',               '3 days',  '2026-08-13'),
(9,  1, 'Amlodipine',     '5mg once daily',          '60 days', '2026-08-14'),
(9,  1, 'Losartan',       '50mg once daily',         '60 days', '2026-08-14'),
(11, 6, 'Calcium tablets','500mg once daily',        '45 days', '2026-08-15'),
(11, 6, 'Paracetamol',    '500mg as needed for pain','7 days',  '2026-08-15'),
(13, 3, 'Sumatriptan',    '50mg as needed',          '30 days', '2026-08-16'),
(13, 3, 'Propranolol',    '10mg twice daily',        '30 days', '2026-08-16'),
(14, 5, 'Vitamin D drops','5 drops daily',           '30 days', '2026-08-16'),
(6,  3, 'Naproxen',       '250mg twice daily',       '5 days',  '2026-08-12');
