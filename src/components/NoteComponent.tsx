import { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Note } from '../types';

interface NoteComponentProps {
  note: Note;
  onDrag: (id: string, x: number, y: number) => void;
  onContentChange: (id: string, content: string) => void;
  onResize: (id: string, width: number, height: number) => void;
}

export const NoteComponent = ({ note, onDrag, onContentChange, onResize }: NoteComponentProps) => {
  const [localContent, setLocalContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragControls = useDragControls();

  // Update local content when note content changes externally (from other users)
  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      // Use setTimeout to ensure the textarea is rendered before selecting
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Only commit if content actually changed
    if (localContent !== note.content) {
      onContentChange(note.id, localContent);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  const handleResizeStart = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = note.width;
    const startHeight = note.height;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newWidth = Math.max(100, startWidth + deltaX);
      const newHeight = Math.max(60, startHeight + deltaY);
      onResize(note.id, newWidth, newHeight);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <motion.div
      className="absolute bg-white flex flex-col border-2 border-gray-900 shadow-sm group"
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
      <div 
        className={`${isEditing ? 'bg-blue-600' : 'bg-gray-900'} text-xs text-white flex justify-between cursor-move opacity-0 group-hover:opacity-100 transition-all duration-200 relative`}
        onPointerDown={(e) => dragControls.start(e)}
      >
        {note.id}

        <button className="px-2">x</button>
      </div>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="w-full h-full bg-transparent resize-none border-none outline-none text-sm p-1 font-mono"
          value={localContent}
          placeholder="Type your note..."
          onChange={(event) => setLocalContent(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className="w-full h-full cursor-auto overflow-auto prose prose-sm prose-serif max-w-none pt-0 p-2 font-serif"
          onDoubleClick={handleClick}
        >
          {localContent.trim() ? (
            <Markdown remarkPlugins={[remarkGfm]}>{localContent}</Markdown>
          ) : (
            <span className="text-gray-400">Double click to edit...</span>
          )}
        </div>
      )}
      
      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 opacity-0 group-hover:opacity-100 cursor-se-resize transition-opacity duration-200"
        onPointerDown={handleResizeStart}
        style={{
          clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
        }}
      />
    </motion.div>
  );
};
