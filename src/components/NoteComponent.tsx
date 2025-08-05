import { useState, useEffect } from 'react';
import { motion, useDragControls } from 'motion/react';
import { type Note } from '../types';

interface NoteComponentProps {
  note: Note;
  onDrag: (id: string, x: number, y: number) => void;
  onContentChange: (id: string, content: string) => void;
}

export const NoteComponent = ({ note, onDrag, onContentChange }: NoteComponentProps) => {
  const [localContent, setLocalContent] = useState(note.content);
  const dragControls = useDragControls();

  // Update local content when note content changes externally (from other users)
  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  const handleBlur = () => {
    // Only commit if content actually changed
    if (localContent !== note.content) {
      onContentChange(note.id, localContent);
    }
  };

  return (
    <motion.div
      className="absolute bg-white border-2 border-gray-900 shadow-sm group"
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
        className="bg-gray-900 text-xs text-white flex justify-between cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onPointerDown={(e) => dragControls.start(e)}
      >
        {note.id}

        <button className="px-2">x</button>
      </div>
      <textarea
        className="w-full h-full bg-transparent resize-none border-none outline-none text-sm p-1"
        value={localContent}
        placeholder="Type your note..."
        onChange={(event) => setLocalContent(event.target.value)}
        onBlur={handleBlur}
      />
    </motion.div>
  );
};
