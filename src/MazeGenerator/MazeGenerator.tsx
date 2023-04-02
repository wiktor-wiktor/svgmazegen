import { useContext, useEffect } from "react";
import { GridContext } from "../GridReducer";
import { MazeView } from "../MazeView/MazeView";
import { direction, coord, mazeCell } from "../types";

export const MazeGenerator = () => {
  const gridContext = useContext(GridContext);
  const branches: coord[][] = [];

  const generate = () => {
    const start: coord = [0, 0];
    const end: coord = [
      gridContext.state.sizeA - 1,
      gridContext.state.sizeB - 1,
    ];

    let visitedCount = 0;
    const totalCells = gridContext.state.sizeA * gridContext.state.sizeB;
    const visited: boolean[][] = Array.from({
      length: gridContext.state.sizeB,
    }).map(() =>
      Array.from({ length: gridContext.state.sizeA }).fill(false)
    ) as boolean[][];
    const stack: coord[] = [];
    const paths: mazeCell[][] = [];

    const getNeighbors = (coord: coord): coord[] => {
      const [x, y] = coord;
      const neighbors: coord[] = [];

      if (x > 0) {
        neighbors.push([x - 1, y]);
      }
      if (x < gridContext.state.sizeA - 1) {
        neighbors.push([x + 1, y]);
      }
      if (y > 0) {
        neighbors.push([x, y - 1]);
      }
      if (y < gridContext.state.sizeB - 1) {
        neighbors.push([x, y + 1]);
      }

      return neighbors;
    };

    const getUnvisitedNeighbors = (coord: coord): coord[] => {
      const neighbors = getNeighbors(coord);
      return neighbors.filter((neighbor) => !visited[neighbor[1]][neighbor[0]]);
    };

    const getDirection = (current: coord, next: coord): direction => {
      const [x1, y1] = current;
      const [x2, y2] = next;

      if (x1 < x2) {
        return "right";
      } else if (x1 > x2) {
        return "left";
      } else if (y1 < y2) {
        return "down";
      } else if (y1 > y2) {
        return "up";
      } else {
        return "none";
      }
    };

    let current: coord = start;
    let currentPath: mazeCell[] = [];
    while (visitedCount < totalCells) {
      const unvisitedNeighbors = getUnvisitedNeighbors(current);
      if (unvisitedNeighbors.length > 0) {
        const randomNeighbor =
          unvisitedNeighbors[
            Math.floor(Math.random() * unvisitedNeighbors.length)
          ];
        if (currentPath.length === 0 && stack.length > 0) {
          currentPath.push({
            coords: stack[stack.length - 1],
            direction: getDirection(stack[stack.length - 1], current),
          });
        }
        stack.push(current);
        currentPath.push({
          coords: current,
          direction: getDirection(current, randomNeighbor),
        });
        if (!visited[current[1]][current[0]]) {
          visited[current[1]][current[0]] = true;
          visitedCount++;
        }
        current = randomNeighbor;
      } else {
        if (!visited[current[1]][current[0]]) {
          currentPath.push({
            coords: current,
            direction: getDirection(current, current),
          });
          visited[current[1]][current[0]] = true;
          visitedCount++;
          paths.push(currentPath);
        }
        current = stack.pop() as coord;
        currentPath = [];
      }
    }

    gridContext.dispatch({
      type: "SET_PATHS",
      payload: paths,
    });
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div>
      <button onClick={generate}>Generate</button>
      <MazeView paths={gridContext.state.paths} />
    </div>
  );
};
