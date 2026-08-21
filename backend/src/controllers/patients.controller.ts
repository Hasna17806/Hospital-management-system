import { Request, Response } from "express";
import { pool } from "../db/pool";

// GET /api/patients
// GET /api/patients?search=ravi   -> filters by name using LIKE
export const getPatients = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    if (search) {
      // Parameterized query: $1 is filled in safely by pg, instead of
      // pasting the user's text directly into the SQL string. This
      // prevents SQL injection (e.g. someone typing `'; DROP TABLE...`).
      const result = await pool.query(
        `SELECT * FROM patients WHERE name ILIKE $1 ORDER BY name`,
        [`%${search}%`]
      );
      return res.status(200).json(result.rows);
    }

    const result = await pool.query(`SELECT * FROM patients ORDER BY id`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

// GET /api/patients/:id
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM patients WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

// POST /api/patients
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, age, gender, phone, email, blood_group } = req.body;

    // --- Basic validation (kept simple on purpose) ---
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Patient name is required" });
    }
    if (!age || age <= 0) {
      return res.status(400).json({ message: "Age must be greater than 0" });
    }
    if (!gender) {
      return res.status(400).json({ message: "Gender is required" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Email format is invalid" });
    }

    const result = await pool.query(
      `INSERT INTO patients (name, age, gender, phone, email, blood_group)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, age, gender, phone, email || null, blood_group || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create patient" });
  }
};

// PUT /api/patients/:id
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, gender, phone, email, blood_group } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Patient name is required" });
    }
    if (!age || age <= 0) {
      return res.status(400).json({ message: "Age must be greater than 0" });
    }

    const result = await pool.query(
      `UPDATE patients
       SET name = $1, age = $2, gender = $3, phone = $4, email = $5, blood_group = $6
       WHERE id = $7
       RETURNING *`,
      [name, age, gender, phone, email || null, blood_group || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update patient" });
  }
};

// DELETE /api/patients/:id
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM patients WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete patient" });
  }
};
