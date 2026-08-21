import { Request, Response } from "express";
import { pool } from "../db/pool";

// GET /api/doctors
// GET /api/doctors?search=anil
// Joins with departments so the frontend gets the department name directly.
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const baseQuery = `
      SELECT d.*, dept.name AS department_name
      FROM doctors d
      JOIN departments dept ON d.department_id = dept.id
    `;

    if (search) {
      const result = await pool.query(
        `${baseQuery} WHERE d.name ILIKE $1 ORDER BY d.name`,
        [`%${search}%`]
      );
      return res.status(200).json(result.rows);
    }

    const result = await pool.query(`${baseQuery} ORDER BY d.id`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// GET /api/doctors/:id
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT d.*, dept.name AS department_name
       FROM doctors d
       JOIN departments dept ON d.department_id = dept.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctor" });
  }
};

// POST /api/doctors
export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { name, specialization, phone, email, department_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Doctor name is required" });
    }
    if (!specialization) {
      return res.status(400).json({ message: "Specialization is required" });
    }
    if (!department_id) {
      return res.status(400).json({ message: "Department is required" });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Email format is invalid" });
    }

    // Make sure the department actually exists before inserting
    const deptCheck = await pool.query(`SELECT id FROM departments WHERE id = $1`, [department_id]);
    if (deptCheck.rows.length === 0) {
      return res.status(400).json({ message: "Department does not exist" });
    }

    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, phone, email, department_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, specialization, phone, email, department_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create doctor" });
  }
};

// PUT /api/doctors/:id
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, specialization, phone, email, department_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Doctor name is required" });
    }

    const result = await pool.query(
      `UPDATE doctors
       SET name = $1, specialization = $2, phone = $3, email = $4, department_id = $5
       WHERE id = $6
       RETURNING *`,
      [name, specialization, phone, email, department_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update doctor" });
  }
};

// DELETE /api/doctors/:id
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM doctors WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete doctor" });
  }
};

// GET /api/departments  (small helper used to populate the doctor form dropdown)
export const getDepartments = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM departments ORDER BY name`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};
