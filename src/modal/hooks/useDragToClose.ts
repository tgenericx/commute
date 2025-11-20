import { useState, useRef, useCallback, useEffect } from 'react';
import type { UseDragToCloseProps, UseDragToCloseReturn } from '../types/modal';

export const useDragToClose = ({ dismissable, threshold, onClose }: UseDragToCloseProps): UseDragToCloseReturn => {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartYRef = useRef(0);
  const lastYRef = useRef(0);
  const velocityRef = useRef(0);
  const startYRef = useRef(0);

  // Reset drag state when modal closes
  useEffect(() => {
    if (!dismissable) {
      setDragY(0);
      setIsDragging(false);
    }
  }, [dismissable]);

  const handleDragStart = useCallback((clientY: number) => {
    if (!dismissable) return;
    
    setDragY(0);
    setIsDragging(true);
    startYRef.current = clientY;
    dragStartYRef.current = clientY;
    lastYRef.current = clientY;
    velocityRef.current = 0;
  }, [dismissable]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging || !dismissable) return;
    
    const deltaY = clientY - startYRef.current;
    
    // Calculate velocity
    const timeDelta = 16;
    velocityRef.current = (clientY - lastYRef.current) / timeDelta;
    lastYRef.current = clientY;
    
    // Only allow dragging down with resistance
    if (deltaY > 0) {
      const resistance = Math.min(1, 1 - deltaY / 1000);
      setDragY(deltaY * resistance);
    }
  }, [isDragging, dismissable]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !dismissable) return;
    
    const shouldClose = dragY > threshold || velocityRef.current > 0.5;
    
    if (shouldClose) {
      // Reset drag state immediately when closing
      setDragY(0);
      setIsDragging(false);
      onClose?.();
    } else {
      // Animate back to position if not closing
      setDragY(0);
      setIsDragging(false);
    }
  }, [isDragging, dismissable, dragY, threshold, onClose]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    handleDragMove(touch.clientY);
  }, [isDragging, handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientY);
  }, [handleDragStart]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
      const handleMouseUp = () => handleDragEnd();

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  return {
    dragY,
    isDragging,
    bind: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
    }
  };
};
