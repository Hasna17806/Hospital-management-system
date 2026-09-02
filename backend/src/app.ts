import express from "express";
import cors from "cors";
import patientsRoutes from "./routes/patients.routes";
import doctorsRoutes from "./routes/doctors.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";
import { requireAuth } from "./middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (_req, res) => {
  res.json({ message: "Hospital Management System API is running" });
});

// Login stays OPEN — you need to be able to call this before you have a token
app.use("/api/auth", authRoutes);

// Every route below this line requires a valid token.
// requireAuth runs first; if it calls next(), the real route runs.
app.use("/api/patients", requireAuth, patientsRoutes);
app.use("/api/doctors", requireAuth, doctorsRoutes);
app.use("/api/appointments", requireAuth, appointmentsRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);

// Catch-all 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
