 
// src/features/appointments/components/AppointmentList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import './Dashboard.css';
import useDebounce from 'hooks/useDebounce'; 
import { fetchAppointments } from 'features/appointments/appointmentsSlice';
type Status = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

interface Appointment {
  id: string;
  status: Status;
}

export default function Dashboard( ) {
  const counts: Record<Status, number> = {
    Pending: 0,
    Approved: 0,
    Rejected: 0,
    Cancelled: 0,
  };
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading } = useSelector((s: RootState) => s.appointments);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [searchCols, setSearchCols] = useState({ truckNumber: '', driverName: '' });
  const debouncedSearch = useDebounce(searchCols, 400);

  useEffect(() => {
    dispatch(fetchAppointments({ page, pageSize, search: debouncedSearch }));
  }, [dispatch, page, pageSize, debouncedSearch]);

  items.forEach((a: any) => {
    if (counts[a.status as Status] !== undefined) counts[a.status as Status] += 1;
  });

  const totals = items.length || 1; // avoid divide by zero

  const cards: { label: Status; color: string }[] = [
    { label: 'Pending', color: '#fbbf24' },   // amber
    { label: 'Approved', color: '#22c55e' },  // green
    { label: 'Rejected', color: '#ef4444' },  // red
    { label: 'Cancelled', color: '#6b7280' }, // gray
  ];

  return (
    <div className="status-dashboard">
      {cards.map(({ label, color }) => {
        const value = counts[label];
        const percent = Math.round((value / total) * 100);

        return (
          <div key={label} className="status-card">
            <div className="status-circle" style={{ backgroundColor: color }}>
              <span className="status-value">{value}</span>
            </div>
            <div className="status-meta">
              <div className="status-label">{label}</div>
              <div className="status-percent">{loading ? 'Loading...' : `${percent}%`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
 