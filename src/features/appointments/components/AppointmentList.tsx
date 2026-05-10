// src/features/appointments/components/AppointmentList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, updateAppointment } from '../appointmentsSlice';
import type { RootState, AppDispatch } from '../../../app/store';
import useDebounce from '../../../hooks/useDebounce';
import Pagination from '../../../components/Pagination';
import AppointmentRow from './AppointmentRow';

export default function AppointmentList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading } = useSelector((s: RootState) => s.appointments);
  const user = useSelector((s: RootState) => s.auth.user);
  const role = user?.role ?? null;

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchCols, setSearchCols] = useState({ truckNumber: '', driverName: '' });
  const debouncedSearch = useDebounce(searchCols, 400);

  useEffect(() => {
    dispatch(fetchAppointments( ));
  }, [dispatch, page, pageSize, debouncedSearch]);

  const columns = useMemo(() => {
    return ['Truck Number', 'Driver Name', 'Appointment', 'Purpose', 'Port of Entry', 'Status', 'Action'];
  }, []);

  return (
    <div className="card">
      <h3>Appointments</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
            <tr>
              <th>
                <input
                  placeholder="Search truck"
                  value={searchCols.truckNumber}
                  onChange={(e) => setSearchCols((s) => ({ ...s, truckNumber: e.target.value }))}
                />
              </th>
              <th>
                <input
                  placeholder="Search driver"
                  value={searchCols.driverName}
                  onChange={(e) => setSearchCols((s) => ({ ...s, driverName: e.target.value }))}
                />
              </th>
              <th />
              <th />
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7}>No appointments</td>
              </tr>
            ) : (
              items.map((a) => (
                <AppointmentRow key={a.id} appointment={a} role={role} onUpdate={(patch) => dispatch(updateAppointment({ id: a.id, patch }))} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination current={page} pageSize={pageSize} total={total} onChange={setPage} />
    </div>
  );
}
