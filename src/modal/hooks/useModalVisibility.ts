import { useState, useEffect } from 'react';

export const useModalVisibility = (isOpen: boolean, animationDuration: number) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // When opening: set visible immediately, then start animation
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), animationDuration);
      return () => clearTimeout(timer);
    } else {
      // When closing: start animation, then set invisible after it completes
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);

  return { isVisible, isAnimating };
};
