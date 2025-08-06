export type Note = {
  id: string;
  content: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AppState = {
  notes: Note[];
}
