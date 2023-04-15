import { path } from "./types";

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
  paths.forEach((path) => {
    let label = prelabeledPaths[path.id];
    currentNode = labelToPathHeadNode[label];
    let currentSubpathIndex = 0;

    path.cells.forEach((cell, cellIndex) => {
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
          // just a continuation of the current path
          const nodeForCurrentCell = {
            coords: cell.coords,
            children: [],
            label: label,
          };
          currentNode.children.push(nodeForCurrentCell);
          currentNode = nodeForCurrentCell;
        }
      }
    });
  });

  return graphHead;
};
