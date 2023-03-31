export type GridTypes = "rectangle" | "hex" | "triangle" | "concentric";

export type Grid = {
  type: GridTypes;
  sizeA: number;
  sizeB: number;
  cells: boolean[][]; // true = field, false = wall
};
