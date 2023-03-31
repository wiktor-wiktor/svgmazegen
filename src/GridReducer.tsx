import { createContext, ReactNode, useReducer, Dispatch } from "react";
import { Grid, GridTypes } from "./types";

const initialGrid: Grid = {
  type: "rectangle",
  sizeA: 10,
  sizeB: 10,
  cells: Array(10).fill(Array(10).fill(false)),
};

export const GridContext = createContext<{
  state: Grid;
  dispatch: Dispatch<any>;
}>({ state: initialGrid, dispatch: () => {} });

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const [grid, dispatch] = useReducer(GridReducer, initialGrid);

  console.log("grid", grid);

  return (
    <GridContext.Provider value={{ state: grid, dispatch }}>
      {children}
    </GridContext.Provider>
  );
};

export type GridAction =
  | { type: "SET_TYPE"; payload: GridTypes }
  | { type: "SET_SIZE"; payload: { a: number; b: number } }
  | { type: "SET_FIELD"; payload: { x: number; y: number; value: boolean } };

export const GridReducer = (state: Grid, action: GridAction): Grid => {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_SIZE":
      return {
        ...state,
        sizeA: action.payload.a,
        sizeB: action.payload.b,
        cells: Array(action.payload.a).fill(
          Array(action.payload.b).fill(false)
        ),
      };
    case "SET_FIELD":
      return {
        ...state,
        cells: state.cells.map((row, y) =>
          row.map((field, x) =>
            x === action.payload.x && y === action.payload.y
              ? action.payload.value
              : field
          )
        ),
      };
    default:
      return state;
  }
};
