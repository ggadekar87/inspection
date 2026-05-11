// src/layout/Topbar.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

export default function Topbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>Inspection</strong>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.name} ({user.role})</span>
            <button className="btn" onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <span>Not signed in</span>
        )}
      </div>
    </div>
  );
}
