import {
  Appointment,
  DashboardStats,
  Department,
  Doctor,
  Patient,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Small shared helper so every function doesn't repeat the same
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

// ---------- Dashboard ----------
export const getDashboardStats = () => request<DashboardStats>("/dashboard/stats");

// ---------- Patients ----------
export const getPatients = (search?: string) =>
  request<Patient[]>(`/patients${search ? `?search=${encodeURIComponent(search)}` : ""}`);

export const createPatient = (data: Omit<Patient, "id">) =>
  request<Patient>("/patients", { method: "POST", body: JSON.stringify(data) });

export const updatePatient = (id: number, data: Omit<Patient, "id">) =>
  request<Patient>(`/patients/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deletePatient = (id: number) =>
  request<{ message: string }>(`/patients/${id}`, { method: "DELETE" });

// ---------- Doctors ----------
export const getDoctors = (search?: string) =>
  request<Doctor[]>(`/doctors${search ? `?search=${encodeURIComponent(search)}` : ""}`);

export const getDepartments = () => request<Department[]>("/doctors/departments/all");

export const createDoctor = (data: Omit<Doctor, "id" | "department_name">) =>
  request<Doctor>("/doctors", { method: "POST", body: JSON.stringify(data) });

export const updateDoctor = (id: number, data: Omit<Doctor, "id" | "department_name">) =>
  request<Doctor>(`/doctors/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteDoctor = (id: number) =>
  request<{ message: string }>(`/doctors/${id}`, { method: "DELETE" });

// ---------- Appointments ----------
export const getAppointments = (status?: string) =>
  request<Appointment[]>(`/appointments${status ? `?status=${status}` : ""}`);

export const createAppointment = (data: {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  status: string;
  reason: string;
}) => request<Appointment>("/appointments", { method: "POST", body: JSON.stringify(data) });

export const updateAppointment = (
  id: number,
  data: { patient_id: number; doctor_id: number; appointment_date: string; status: string; reason: string }
) => request<Appointment>(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteAppointment = (id: number) =>
  request<{ message: string }>(`/appointments/${id}`, { method: "DELETE" });
