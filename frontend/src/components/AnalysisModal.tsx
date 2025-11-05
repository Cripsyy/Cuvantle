import React, { useState } from 'react';
import { useClickOutside } from '../utils/useClickOutside';
import useMediaQuery from '../utils/useMediaQuery';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ 
  isOpen, 
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const isMobile = !useMediaQuery('(min-width: 768px)'); // Below md breakpoint is mobile
  
  const handleClose = () => {
    if (isMobile) {
      // Mobile: play slidedown animation then close after delay
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300); // Match the duration of slideDown animation
    } else {
      // Desktop: close immediately (no animation)
      onClose();
    }
  };
  
  const { elementRef: modalRef, handleBackdropClick } = useClickOutside(handleClose);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 md:items-center"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`w-full max-w-md bg-white rounded-t-2xl md:rounded-lg shadow-lg dark:bg-gray-800 md:mx-4 max-h-[85vh] overflow-y-auto ${
          isClosing 
            ? 'animate-slide-down md:animate-none' 
            : 'animate-slide-up md:animate-none'
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg font-bold sm:text-xl">Informații despre metrici</h2>
            <button
              onClick={handleClose}
              className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="mb-4 text-sm text-gray-700 sm:text-base dark:text-gray-300">
            Aceste metrici vă ajută să înțelegeți performanța jocului:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Noroc</h3>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Măsoară cât de norocosă a fost încercarea dvs. (0-100)
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Abilitate</h3>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Măsoară cât de bună a fost încercarea dvs. (0-100)
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Cuvinte rămase</h3>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Câte cuvinte posibile mai sunt compatibile cu indiciile
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Informație</h3>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Procentul de informație obținută până la încercarea curentă
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
