// src/layout/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function Sidebar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const role = user?.role;

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 20 }}>
        <h2>TruckApp</h2>
        <div style={{ fontSize: 13, color: '#cbd5e1' }}>{user ? `${user.name} (${role})` : 'Guest'}</div>
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/appointments">Appointments</Link></li>
          <li><Link to="/reports">Reports</Link></li> 
          <li><Link to="/new-appointment">New Appointment</Link></li>
          <li><Link to="/support">Support</Link></li>
          {role === 'Driver' && <li><Link to="/new-appointment">New Appointment</Link></li>}
          {!user ? <li><Link to="/login">Login  </Link></li>:<li><Link to="/signup"> SignUp</Link></li>}
        </ul>
      </nav>
    </aside>
  );
}
