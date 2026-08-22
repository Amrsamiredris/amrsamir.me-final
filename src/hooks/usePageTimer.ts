'use client';

import { useEffect, useRef } from 'react';
import { trackTimeSpent } from '@/lib/analytics';

export function usePageTimer(page: 'cv' | 'portfolio') {
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const loggedRef = useRef<boolean>(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    accumulatedRef.current = 0;
    loggedRef.current = false;

    const getSessionDuration = () => {
      const start = startTimeRef.current;
      const activeDuration = start > 0 ? Math.max(0, Math.round((Date.now() - start) / 1000)) : 0;
      return accumulatedRef.current + activeDuration;
    };

    const logFinalDuration = () => {
      if (loggedRef.current) return;
      const totalSeconds = getSessionDuration();
      if (totalSeconds > 0) {
        trackTimeSpent(page, totalSeconds);
        loggedRef.current = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const start = startTimeRef.current;
        accumulatedRef.current += start > 0 ? Math.max(0, Math.round((Date.now() - start) / 1000)) : 0;
      } else {
        startTimeRef.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      logFinalDuration();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      logFinalDuration();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [page]);
}
