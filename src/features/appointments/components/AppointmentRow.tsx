import React, { useState } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...appointment });

  const isCancelled = appointment.status === 'Cancelled';

  const handleModify = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    onUpdate({ status: 'Cancelled' });
  };

  const handleSave = () => {
    const patch: Partial<Appointment> = {
      truckNumber: editData.truckNumber,
      driverName: editData.driverName,
      appointmentDate: editData.appointmentDate,
      purpose: editData.purpose,
      portOfEntry: editData.portOfEntry,
      status: editData.status,
      comments: editData.comments
    };
    onUpdate(patch);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <tr className={isCancelled ? "row-disabled" : ""}>
        {/* Truck Number */}
        <td>
          {isEditing ? (
            <input
              value={editData.truckNumber}
              onChange={(e) => handleChange("truckNumber", e.target.value)}
            />
          ) : (
            appointment.truckNumber
          )}
        </td>

        {/* Driver Name */}
        <td>
          {isEditing ? (
            <input
              value={editData.driverName}
              onChange={(e) => handleChange("driverName", e.target.value)}
            />
          ) : (
            appointment.driverName
          )}
        </td>

        {/* Appointment Date */}
        <td>
          {isEditing ? (
            <input
              type="datetime-local"
              value={editData.appointmentDate}
              onChange={(e) => handleChange("appointmentDate", e.target.value)}
            />
          ) : (
            new Date(appointment.appointmentDate).toLocaleString()
          )}
        </td>

        {/* Purpose */}
        <td>
          {isEditing ? (
            <select
              value={editData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            >
              <option value="Delivery">Delivery</option>
              <option value="Pickup">Pickup</option>
              <option value="Inspection">Inspection</option>
            </select>
          ) : (
            appointment.purpose
          )}
        </td>

        {/* Port of Entry */}
        <td>
          {isEditing ? (
            <select
              value={editData.portOfEntry}
              onChange={(e) => handleChange("portOfEntry", e.target.value)}
            >
              <option value="Abu Dhabi Port">Abu Dhabi Port</option>
              <option value="Dubai Port">Dubai Port</option>
              <option value="Sharjah Port">Sharjah Port</option>
            </select>
          ) : (
            appointment.portOfEntry
          )}
        </td>

        {/* Status */}
        <td>
          {isEditing ? (
            <select
              value={editData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          ) : (
            appointment.status
          )}
        </td>
          <td>{ appointment.comments}</td>
        {/* Action Buttons */}
        <td>
          {isCancelled ? (
            <span className="badge cancelled">Cancelled</span>
          ) : (
            <>
              {!isEditing && (
                <>
                  <button className="btn modify" onClick={handleModify}>
                    Modify
                  </button>
                  {/* <button className="btn cancel" onClick={handleCancel}>
                    Cancel
                  </button> */}
                </>
              )}

              {isEditing && (
                <>
                  <button className="btn save" onClick={handleSave}>
                    Save
                  </button>
                  <button className="btn secondary" onClick={() => setIsEditing(false)}>
                    Close
                  </button>
                </>
              )}
            </>
          )}
        </td>
      </tr>
    </>
  );
}
