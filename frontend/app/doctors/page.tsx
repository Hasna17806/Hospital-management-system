"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import * as api from "@/services/api";
import { Department, Doctor } from "@/types";

const EMPTY_FORM = { name: "", specialization: "", phone: "", email: "", department_id: "" };

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const load = async (q?: string) => {
    setLoading(true);
    try {
      setDoctors(await api.getDoctors(q));
      setError("");
    } catch {
      setError("Could not load doctors. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (d: Doctor) => {
    setEditingId(d.id);
    setForm({
      name: d.name,
      specialization: d.specialization,
      phone: d.phone,
      email: d.email,
      department_id: String(d.department_id),
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      const payload = {
        name: form.name,
        specialization: form.specialization,
        phone: form.phone,
        email: form.email,
        department_id: Number(form.department_id),
      };
      if (editingId) {
        await api.updateDoctor(editingId, payload);
      } else {
        await api.createDoctor(payload);
      }
      setModalOpen(false);
      load(search);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this doctor? Their appointments and records will also be removed.")) return;
    await api.deleteDoctor(id);
    load(search);
  };

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Doctors</h1>
          <p className="mt-1 text-sm text-ink/55">{doctors.length} doctor{doctors.length !== 1 && "s"} on staff</p>
        </div>
        <button onClick={openAddModal} className="btn-primary self-start sm:self-auto">
          + Add Doctor
        </button>
      </header>

      <div className="surface mb-5 p-4">
        <input
          className="input-field max-w-xs"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="surface mb-5 border-coral/30 bg-coral/5 p-4 text-sm text-coral">{error}</div>}

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-ink/50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Specialization</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-ink/40">Loading doctors...</td></tr>
              )}
              {!loading && doctors.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-ink/40">No doctors found.</td></tr>
              )}
              {!loading && doctors.map((d) => (
                <tr key={d.id} className="border-b border-line last:border-0 transition-colors hover:bg-canvas/50">
                  <td className="px-5 py-3.5 font-medium text-ink">{d.name}</td>
                  <td className="px-5 py-3.5 text-ink/70">{d.specialization}</td>
                  <td className="px-5 py-3.5 text-ink/70">{d.department_name}</td>
                  <td className="px-5 py-3.5 text-ink/70">{d.phone}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEditModal(d)} className="btn-secondary !px-2.5 !py-1.5 text-xs">Edit</button>
                      <button onClick={() => handleDelete(d.id)} className="btn-danger-ghost">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editingId ? "Edit Doctor" : "Add Doctor"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {formError && <p className="text-sm text-coral">{formError}</p>}
            <input
              className="input-field" placeholder="Full name" required
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input-field" placeholder="Specialization" required
              value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
            <select
              className="input-field" required value={form.department_id}
              onChange={(e) => setForm({ ...form, department_id: e.target.value })}
            >
              <option value="">Select department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
            <input
              className="input-field" placeholder="Phone number" required
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="input-field" placeholder="Email" type="email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full justify-center">
              {editingId ? "Save Changes" : "Add Doctor"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
