export type GridTypes = "rectangle" | "hex" | "triangle" | "concentric";
export type direction = "up" | "down" | "left" | "right" | "none";
export type coord = [number, number];
export type mazeCell = {
  coords: coord;
  direction: direction;
  parentPath: number; // id of the path
};

export type path = {
  cells: mazeCell[];
  depth: number;
  id: number;
};

export type Grid = {
  type: GridTypes;
  sizeA: number;
  sizeB: number;
  gridCells: boolean[][]; // true = field, false = wall
  paths: path[];
};
