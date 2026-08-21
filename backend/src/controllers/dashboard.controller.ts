import { Request, Response } from "express";
import { pool } from "../db/pool";

// GET /api/dashboard/stats
// Runs a few small aggregate queries and combines them into one
// response for the dashboard cards. Nothing here is hardcoded —
// every number comes straight from PostgreSQL.
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalPatients = await pool.query(`SELECT COUNT(*) FROM patients`);
    const totalDoctors = await pool.query(`SELECT COUNT(*) FROM doctors`);
    const totalAppointments = await pool.query(`SELECT COUNT(*) FROM appointments`);
    const todaysAppointments = await pool.query(
      `SELECT COUNT(*) FROM appointments WHERE appointment_date::date = CURRENT_DATE`
    );

    res.status(200).json({
      totalPatients: Number(totalPatients.rows[0].count),
      totalDoctors: Number(totalDoctors.rows[0].count),
      totalAppointments: Number(totalAppointments.rows[0].count),
      todaysAppointments: Number(todaysAppointments.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
