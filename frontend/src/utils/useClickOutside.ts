import { useRef, useCallback } from 'react';

/**
 * Custom hook for handling click outside functionality
 * @param onClickOutside - Callback function to execute when clicking outside
 * @returns Object containing the ref to attach to the modal element and the click handler
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  onClickOutside: () => void
) => {
  const elementRef = useRef<T>(null);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
      onClickOutside();
    }
  }, [onClickOutside]);

  return {
    elementRef,
    handleBackdropClick
  };
};

export default useClickOutside;
