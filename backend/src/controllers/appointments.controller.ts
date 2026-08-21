import { Request, Response } from "express";
import { pool } from "../db/pool";

const VALID_STATUSES = ["Scheduled", "Completed", "Cancelled"];

// GET /api/appointments
// GET /api/appointments?status=Scheduled
// Uses the patient_appointment_details VIEW so we get patient name,
// doctor name, department, date and status in one simple SELECT.
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    if (status) {
      if (!VALID_STATUSES.includes(status as string)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      const result = await pool.query(
        `SELECT * FROM patient_appointment_details WHERE status = $1 ORDER BY appointment_date DESC`,
        [status]
      );
      return res.status(200).json(result.rows);
    }

    const result = await pool.query(
      `SELECT * FROM patient_appointment_details ORDER BY appointment_date DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// POST /api/appointments
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patient_id, doctor_id, appointment_date, status, reason } = req.body;

    if (!patient_id || !doctor_id || !appointment_date) {
      return res
        .status(400)
        .json({ message: "patient_id, doctor_id and appointment_date are required" });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }

    // Confirm the patient and doctor actually exist (referential sanity check)
    const patientCheck = await pool.query(`SELECT id FROM patients WHERE id = $1`, [patient_id]);
    if (patientCheck.rows.length === 0) {
      return res.status(400).json({ message: "Patient ID does not exist" });
    }
    const doctorCheck = await pool.query(`SELECT id FROM doctors WHERE id = $1`, [doctor_id]);
    if (doctorCheck.rows.length === 0) {
      return res.status(400).json({ message: "Doctor ID does not exist" });
    }

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, status || "Scheduled", reason || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

// PUT /api/appointments/:id
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id, appointment_date, status, reason } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET patient_id = $1, doctor_id = $2, appointment_date = $3, status = $4, reason = $5
       WHERE id = $6
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, status, reason, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

// DELETE /api/appointments/:id
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM appointments WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};
