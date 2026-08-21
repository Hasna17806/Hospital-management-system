# 🏥 Meridian — Mini Hospital Management System

A small, beginner-friendly full-stack project built to **practice and understand PostgreSQL and SQL** through a realistic (but simple) hospital app.

> Built by Hasna Hamza as a learning project. The goal was never to build the biggest app — it was to understand *why* every SQL query, table, and API route exists.

---

## 1. Project Overview

Meridian is a mini hospital management system with 3 core entities to manage — **patients**, **doctors**, and **appointments** — plus supporting tables (**departments**, **medical records**, **prescriptions**) that exist specifically to practice relationships, joins, and aggregation in PostgreSQL.

```text
Next.js (frontend)  →  Express.js (API)  →  PostgreSQL (database)
```

---

## 2. Features

- Dashboard with live stats (total patients, doctors, appointments, today's visits)
- Patients: list, search by name, add, edit, delete
- Doctors: list, search by name, add, edit, delete (linked to a department)
- Appointments: list, filter by status, add, edit, delete/cancel
- Every number and row on the frontend comes from a real PostgreSQL query — nothing is hardcoded

---

## 3. Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend    | Node.js, Express.js, TypeScript |
| Database   | PostgreSQL (via the `pg` driver, connection pool) |

No ORMs, no auth libraries, no state-management libraries — plain SQL and plain `fetch`, on purpose, so every layer stays readable.

---

## 4. Database Tables

| Table | Purpose |
|---|---|
| `departments` | Hospital departments (Cardiology, Neurology, etc.) |
| `doctors` | Doctors, each belonging to one department |
| `patients` | Patient records |
| `appointments` | Bookings connecting a patient and a doctor |
| `medical_records` | Diagnosis/treatment history per patient |
| `prescriptions` | Medicines prescribed to a patient |

Full column list and constraints are in [`database/schema.sql`](./database/schema.sql).

---

## 5. ER Diagram

```text
                 ┌───────────────┐
                 │  departments  │
                 └───────┬───────┘
                         │ 1
                         │
                         │ many
                 ┌───────▼───────┐
                 │    doctors    │
                 └───┬───────┬───┘
                     │       │
              many ┌─┘       └─┐ many
                    │           │
          ┌─────────▼───┐   ┌───▼─────────────┐
          │ appointments│   │  medical_records │
          └─────┬───────┘   └────────┬─────────┘
        many     │                    │ many
                  │                    │
             1    │                    │    1
          ┌───────▼────────────────────▼──────┐
          │              patients               │
          └───────────────┬─────────────────────┘
                           │ 1
                           │
                           │ many
                   ┌───────▼────────┐
                   │  prescriptions │
                   └────────────────┘
```

### Relationships in plain language

- **Department → Doctors**: one department has many doctors (`doctors.department_id` is a foreign key to `departments.id`).
- **Patient → Appointments**: one patient can book many appointments.
- **Doctor → Appointments**: one doctor can be booked for many appointments. An appointment always links exactly one patient to exactly one doctor.
- **Patient → Medical Records**: one patient can have many diagnosis/treatment entries over time.
- **Patient → Prescriptions**: one patient can be given many prescriptions.

---

## 6. SQL Concepts Practiced

CRUD · `WHERE`/`AND`/`OR`/`IN`/`BETWEEN`/`LIKE` · `ORDER BY`/`LIMIT` · aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) · `GROUP BY` & `HAVING` · `INNER JOIN` · `LEFT JOIN` · multi-table `JOIN` · subqueries · CTEs (`WITH`) · views · transactions (`BEGIN`/`COMMIT`/`ROLLBACK`) · indexes · `EXPLAIN ANALYZE`

All of these are demonstrated with commented, hospital-themed examples in [`database/sql-practice.sql`](./database/sql-practice.sql) — this is the file to review before a project walkthrough.

---

## 7. API Endpoints

**Patients**
```
GET    /api/patients            (supports ?search=name)
GET    /api/patients/:id
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

**Doctors**
```
GET    /api/doctors             (supports ?search=name)
GET    /api/doctors/departments/all
GET    /api/doctors/:id
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

**Appointments**
```
GET    /api/appointments        (supports ?status=Scheduled|Completed|Cancelled)
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

**Dashboard**
```
GET    /api/dashboard/stats
```

---

## 8. Project Structure

```text
hospital-management-system/
├── database/
│   ├── schema.sql          # tables, constraints, view
│   ├── seed.sql             # sample data
│   └── sql-practice.sql     # every SQL concept, commented, for review
├── backend/
│   ├── src/
│   │   ├── db/pool.ts        # PostgreSQL connection pool
│   │   ├── controllers/      # one file per resource — the actual SQL queries live here
│   │   ├── routes/           # maps URLs to controller functions
│   │   ├── app.ts            # Express app + middleware + route mounting
│   │   └── server.ts         # starts the server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Dashboard
│   │   ├── patients/page.tsx
│   │   ├── doctors/page.tsx
│   │   └── appointments/page.tsx
│   ├── components/           # Sidebar, MobileNav, StatCard, Modal
│   ├── services/api.ts       # every fetch() call to the backend, in one place
│   ├── types/index.ts        # shared TypeScript interfaces
│   └── package.json
└── README.md
```

---

## 9. Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL installed locally (or a free hosted instance, e.g. Neon/Supabase)

### Step 1 — Create the database
```bash
createdb hospital_db
psql -d hospital_db -f database/schema.sql
psql -d hospital_db -f database/seed.sql
```

### Step 2 — Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env and set your real DATABASE_URL
npm run dev
```
The API runs at `http://localhost:5000`.

### Step 3 — Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
The app runs at `http://localhost:3000`.

---

## 10. Environment Variables

**backend/.env**
```
DATABASE_URL=postgresql://username:password@localhost:5432/hospital_db
PORT=5000
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 11. How to Run

1. Start PostgreSQL (make sure the `hospital_db` database exists and is seeded).
2. `cd backend && npm run dev`
3. `cd frontend && npm run dev`
4. Open `http://localhost:3000`

---

## 12. What I Learned

- How to design a small relational schema with primary keys, foreign keys, and constraints (`CHECK`, `NOT NULL`, `UNIQUE`, `DEFAULT`)
- How `JOIN`s combine data across related tables, and when `LEFT JOIN` matters vs `INNER JOIN`
- How `GROUP BY` + `HAVING` answer "per-group" questions that `WHERE` can't
- How subqueries and CTEs both let a query build on another query — and when a CTE is easier to read
- Why a `VIEW` is useful for a JOIN you run often
- What a transaction actually protects against, and what `COMMIT`/`ROLLBACK` do
- Why indexes speed up lookups, and why they're not something to add everywhere
- How to read `EXPLAIN ANALYZE` output to check if a query is efficient
- How to connect a Next.js frontend to an Express API to a PostgreSQL database using parameterized queries (`$1`, `$2`, ...) to stay safe from SQL injection
