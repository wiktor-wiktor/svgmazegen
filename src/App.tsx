import { GridSettings } from "./GridSettings/GridSettings";
import { GridProvider } from "./GridReducer";
import { Grid } from "./types";
import "./App.css";
import { MazeGenerator } from "./MazeGenerator/MazeGenerator";

export const INITIAL_GRID: Grid = {
  type: "rectangle",
  sizeA: 10,
  sizeB: 10,
  gridCells: Array(10).fill(Array(10).fill(false)),
  paths: [],
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
          <div className="tab right">
            <MazeGenerator />
          </div>
        </div>
      </GridProvider>
    </div>
  );
}

export default App;
