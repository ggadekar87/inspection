// src/layout/MainLayout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
    </div>
  );
}
