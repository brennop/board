export const GRID_SIZE = 16;

export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export const snapPositionToGrid = (x: number, y: number): { x: number; y: number } => {
  return {
    x: snapToGrid(x),
    y: snapToGrid(y)
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

