export type Note = {
  id: string;
  content: string;
  type: 'text';
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AppState = {
  notes: Note[];
}
