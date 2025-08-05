import { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'motion/react';
import { type Note } from '../types';
import { renderMarkdown } from '../utils';

interface NoteComponentProps {
  note: Note;
  onDrag: (id: string, x: number, y: number) => void;
  onContentChange: (id: string, content: string) => void;
}

export const NoteComponent = ({ note, onDrag, onContentChange }: NoteComponentProps) => {
  const [localContent, setLocalContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const [renderedMarkdown, setRenderedMarkdown] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragControls = useDragControls();

  // Update local content when note content changes externally (from other users)
  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  // Render markdown when not editing
  useEffect(() => {
    if (!isEditing && localContent.trim()) {
      renderMarkdown(localContent).then(setRenderedMarkdown);
    }
  }, [localContent, isEditing]);

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

  return (
    <motion.div
      className="absolute bg-white flex flex-col border-2 border-gray-900 shadow-sm group"
      style={{
        width: note.width,
        height: note.height,
      }}
      initial={{ x: note.x, y: note.y }}
      animate={{ x: note.x, y: note.y }}
      drag
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
          className="w-full h-full cursor-pointer overflow-auto prose prose-sm prose-serif max-w-none p-1"
          onClick={handleClick}
          dangerouslySetInnerHTML={{ 
            __html: renderedMarkdown || localContent || '<span class="text-gray-400">Click to edit...</span>' 
          }}
        />
      )}
    </motion.div>
  );
};
