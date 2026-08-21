"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import * as api from "@/services/api";
import { Appointment, AppointmentStatus, Doctor, Patient } from "@/types";

const STATUSES: AppointmentStatus[] = ["Scheduled", "Completed", "Cancelled"];

const EMPTY_FORM = { patient_id: "", doctor_id: "", appointment_date: "", status: "Scheduled", reason: "" };

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map = {
    Scheduled: "badge-scheduled",
    Completed: "badge-completed",
    Cancelled: "badge-cancelled",
  };
  return <span className={map[status]}>{status}</span>;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const load = async (status?: string) => {
    setLoading(true);
    try {
      setAppointments(await api.getAppointments(status || undefined));
      setError("");
    } catch {
      setError("Could not load appointments. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api.getPatients().then(setPatients).catch(() => {});
    api.getDoctors().then(setDoctors).catch(() => {});
  }, []);

  useEffect(() => {
    load(statusFilter);
  }, [statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (a: Appointment) => {
    setEditingId(a.appointment_id);
    setForm({
      patient_id: String(a.patient_id),
      doctor_id: String(a.doctor_id),
      appointment_date: a.appointment_date.slice(0, 16),
      status: a.status,
      reason: a.reason || "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      const payload = {
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        appointment_date: form.appointment_date,
        status: form.status,
        reason: form.reason,
      };
      if (editingId) {
        await api.updateAppointment(editingId, payload);
      } else {
        await api.createAppointment(payload);
      }
      setModalOpen(false);
      load(statusFilter);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this appointment?")) return;
    await api.deleteAppointment(id);
    load(statusFilter);
  };

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Appointments</h1>
          <p className="mt-1 text-sm text-ink/55">{appointments.length} appointment{appointments.length !== 1 && "s"}</p>
        </div>
        <button onClick={openAddModal} className="btn-primary self-start sm:self-auto">
          + New Appointment
        </button>
      </header>

      <div className="surface mb-5 flex flex-wrap gap-2 p-4">
        <button
          onClick={() => setStatusFilter("")}
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${statusFilter === "" ? "bg-ink text-white" : "bg-canvas text-ink/60 hover:bg-teal-light"}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${statusFilter === s ? "bg-ink text-white" : "bg-canvas text-ink/60 hover:bg-teal-light"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <div className="surface mb-5 border-coral/30 bg-coral/5 p-4 text-sm text-coral">{error}</div>}

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-ink/50">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-ink/40">Loading appointments...</td></tr>
              )}
              {!loading && appointments.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-ink/40">No appointments found.</td></tr>
              )}
              {!loading && appointments.map((a) => (
                <tr key={a.appointment_id} className="border-b border-line last:border-0 transition-colors hover:bg-canvas/50">
                  <td className="px-5 py-3.5 font-medium text-ink">{a.patient_name}</td>
                  <td className="px-5 py-3.5 text-ink/70">{a.doctor_name}</td>
                  <td className="px-5 py-3.5 text-ink/70">{a.department_name}</td>
                  <td className="px-5 py-3.5 text-ink/70">{new Date(a.appointment_date).toLocaleString()}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEditModal(a)} className="btn-secondary !px-2.5 !py-1.5 text-xs">Edit</button>
                      <button onClick={() => handleDelete(a.appointment_id)} className="btn-danger-ghost">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editingId ? "Edit Appointment" : "New Appointment"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {formError && <p className="text-sm text-coral">{formError}</p>}
            <select
              className="input-field" required value={form.patient_id}
              onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
            >
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select
              className="input-field" required value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input
              className="input-field" type="datetime-local" required
              value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
            />
            <select
              className="input-field" value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              className="input-field" placeholder="Reason for visit"
              value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full justify-center">
              {editingId ? "Save Changes" : "Create Appointment"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
