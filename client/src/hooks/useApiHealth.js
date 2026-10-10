import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchHealth } from '../services/healthService.js';

const INITIAL_STATE = { status: 'loading', data: null, checkedAt: null };

export function useApiHealth() {
  const [state, setState] = useState(INITIAL_STATE);
  const controllerRef = useRef(null);

  const check = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((previous) => ({ ...previous, status: 'loading' }));
    try {
      const data = await fetchHealth({ signal: controller.signal });
      setState({ status: 'success', data, checkedAt: new Date() });
    } catch (error) {
      if (error.name === 'AbortError') return;
      setState({ status: 'error', data: null, checkedAt: new Date() });
    }
  }, []);

  useEffect(() => {
    check();
    return () => controllerRef.current?.abort();
  }, [check]);

  return { ...state, refresh: check };
}
