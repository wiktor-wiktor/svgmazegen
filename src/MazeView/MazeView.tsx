import { CSSProperties, useContext, useEffect, useState } from "react";
import { GridContext } from "../GridReducer";
import { mazeCell, path } from "../types";
import styles from "./maze-view.module.scss";

const CELL_SIZE = 64;
const STROKE_WIDTH = 8;
const SVG_MARGIN = 40;

interface MazeViewProps {
  paths: path[];
  currentPath: number;
  completedPaths: number[];
  handlePathBeginingNodeClick: (pathId: number) => void;
}

const getColorFromPathIndex = (index: number) => {
  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
    "pink",
    "black",
    "gray",
    "brown",
    "purple",
    "cyan",
    "magenta",
    "lime",
    "maroon",
    "navy",
    "olive",
    "teal",
  ];
  return colors[index % colors.length];
};

export const MazeView = ({
  paths,
  currentPath,
  completedPaths,
  handlePathBeginingNodeClick,
}: MazeViewProps) => {
  const [coloredMaze, setColoredMaze] = useState<{
    [key: string]: {
      color: string;
      direction: string;
    };
  }>({});
  const gridContext = useContext(GridContext);

  useEffect(() => {
    const newColoredMaze: {
      [key: string]: { color: string; direction: string };
    } = {};
    paths.forEach((path, i) => {
      path.cells.forEach((cell) => {
        const [x, y] = cell.coords;
        newColoredMaze[`${x},${y}`] = {
          color: getColorFromPathIndex(i),
          direction: cell.direction.toString()[0],
        };
      });
    });
    setColoredMaze(newColoredMaze);
  }, [paths]);

  const getSVGPathFromPath = (
    path: mazeCell[],
    first: boolean,
    level: number
  ): string => {
    const cs = CELL_SIZE;
    const hcs = cs / 2;
    let d = `M${path[0].coords[0] * cs + hcs - level * 3},${
      path[0].coords[1] * cs + hcs + level * 3
    }`;

    const [x0, y0] = path[0].coords;
    let beginningFragment = "";
    switch (path[0].direction) {
      case "up":
        beginningFragment += `l0,-${hcs}`;
        break;
      case "down":
        beginningFragment += `l0,${hcs}`;
        break;
      case "left":
        beginningFragment += `l-${hcs},0`;
        break;
      case "right":
        beginningFragment += `l${hcs},0`;
        break;
    }

    if (true) {
      d += beginningFragment;
    } else {
      d += beginningFragment.replace("l", "m");
    }

    for (let i = 1; i < path.length; i++) {
      const [x, y] = path[i].coords;
      const previousDirection = path[i - 1].direction;
      const currentDirection = path[i].direction;
      if (previousDirection === "up" && currentDirection === "right") {
        d += `a${hcs},${hcs} 0 0 1 ${hcs},-${hcs}`;
      } else if (previousDirection === "up" && currentDirection === "left") {
        d += `a${hcs},${hcs} 0 0 0 -${hcs},-${hcs}`;
      }
      if (previousDirection === "down" && currentDirection === "right") {
        d += `a${hcs},${hcs} 0 0 0 ${hcs},${hcs}`;
      }
      if (previousDirection === "down" && currentDirection === "left") {
        d += `a${hcs},${hcs} 0 0 1 -${hcs},${hcs}`;
      }
      if (previousDirection === "left" && currentDirection === "up") {
        d += `a${hcs},${hcs} 0 0 1 -${hcs},-${hcs}`;
      }
      if (previousDirection === "left" && currentDirection === "down") {
        d += `a${hcs},${hcs} 0 0 0 -${hcs},${hcs}`;
      }
      if (previousDirection === "right" && currentDirection === "up") {
        d += `a${hcs},${hcs} 0 0 0 ${hcs},-${hcs}`;
      }
      if (previousDirection === "right" && currentDirection === "down") {
        d += `a${hcs},${hcs} 0 0 1 ${hcs},${hcs}`;
      }
      if (previousDirection === "up" && currentDirection === "up") {
        d += `l0,-${cs}`;
      }
      if (previousDirection === "down" && currentDirection === "down") {
        d += `l0,${cs}`;
      }
      if (previousDirection === "left" && currentDirection === "left") {
        d += `l-${cs},0`;
      }
      if (previousDirection === "right" && currentDirection === "right") {
        d += `l${cs},0`;
      }
      if (previousDirection === "down" && currentDirection === "none") {
        d += `l0,${hcs}`;
      }
      if (previousDirection === "up" && currentDirection === "none") {
        d += `l0,-${hcs}`;
      }
      if (previousDirection === "left" && currentDirection === "none") {
        d += `l-${hcs},0`;
      }
      if (previousDirection === "right" && currentDirection === "none") {
        d += `l${hcs},0`;
      }
    }
    return d;
  };

  return (
    <div style={{ position: "relative" }} className={styles.mazeView}>
      <svg
        width={gridContext.state.sizeA * CELL_SIZE + SVG_MARGIN * 2}
        height={gridContext.state.sizeB * CELL_SIZE + SVG_MARGIN * 2}
        viewBox={`-${SVG_MARGIN} -${SVG_MARGIN} ${
          gridContext.state.sizeA * CELL_SIZE + SVG_MARGIN * 2
        } ${gridContext.state.sizeB * CELL_SIZE + SVG_MARGIN * 2}`}
      >
        {/* square grid */}
        {Array.from(Array(gridContext.state.sizeA).keys()).map((x) =>
          Array.from(Array(gridContext.state.sizeB).keys()).map((y) => (
            <rect
              key={`${x},${y}`}
              x={x * CELL_SIZE}
              y={y * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="#242424"
              stroke="#ababab"
            />
          ))
        )}

        {/* ternary path line */}
        {paths.reverse().map((path, i) => {
          const [x, y] = path.cells[0].coords;
          const [x2, y2] = path.cells[path.cells.length - 1].coords;
          return (
            <>
              <path
                key={`${path.id}${i}1`}
                d={getSVGPathFromPath(
                  path.cells,
                  i === 0,
                  STROKE_WIDTH * 0.18 * 2
                )}
                fill="none"
                stroke="#555"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                className={[
                  styles.path,
                  currentPath === path.id ? styles.current : "",
                  completedPaths.includes(path.id) ? styles.completed : "",
                ].join(" ")}
                style={
                  {
                    "--cell-size": CELL_SIZE,
                    "--path-length": path.cells.length,
                    "--animation-delay": path.depth - 1, // should depend on the cell size,
                    filter: "drop-shadow(0 0 0.1rem #000)",
                  } as CSSProperties
                }
              />
            </>
          );
        })}

        {/* secondary path line */}
        {paths.map((path, i) => {
          const [x, y] = path.cells[0].coords;
          const [x2, y2] = path.cells[path.cells.length - 1].coords;
          return (
            <>
              <path
                key={`${path.id}${i}2`}
                d={getSVGPathFromPath(path.cells, i === 0, STROKE_WIDTH * 0.18)}
                fill="none"
                stroke="#777"
                strokeWidth={STROKE_WIDTH * 1.2}
                strokeLinecap="round"
                className={[
                  styles.path,
                  currentPath === path.id ? styles.current : "",
                  completedPaths.includes(path.id) ? styles.completed : "",
                ].join(" ")}
                style={
                  {
                    "--cell-size": CELL_SIZE,
                    "--path-length": path.cells.length,
                    "--animation-delay": path.depth - 1,
                  } as CSSProperties
                }
              />
            </>
          );
        })}

        {/* main path line */}
        {paths.map((path, i) => {
          const [x, y] = path.cells[0].coords;
          const [x2, y2] = path.cells[path.cells.length - 1].coords;
          return (
            <>
              <path
                key={`${path.id}${i}3`}
                d={getSVGPathFromPath(path.cells, i === 0, 0)}
                fill="none"
                stroke="white"
                strokeWidth={STROKE_WIDTH * 1.4}
                strokeLinecap="round"
                className={[
                  styles.path,
                  currentPath === path.id ? styles.current : "",
                  completedPaths.includes(path.id) ? styles.completed : "",
                ].join(" ")}
                style={
                  {
                    "--cell-size": CELL_SIZE,
                    "--path-length": path.cells.length,
                    "--animation-delay": path.depth - 1,
                  } as CSSProperties
                }
              />
            </>
          );
        })}

        {paths.map((path, i) => {
          const [x, y] = path.cells[0].coords;
          const [x2, y2] = path.cells[path.cells.length - 1].coords;
          return (
            <>
              {/* path starting point */}
              <circle
                key={`${path.id}${i}4`}
                cx={x * CELL_SIZE + CELL_SIZE / 2}
                cy={y * CELL_SIZE + CELL_SIZE / 2}
                r={STROKE_WIDTH * 1.4}
                className={[
                  styles.node,
                  styles.starting,
                  currentPath === path.id ? styles.current : "",
                  completedPaths.includes(path.id) ? styles.completed : "",
                ].join(" ")}
                onPointerDown={() => {
                  if (completedPaths.includes(path.id)) {
                    handlePathBeginingNodeClick(path.id);
                  }
                }}
                style={
                  {
                    filter: "drop-shadow(10 5 0.1rem #000)",
                    zIndex: 100,
                    "--cell-size": CELL_SIZE,
                    "--stroke-width": STROKE_WIDTH,
                    "--disstance-from-path-beginning": 0,
                    "--animation-delay": path.depth - 1,
                  } as CSSProperties
                }
              />
              {/* path ending point */}
              <circle
                key={`${path.id}${i}5`}
                cx={x2 * CELL_SIZE + CELL_SIZE / 2}
                cy={y2 * CELL_SIZE + CELL_SIZE / 2}
                r={STROKE_WIDTH * 1.4}
                className={[
                  styles.node,
                  path.cells[path.cells.length - 1].isEnding
                    ? styles.ending
                    : "",
                  completedPaths.includes(path.id) ? styles.completed : "",
                ].join(" ")}
                style={
                  {
                    filter: "drop-shadow(10 5 0.1rem #000)",
                    zIndex: 100,
                    "--cell-size": CELL_SIZE,
                    "--stroke-width": STROKE_WIDTH,
                    "--disstance-from-path-beginning": path.cells.length,
                    "--animation-delay": path.depth - 1,
                  } as CSSProperties
                }
              />
            </>
          );
        })}
      </svg>
    </div>
  );
};
