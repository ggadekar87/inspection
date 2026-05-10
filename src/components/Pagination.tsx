// src/components/Pagination.tsx
import React from 'react';

export default function Pagination({
  current,
  pageSize,
  total,
  onChange,
}: {
  current: number;
  pageSize: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="pagination">
      <button className="btn" disabled={current <= 1} onClick={() => onChange(current - 1)}>
        Prev
      </button>
      <span>
        Page {current} of {totalPages}
      </span>
      <button className="btn" disabled={current >= totalPages} onClick={() => onChange(current + 1)}>
        Next
      </button>
    </div>
  );
}
