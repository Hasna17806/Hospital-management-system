"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import * as api from "@/services/api";
import { Patient } from "@/types";

const EMPTY_FORM = { name: "", age: "", gender: "Male", phone: "", email: "", blood_group: "" };

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
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
      setPatients(await api.getPatients(q));
      setError("");
    } catch {
      setError("Could not load patients. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(search), 300); // small debounce for search-as-you-type
    return () => clearTimeout(timeout);
  }, [search]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (p: Patient) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      age: String(p.age),
      gender: p.gender,
      phone: p.phone,
      email: p.email || "",
      blood_group: p.blood_group || "",
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
        age: Number(form.age),
        gender: form.gender as Patient["gender"],
        phone: form.phone,
        email: form.email || null,
        blood_group: form.blood_group || null,
      };
      if (editingId) {
        await api.updatePatient(editingId, payload);
      } else {
        await api.createPatient(payload);
      }
      setModalOpen(false);
      load(search);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this patient? This also removes their appointments, records, and prescriptions.")) return;
    await api.deletePatient(id);
    load(search);
  };

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Patients</h1>
          <p className="mt-1 text-sm text-ink/55">{patients.length} patient{patients.length !== 1 && "s"} on record</p>
        </div>
        <button onClick={openAddModal} className="btn-primary self-start sm:self-auto">
          + Add Patient
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
                <th className="px-5 py-3 font-medium">Age</th>
                <th className="px-5 py-3 font-medium">Gender</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Blood Group</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-ink/40">Loading patients...</td></tr>
              )}
              {!loading && patients.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-ink/40">No patients found.</td></tr>
              )}
              {!loading && patients.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 transition-colors hover:bg-canvas/50">
                  <td className="px-5 py-3.5 font-medium text-ink">{p.name}</td>
                  <td className="px-5 py-3.5 text-ink/70">{p.age}</td>
                  <td className="px-5 py-3.5 text-ink/70">{p.gender}</td>
                  <td className="px-5 py-3.5 text-ink/70">{p.phone}</td>
                  <td className="px-5 py-3.5 text-ink/70">{p.blood_group || "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEditModal(p)} className="btn-secondary !px-2.5 !py-1.5 text-xs">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="btn-danger-ghost">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editingId ? "Edit Patient" : "Add Patient"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {formError && <p className="text-sm text-coral">{formError}</p>}
            <input
              className="input-field" placeholder="Full name" required
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input-field" placeholder="Age" type="number" min={1} required
                value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <select
                className="input-field" value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <input
              className="input-field" placeholder="Phone number" required
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="input-field" placeholder="Email (optional)" type="email"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <select
              className="input-field" value={form.blood_group}
              onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
            >
              <option value="">Blood group (optional)</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary w-full justify-center">
              {editingId ? "Save Changes" : "Add Patient"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
