import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Modern browsers support addEventListener on MediaQueryList
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mq.addListener(handler);
    }

    // Initialize with current value
    setMatches(mq.matches);

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}
