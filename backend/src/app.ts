import express from "express";
import cors from "cors";
import patientsRoutes from "./routes/patients.routes";
import doctorsRoutes from "./routes/doctors.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (_req, res) => {
  res.json({ message: "Hospital Management System API is running" });
});

app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Catch-all 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
