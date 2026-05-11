// src/features/appointments/components/AppointmentForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAppointment } from '../appointmentsSlice';
import type { AppDispatch } from '../../../app/store';
import './AppointmentForm.css'
export default function AppointmentForm({ onDone }: { onDone?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    truckNumber: '',
    driverName: '',
    appointmentDate: '',
    purpose: '',
    portOfEntry: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await dispatch(createAppointment({ ...form }));
      setForm({ truckNumber: '', driverName: '', appointmentDate: '', purpose: '', portOfEntry: '' });
      onDone?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form card" onSubmit={submit}>
      <h3>Schedule Appointment</h3>
      <label>
        Truck Number
        <input required value={form.truckNumber} onChange={(e) => setForm((s) => ({ ...s, truckNumber: e.target.value }))} />
      </label>
      <label>
        Driver Name
        <input required value={form.driverName} onChange={(e) => setForm((s) => ({ ...s, driverName: e.target.value }))} />
      </label>
      <label>
        Appointment Date
        <input required type="datetime-local" value={form.appointmentDate} onChange={(e) => setForm((s) => ({ ...s, appointmentDate: e.target.value }))} />
      </label>
      <label>
        Purpose
        <input required value={form.purpose} onChange={(e) => setForm((s) => ({ ...s, purpose: e.target.value }))} />
      </label>
      <label>
        Port of Entry
        <select required value={form.portOfEntry} onChange={(e) => setForm((s) => ({ ...s, portOfEntry: e.target.value }))}>
          <option value="">Select port</option>
          <option>Port A</option>
          <option>Port B</option>
          <option>Port C</option>
        </select>
      </label>

      {error && <div className="error-card">{error}</div>}

      <div style={{ marginTop: 12 }}>
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? 'Scheduling...' : 'Schedule'}
        </button>
      </div>
    </form>
  );
}
