import { coord, direction, path } from "./types";

type cellNode = {
  coords: [number, number];
  children: cellNode[];
  label: string;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const getLabelForNumber = (number: number): string => {
  // converts a number to base 26
  if (number < 26) {
    return alphabet[number];
  }

  return getLabelForNumber(Math.floor(number / 26) - 1) + alphabet[number % 26];
};

export const pathsToGraph = (paths: path[], sizeA: number, sizeB: number) => {
  console.log("pathsToGraph", paths, sizeA, sizeB);
  const matrix: number[][][] = [];

  for (let i = 0; i < sizeA; i++) {
    matrix[i] = [];
    for (let j = 0; j < sizeB; j++) {
      matrix[i][j] = [];
    }
  }

  paths.forEach((path) => {
    path.cells.forEach((cell) => {
      matrix[cell.coords[0]][cell.coords[1]].push(path.id);
    });
  });

  let currentPathIndex = 0;
  const prelabeledPaths: { [key: number]: string } = {};
  prelabeledPaths[paths[0].id] = getLabelForNumber(currentPathIndex);
  currentPathIndex++;
  const graphHead: cellNode = {
    coords: paths[0].cells[0].coords,
    children: [],
    label: prelabeledPaths[paths[0].id],
  };
  const labelToPathHeadNode: { [key: string]: cellNode } = {};
  labelToPathHeadNode[graphHead.label] = graphHead;

  let currentNode: cellNode = graphHead;
  paths.forEach((path, pathIndex) => {
    let label = prelabeledPaths[path.id];
    currentNode = labelToPathHeadNode[label];
    let currentSubpathIndex = 0;

    path.cells.forEach((cell, cellIndex) => {
      if (cellIndex === 0) {
        return;
      }

      const [x, y] = cell.coords;
      if (cellIndex !== 0 && matrix[x][y].length > 1) {
        let newPathStarted = false;
        matrix[x][y].forEach((pathId) => {
          // a split to a new path
          if (pathId !== path.id && !prelabeledPaths[pathId]) {
            newPathStarted = true;
            prelabeledPaths[pathId] = getLabelForNumber(pathId);
            labelToPathHeadNode[prelabeledPaths[pathId]] = {
              coords: cell.coords,
              children: [],
              label: prelabeledPaths[pathId],
            };
            currentNode.children.push(
              labelToPathHeadNode[prelabeledPaths[pathId]]
            );
          }
        });

        if (newPathStarted) {
          // a split to a continuation of the current path
          const nodeForCurrentCell = {
            coords: cell.coords,
            children: [],
            label: label,
          };
          currentNode.children.push(nodeForCurrentCell);
          label = `${prelabeledPaths[path.id]}.${getLabelForNumber(
            currentSubpathIndex
          )}`;
          labelToPathHeadNode[label] = {
            coords: cell.coords,
            children: [],
            label,
          };
          currentSubpathIndex++;
          currentNode.children.push(labelToPathHeadNode[label]);
          currentNode = labelToPathHeadNode[label];
        } else {
          // new path starts at a splitting point
          const nodeForCurrentCell = {
            coords: cell.coords,
            children: [],
            label: label,
          };
          currentNode.children.push(nodeForCurrentCell);
          currentNode = nodeForCurrentCell;
        }
      } else {
        // just a continuation of the current path
        const nodeForCurrentCell = {
          coords: cell.coords,
          children: [],
          label: label,
        };
        currentNode.children.push(nodeForCurrentCell);
        currentNode = nodeForCurrentCell;
      }
    });
  });

  console.log(graphHead);
  return graphHead;
};

export const getDirection = (current: coord, next: coord): direction => {
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

export const graphToGraphPaths = (graphHead: cellNode): path[] => {
  console.log("graphToGraphPaths", graphHead);
  const pathsDict: { [key: string]: path } = {};
  let currentPathIndex = 0;

  const traverse = (node: cellNode, previousNode: cellNode | null) => {
    const [x, y] = node.coords;
    if (!pathsDict[node.label]) {
      pathsDict[node.label] = {
        cells: [],
        depth: 0,
        id: currentPathIndex,
      };
      currentPathIndex++;
    }

    const direction = previousNode
      ? getDirection(previousNode.coords, node.coords)
      : "none";

    if (pathsDict[node.label].cells.length > 0) {
      pathsDict[node.label].cells[
        pathsDict[node.label].cells.length - 1
      ].direction = direction;
    }

    pathsDict[node.label].cells.push({
      coords: [x, y],
      direction: "none",
      parentPath: 0,
    });

    if (previousNode?.children.length === 1) {
      pathsDict[node.label].cells[
        pathsDict[node.label].cells.length - 1
      ].isEnding = true;
    }

    node.children.forEach((child) => {
      traverse(child, node);
    });
  };

  traverse(graphHead, null);
  console.log(pathsDict);
  return Object.values(pathsDict);
};
