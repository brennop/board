import { motion } from 'motion/react';
import { type Note } from '../types';

interface NoteComponentProps {
  note: Note;
  onDrag: (id: string, x: number, y: number) => void;
  onContentChange: (id: string, content: string) => void;
}

export const NoteComponent = ({ note, onDrag, onContentChange }: NoteComponentProps) => {
  return (
    <motion.div
      className="absolute bg-white border-2 border-gray-900 shadow-sm"
      style={{
        width: note.width,
        height: note.height,
      }}
      initial={{ x: note.x, y: note.y }}
      animate={{ x: note.x, y: note.y }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(event, info) => {
        onDrag(note.id, note.x + info.offset.x, note.y + info.offset.y);
      }}
    >
      <div className="bg-gray-900 text-xs text-white flex justify-between cursor-move">
        {note.id}

        <button className="px-2">x</button>
      </div>
      <textarea
        className="w-full h-full bg-transparent resize-none border-none outline-none text-sm"
        value={note.content}
        placeholder="Type your note..."
        onChange={(event) => onContentChange(note.id, event.target.value)}
      />
    </motion.div>
  );
};
