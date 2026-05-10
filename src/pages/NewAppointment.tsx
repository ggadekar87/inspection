// src/pages/NewAppointment.tsx
import React from 'react';
import AppointmentForm from '../features/appointments/components/AppointmentForm';

export default function NewAppointment() {
  return (
    <div>
      <AppointmentForm onDone={() => alert('Appointment scheduled (mock)')} />
    </div>
  );
}
