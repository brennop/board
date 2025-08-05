import { type MouseEvent } from 'react';
import { type Note } from '../types';
import { NoteComponent } from './NoteComponent';
import { snapPositionToGrid, generateId } from '../utils';
import { useCollaborativeNotes } from '../store';

const DEFAULT_NOTE_WIDTH = 200;
const DEFAULT_NOTE_HEIGHT = 100;

export const Board = () => {
  const { notes, addNote, updateNote } = useCollaborativeNotes();

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left + event.currentTarget.scrollLeft;
    const y = event.clientY - rect.top + event.currentTarget.scrollTop;

    const snappedPosition = snapPositionToGrid(x, y);

    const newNote: Note = {
      id: generateId(),
      content: '',
      type: 'text',
      x: snappedPosition.x,
      y: snappedPosition.y,
      width: DEFAULT_NOTE_WIDTH,
      height: DEFAULT_NOTE_HEIGHT,
    };

    addNote(newNote);
  };

  const handleNoteDrag = (id: string, x: number, y: number) => {
    const snappedPosition = snapPositionToGrid(x, y);
    updateNote(id, { x: snappedPosition.x, y: snappedPosition.y });
  };

  const handleNoteContentChange = (id: string, content: string) => {
    updateNote(id, { content });
  };

  return (
    <div
      className="w-full h-screen overflow-auto bg-gray-50 relative cursor-crosshair"
      onDoubleClick={handleDoubleClick}
      style={{
        backgroundImage: `
          radial-gradient(circle, #d1d5db 1px, transparent 1px)
        `,
        backgroundSize: '8px 8px',
      }}
    >
      <div
        className="relative"
        style={{
          width: '200vw',
          height: '200vh',
          minWidth: '2000px',
          minHeight: '2000px'
        }}
      >
        {notes.map(note => (
          <NoteComponent 
            key={note.id} 
            note={note} 
            onDrag={handleNoteDrag} 
            onContentChange={handleNoteContentChange} 
          />
        ))}
      </div>
    </div>
  );
};
