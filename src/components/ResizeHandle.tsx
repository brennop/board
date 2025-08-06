interface ResizeHandleProps {
  onResizeStart: (event: React.PointerEvent) => void;
}

export const ResizeHandle = ({ onResizeStart }: ResizeHandleProps) => {
  return (
    <div
      className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 opacity-0 group-hover:opacity-100 cursor-se-resize transition-opacity duration-200"
      onPointerDown={onResizeStart}
      style={{
        clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
      }}
    />
  );
};