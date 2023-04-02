import { useContext, useEffect, useState } from "react";
import { GridContext } from "../GridReducer";
import { mazeCell } from "../types";

const CELL_SIZE = 40;

export const MazeView = ({ paths }: { paths: mazeCell[][] }) => {
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

  const [coloredMaze, setColoredMaze] = useState<{
    [key: string]: {
      color: string;
      direction: string;
    };
  }>({});
  const gridContext = useContext(GridContext);

  useEffect(() => {
    console.log("+ paths", paths);
    const newColoredMaze: {
      [key: string]: { color: string; direction: string };
    } = {};
    paths.forEach((path, i) => {
      path.forEach((cell) => {
        const [x, y] = cell.coords;
        newColoredMaze[`${x},${y}`] = {
          color: getColorFromPathIndex(i),
          direction: cell.direction.toString()[0],
        };
      });
    });
    setColoredMaze(newColoredMaze);
  }, [paths]);

  const getSVGPathFromPath = (path: mazeCell[], first: boolean): string => {
    const cs = CELL_SIZE;
    const hcs = cs / 2;
    let d = `M${path[0].coords[0] * cs + hcs},${path[0].coords[1] * cs + hcs}`;

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

    if (first) {
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

  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  return (
    <div style={{ position: "relative" }}>
      <svg
        width={gridContext.state.sizeA * CELL_SIZE}
        height={gridContext.state.sizeB * CELL_SIZE}
      >
        {Array.from(Array(gridContext.state.sizeA).keys()).map((x) =>
          Array.from(Array(gridContext.state.sizeB).keys()).map((y) => (
            <rect
              key={`${x},${y}`}
              x={x * CELL_SIZE}
              y={y * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="#242424"
              stroke="black"
            />
          ))
        )}
        {paths.map((path, i) => {
          const [x, y] = path[0].coords;
          return (
            <>
              <path
                key={`${simpleHash(path.toString())}${i}`}
                d={getSVGPathFromPath(path, i === 0)}
                fill="none"
                stroke={coloredMaze[`${x},${y}`]?.color || "black"}
                strokeWidth="8"
                strokeLinecap="round"
              />
            </>
          );
        })}
      </svg>
    </div>
  );
};
