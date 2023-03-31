import { useReducer } from "react";
import { GridSettings } from "./GridSettings/GridSettings";
import { GridProvider, GridReducer } from "./gridReducer";
import { Grid } from "./types";
import "./App.css";

export const INITIAL_GRID: Grid = {
  type: "rectangle",
  sizeA: 10,
  sizeB: 10,
  cells: Array(10).fill(Array(10).fill(false)),
};

function App() {
  return (
    <div className="App">
      <h1>SVG Maze Generator</h1>
      <GridProvider>
        <div className="workspace">
          <div className="tab left">
            <GridSettings />
          </div>
          <div className="tab right"></div>
        </div>
      </GridProvider>
    </div>
  );
}

export default App;
