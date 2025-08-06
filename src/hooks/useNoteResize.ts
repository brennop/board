import { useState } from 'react';

interface UseNoteResizeProps {
  initialWidth: number;
  initialHeight: number;
  onResize: (width: number, height: number) => void;
}

export const useNoteResize = ({ initialWidth, initialHeight, onResize }: UseNoteResizeProps) => {
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
      const newWidth = Math.max(100, startWidth + deltaX);
      const newHeight = Math.max(60, startHeight + deltaY);
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