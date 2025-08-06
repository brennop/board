import { useDragControls } from 'motion/react';

interface NoteHeaderProps {
  noteId: string;
  isEditing: boolean;
  onDelete: (id: string) => void;
  dragControls: ReturnType<typeof useDragControls>;
}

export const NoteHeader = ({ noteId, isEditing, onDelete, dragControls }: NoteHeaderProps) => {
  return (
    <div 
      className={`${isEditing ? 'bg-blue-600' : 'bg-gray-900'} text-xs text-white flex justify-between cursor-move opacity-0 group-hover:opacity-100 transition-all duration-200 relative`}
      onPointerDown={(e) => dragControls.start(e)}
    >
      {noteId}

      <button 
        className="px-2 hover:bg-red-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(noteId);
        }}
      >
        x
      </button>
    </div>
  );
};