// src/hooks/usePagination.ts
import { useState } from 'react';

export default function usePagination(initialPage = 1, initialSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const reset = () => setPage(1);

  return { page, setPage, pageSize, setPageSize, reset };
}
