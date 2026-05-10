// src/features/appointments/components/AppointmentRow.tsx
import React, { useState,useEffect } from 'react';
import type { Appointment } from '../../appointments/appointmentsSlice';

export default function AppointmentRow({
  appointment,
  role,
  onUpdate,
}: {
  appointment: Appointment;
  role: 'Driver' | 'Admin' | null;
  onUpdate: (patch: Partial<Appointment>) => void;
}) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [comment, setComment] = useState('');

  const handleModify = () => {
    // For driver modify we could open a small inline edit; here we just toggle status to Pending
    onUpdate({ ...appointment, comments: (appointment.comments || '') + ' | Modified by driver' });
  };

  const handleCancel = () => {
    onUpdate({ status: 'Cancelled' });
  };

  const handleAdminOpen = () => setShowAdminModal(true);
  const handleAdminClose = () => setShowAdminModal(false);

  const handleApprove = () => {
    onUpdate({ status: 'Approved', comments: comment });
    handleAdminClose();
  };
  const handleReject = () => {
    onUpdate({ status: 'Rejected', comments: comment });
    handleAdminClose();
  };
 
  return (
    <>
      <tr>
        <td>{appointment.truckNumber}</td>
        <td>{appointment.driverName}</td>
        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
        <td>{appointment.purpose}</td>
        <td>{appointment.portOfEntry}</td>
        <td>{appointment.status}</td>
        <td>
          {role === 'Driver' && (
            <>
              <button className="btn small" onClick={handleModify}>
                Modify
              </button>
              <button className="btn small danger" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
          {role === 'Admin' && (
            <>
              <button className="btn small" onClick={handleAdminOpen}>
                Edit
              </button>
            </>
          )}
        </td>
      </tr>

      {showAdminModal && (
        <div className="modal-backdrop">
          <div className="modal card">
            <h4>Admin Review</h4>
            <p>
              <strong>{appointment.truckNumber}</strong> — {appointment.driverName}
            </p>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add comment" />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn primary" onClick={handleApprove}>
                Approve
              </button>
              <button className="btn" onClick={handleReject}>
                Reject
              </button>
              <button className="btn" onClick={handleAdminClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
