// AppointmentForm.test.tsx
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AppointmentForm from  './AppointmentForm';
import { renderWithStore } from    '../../../testUtils/renderWithStore';
import { createAppointment } from  '../appointmentsSlice';
jest.mock('../../appointmentsSlice', () => ({
  createAppointment: jest.fn((payload) => ({
    type: 'appointments/createAppointment/fulfilled',
    payload
  }))
}));

describe('AppointmentForm', () => {
  test('submits form and calls createAppointment + onDone', async () => {
    const onDone = jest.fn();

    renderWithStore(<AppointmentForm onDone={onDone} />);

    fireEvent.change(screen.getByLabelText(/Truck Number/i), {
      target: { value: 'TRK-1001' }
    });
    fireEvent.change(screen.getByLabelText(/Driver Name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/Appointment Date/i), {
      target: { value: '2026-05-10T10:00' }
    });
    fireEvent.change(screen.getByLabelText(/Purpose/i), {
      target: { value: 'Delivery' }
    });
    fireEvent.change(screen.getByLabelText(/Port of Entry/i), {
      target: { value: 'Port A' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Schedule/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalledWith({
        truckNumber: 'TRK-1001',
        driverName: 'John Doe',
        appointmentDate: '2026-05-10T10:00',
        purpose: 'Delivery',
        portOfEntry: 'Port A'
      });
    });

    expect(onDone).toHaveBeenCalled();
  });

  test('shows error when thunk throws', async () => {
    (createAppointment as unknown as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Failed to create');
    });

    renderWithStore(<AppointmentForm />);

    fireEvent.change(screen.getByLabelText(/Truck Number/i), {
      target: { value: 'TRK-1001' }
    });
    fireEvent.change(screen.getByLabelText(/Driver Name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/Appointment Date/i), {
      target: { value: '2026-05-10T10:00' }
    });
    fireEvent.change(screen.getByLabelText(/Purpose/i), {
      target: { value: 'Delivery' }
    });
    fireEvent.change(screen.getByLabelText(/Port of Entry/i), {
      target: { value: 'Port A' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Schedule/i }));

    expect(await screen.findByText(/Failed to create/i)).toBeInTheDocument();
  });

  test('shows loading state', async () => {
    renderWithStore(<AppointmentForm />);

    fireEvent.change(screen.getByLabelText(/Truck Number/i), {
      target: { value: 'TRK-1001' }
    });
    fireEvent.change(screen.getByLabelText(/Driver Name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/Appointment Date/i), {
      target: { value: '2026-05-10T10:00' }
    });
    fireEvent.change(screen.getByLabelText(/Purpose/i), {
      target: { value: 'Delivery' }
    });
    fireEvent.change(screen.getByLabelText(/Port of Entry/i), {
      target: { value: 'Port A' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Schedule/i }));

    expect(screen.getByText(/Scheduling.../i)).toBeInTheDocument();
  });
});
