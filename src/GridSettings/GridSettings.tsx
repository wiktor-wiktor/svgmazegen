import { CSSProperties, useContext, useState } from "react";
import { GridContext } from "../GridReducer";
import styles from "./grid-settings.module.scss";

export const GridSettings = () => {
  const gridContext = useContext(GridContext);
  const [mouseDown, setMouseDown] = useState(false);

  const sizeStyle = {
    "--grid-size-a": gridContext.state.sizeA,
    "--grid-size-b": gridContext.state.sizeB,
  } as CSSProperties;

  const toggleIthCell = (i: number) => {
    const x = Math.floor(i / gridContext.state.sizeA);
    const y = i % gridContext.state.sizeA;

    gridContext.dispatch({
      type: "SET_GRID_CELL",
      payload: {
        x,
        y,
        value: !gridContext.state.gridCells[y][x],
      },
    });
  };

  return (
    <div className={styles.gridSettings}>
      <div className={styles.tabPicker}>
        <label htmlFor="grid-type">Grid Type</label>
        <select
          id="grid-type"
          value={gridContext.state.type}
          onChange={(e) =>
            gridContext.dispatch({ type: "SET_TYPE", payload: e.target.value })
          }
        >
          <option value="rectangle">Rectangle</option>
          <option value="hex">Hex</option>
          <option value="triangle">Triangle</option>
          <option value="concentric">Concentric</option>
        </select>
      </div>
      {gridContext.state.type === "rectangle" && (
        <>
          <h2>Rectangle</h2>
          <div className={styles.tab}>
            <label htmlFor="grid-size-a">Size A </label>
            <input
              id="grid-size-a"
              type="number"
              value={gridContext.state.sizeA}
              onChange={(e) =>
                gridContext.dispatch({
                  type: "SET_SIZE",
                  payload: {
                    a: parseInt(e.target.value),
                    b: gridContext.state.sizeB,
                  },
                })
              }
            />
            <label htmlFor="grid-size-b">Size B </label>
            <input
              id="grid-size-b"
              type="number"
              value={gridContext.state.sizeB}
              onChange={(e) =>
                gridContext.dispatch({
                  type: "SET_SIZE",
                  payload: {
                    a: gridContext.state.sizeA,
                    b: parseInt(e.target.value),
                  },
                })
              }
            />
            <div className={styles.gridContainer}>
              <div
                className={`${styles.grid} ${styles.rectangle}`}
                onMouseDown={() => setMouseDown(true)}
                onMouseUp={() => setMouseDown(false)}
                onMouseLeave={() => setMouseDown(false)}
                style={sizeStyle}
              >
                {Array.from({
                  length: gridContext.state.sizeA * gridContext.state.sizeB,
                }).map((_, i) => {
                  return (
                    <div
                      key={`${i}-rect-grid`}
                      className={`${styles.gridCell} ${
                        gridContext.state.gridCells[
                          i % gridContext.state.sizeA
                        ][Math.floor(i / gridContext.state.sizeA)]
                          ? styles.on
                          : styles.off
                      }`}
                      onMouseDown={() => {
                        toggleIthCell(i);
                      }}
                      onMouseEnter={() => {
                        if (mouseDown) {
                          toggleIthCell(i);
                        }
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
