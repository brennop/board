import { motion, useDragControls } from 'motion/react';
import { useState, useEffect } from 'react';
import { type Note } from '../types';
import { useNoteEditing } from '../hooks/useNoteEditing';
import { useNoteResize } from '../hooks/useNoteResize';
import { useImageNoteResize } from '../hooks/useImageNoteResize';
import { NoteHeader } from './NoteHeader';
import { NoteContent } from './NoteContent';
import { ResizeHandle } from './ResizeHandle';
import { getImageAspectRatio } from '../utils/clipboard';

interface NoteComponentProps {
  note: Note;
  onDrag: (id: string, x: number, y: number) => void;
  onContentChange: (id: string, content: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
}

export const NoteComponent = ({ note, onDrag, onContentChange, onResize, onDelete }: NoteComponentProps) => {
  const dragControls = useDragControls();
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  
  const {
    localContent,
    setLocalContent,
    isEditing,
    textareaRef,
    startEditing,
    stopEditing,
    handleKeyDown,
  } = useNoteEditing({
    initialContent: note.content,
    onContentChange: (content) => onContentChange(note.id, content),
  });

  // Use different resize hooks based on note type
  const textResizeHook = useNoteResize({
    initialWidth: note.width,
    initialHeight: note.height,
    onResize: (width, height) => onResize(note.id, width, height),
  });

  const imageResizeHook = useImageNoteResize({
    initialWidth: note.width,
    initialHeight: note.height,
    aspectRatio,
    onResize: (width, height) => onResize(note.id, width, height),
  });

  const { isResizing, handleResizeStart } = note.type === 'image' ? imageResizeHook : textResizeHook;

  // Calculate aspect ratio for image notes
  useEffect(() => {
    if (note.type === 'image' && note.content) {
      getImageAspectRatio(note.content).then(setAspectRatio);
    }
  }, [note.type, note.content]);

  return (
    <motion.div
      className={`absolute bg-white flex flex-col border-2 shadow-sm group ${
        note.type === 'image' 
          ? 'border-blue-500 cursor-move' 
          : 'border-gray-900'
      }`}
      style={{
        width: note.width,
        height: note.height,
      }}
      initial={{ x: note.x, y: note.y }}
      animate={{ x: note.x, y: note.y }}
      drag={!isResizing}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        onDrag(note.id, note.x + info.offset.x, note.y + info.offset.y);
      }}
    >
      <NoteHeader 
        noteId={note.id}
        isEditing={isEditing}
        onDelete={onDelete}
        dragControls={dragControls}
      />
      
      <NoteContent
        isEditing={isEditing}
        localContent={localContent}
        noteType={note.type}
        noteWidth={note.width}
        noteHeight={note.height}
        textareaRef={textareaRef}
        onContentChange={setLocalContent}
        onStartEditing={startEditing}
        onStopEditing={stopEditing}
        onKeyDown={handleKeyDown}
      />
      
      <ResizeHandle onResizeStart={handleResizeStart} />
    </motion.div>
  );
};
