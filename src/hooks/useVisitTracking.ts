'use client';

import { useCallback } from 'react';

const VISIT_PREFIX = 'visited_';

interface UseVisitTrackingReturn {
  hasVisited: (id: string) => boolean;
  markVisited: (id: string) => void;
  clearVisit: (id: string) => void;
  clearAllVisits: () => void;
}

export function useVisitTracking(): UseVisitTrackingReturn {
  const hasVisited = useCallback((id: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${VISIT_PREFIX}${id}`) === 'true';
  }, []);

  const markVisited = useCallback((id: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${VISIT_PREFIX}${id}`, 'true');
  }, []);

  const clearVisit = useCallback((id: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${VISIT_PREFIX}${id}`);
  }, []);

  const clearAllVisits = useCallback((): void => {
    if (typeof window === 'undefined') return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(VISIT_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }, []);

  return {
    hasVisited,
    markVisited,
    clearVisit,
    clearAllVisits,
  };
}
