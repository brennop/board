import { useState } from 'react';

interface UseImageNoteResizeProps {
  initialWidth: number;
  initialHeight: number;
  aspectRatio: number;
  onResize: (width: number, height: number) => void;
}

export const useImageNoteResize = ({ 
  initialWidth, 
  initialHeight, 
  aspectRatio, 
  onResize 
}: UseImageNoteResizeProps) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = initialWidth;
    const startHeight = initialHeight;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Calculate new dimensions based on the largest delta to maintain aspect ratio
      const newWidthFromX = Math.max(100, startWidth + deltaX);
      const newHeightFromY = Math.max(60, startHeight + deltaY);
      
      // Choose the dimension that changed more significantly
      const widthChange = Math.abs(deltaX) / startWidth;
      const heightChange = Math.abs(deltaY) / startHeight;
      
      let newWidth: number;
      let newHeight: number;
      
      if (widthChange > heightChange) {
        // Width changed more, calculate height from width
        newWidth = newWidthFromX;
        newHeight = newWidth / aspectRatio;
      } else {
        // Height changed more, calculate width from height
        newHeight = newHeightFromY;
        newWidth = newHeight * aspectRatio;
      }
      
      // Apply minimum constraints
      newWidth = Math.max(100, newWidth);
      newHeight = Math.max(60, newHeight);
      
      // Recalculate to maintain aspect ratio after applying constraints
      if (newWidth / aspectRatio < 60) {
        newHeight = 60;
        newWidth = newHeight * aspectRatio;
      } else if (newHeight * aspectRatio < 100) {
        newWidth = 100;
        newHeight = newWidth / aspectRatio;
      }
      
      onResize(newWidth, newHeight);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return {
    isResizing,
    handleResizeStart,
  };
};