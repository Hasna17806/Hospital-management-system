export interface Department {
  id: number;
  name: string;
  description: string | null;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  department_id: number;
  department_name?: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string | null;
  blood_group: string | null;
}

export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  patient_name: string;
  doctor_name: string;
  department_name: string;
  appointment_date: string;
  status: AppointmentStatus;
  reason: string | null;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todaysAppointments: number;
}
