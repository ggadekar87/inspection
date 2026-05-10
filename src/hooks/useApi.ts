// src/hooks/useApi.ts
import { useEffect, useRef, useState } from 'react';

export default function useApi<T>(fn: (...args: any[]) => Promise<T>, deps: any[] = []) {
  const mounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const call = async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      if (mounted.current) setData(res);
      return res;
    } catch (err) {
      if (mounted.current) setError(err);
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  return { loading, data, error, call };
}
