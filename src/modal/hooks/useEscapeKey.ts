import { useEffect } from 'react';

export const useEscapeKey = (isEnabled: boolean, onClose?: () => void) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEnabled) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isEnabled, onClose]);
};
