import { createContext, ReactNode, useReducer, Dispatch } from "react";
import { direction, Grid, GridTypes, mazeCell, path } from "./types";

const initialGrid: Grid = {
  type: "rectangle",
  sizeA: 10,
  sizeB: 10,
  gridCells: Array(10).fill(Array(10).fill(false)),
  paths: [],
};

export const GridContext = createContext<{
  state: Grid;
  dispatch: Dispatch<any>;
}>({ state: initialGrid, dispatch: () => {} });

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const [grid, dispatch] = useReducer(GridReducer, initialGrid);

  return (
    <GridContext.Provider value={{ state: grid, dispatch }}>
      {children}
    </GridContext.Provider>
  );
};

export type GridAction =
  | { type: "SET_TYPE"; payload: GridTypes }
  | { type: "SET_SIZE"; payload: { a: number; b: number } }
  | {
      type: "SET_GRID_CELL";
      payload: { x: number; y: number; value: boolean };
    }
  | { type: "SET_PATHS"; payload: path[] };

export const GridReducer = (state: Grid, action: GridAction): Grid => {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_SIZE":
      return {
        ...state,
        sizeA: action.payload.a,
        sizeB: action.payload.b,
        gridCells: Array(action.payload.a).fill(
          Array(action.payload.b).fill(false)
        ),
      };
    case "SET_GRID_CELL":
      return {
        ...state,
        gridCells: state.gridCells.map((row, y) =>
          row.map((field, x) =>
            x === action.payload.x && y === action.payload.y
              ? action.payload.value
              : field
          )
        ),
      };
    case "SET_PATHS":
      return {
        ...state,
        paths: action.payload,
      };
    default:
      return state;
  }
};
