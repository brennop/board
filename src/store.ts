import { useState, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { type Note } from './types';

let globalDoc: Y.Doc | null = null;
let globalProvider: WebrtcProvider | null = null;

export function useCollaborativeNotes(roomName: string = 'board-room') {
  const [notes, setNotes] = useState<Note[]>([]);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);
  const notesArrayRef = useRef<Y.Array<Note> | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const host = window.location.host;
    const wsUrl = protocol + host;

    // Reuse global instances to prevent multiple connections
    if (!globalDoc) {
      globalDoc = new Y.Doc();
      globalProvider = new WebrtcProvider(roomName, globalDoc, {
        signaling: [wsUrl],
      });
    }

    ydocRef.current = globalDoc;
    providerRef.current = globalProvider;
    notesArrayRef.current = globalDoc.getArray<Note>('notes');

    // Initial state
    setNotes(notesArrayRef.current.toArray());

    // Subscribe to changes
    const updateNotes = () => {
      if (notesArrayRef.current) {
        setNotes(notesArrayRef.current.toArray());
      }
    };

    notesArrayRef.current.observe(updateNotes);

    return () => {
      if (notesArrayRef.current) {
        notesArrayRef.current.unobserve(updateNotes);
      }
    };
  }, [roomName]);

  const addNote = (note: Note) => {
    if (notesArrayRef.current) {
      notesArrayRef.current.push([note]);
    }
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    if (!notesArrayRef.current) return;

    const index = notesArrayRef.current.toArray().findIndex(note => note.id === id);
    if (index !== -1) {
      const currentNote = notesArrayRef.current.get(index);
      const updatedNote = { ...currentNote, ...updates };
      notesArrayRef.current.delete(index, 1);
      notesArrayRef.current.insert(index, [updatedNote]);
    }
  };

  const deleteNote = (id: string) => {
    if (!notesArrayRef.current) return;

    const index = notesArrayRef.current.toArray().findIndex(note => note.id === id);
    if (index !== -1) {
      notesArrayRef.current.delete(index, 1);
    }
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
}
