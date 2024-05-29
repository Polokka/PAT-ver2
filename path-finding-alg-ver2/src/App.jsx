import { useState, useRef, useEffect } from "react";
import "./App.scss";

/*
TOP LEVEL STUFF

grid variables


BUILT A GRID COMPONENT

Parametrit: Rows ja cols
Return: GridObject {Row0 { Col0, Col1, ...} Row1 { Col0, Col1, ...} ...}


COMPONENTTI JOKA VASTAAN OTTAA GRIDIN, JA LUO NODEJEN ARVOT

Parametrit: GridObject
Return: Jokaiselle nodelle: Status(Neutral, start, end, wall), id, key, neighbours

MAIN COMPONENT/APP

Default componentti, antaa käskyn gridin luomiselle.
Muokataan/Annetaan classNamet

Return osa: <div>GridDiv</div><div>OnClick functiot eri toiminnoille(Gridin arvojen muuttaminen, algorytmin valinta)</div>


ALGORYMIT

Mitä näitä ny on
*/

const GridNodes = ({ cols, rows }) => {
  let grid = {};

  for (let i = 0; i < rows; i++) {
    let rowKey = `Row${i}`;
    grid[rowKey] = {};
    for (let j = 0; j < cols; j++) {
      let nodeKey = `Col${j}`;
      grid[rowKey][nodeKey] = { Id: i * cols + j, Status: "" };
    }
  }
  console.log(grid);
  return grid;
};

function App() {
  const cols = 5;
  const rows = 7;

  let grid = GridNodes({ cols, rows });

  const status = {
    NEUTRAL: "Neutral",
    IS_START: "isStart",
    IS_END: "isEnd",
    IS_WALL: "Wall",
    ON_PATH: "Path",
  };

  const [mode, setMode] = useState(status.NEUTRAL);
  let startRef = useRef(0);
  let endRef = useRef(24);

  function tileColorClassSelection(colIndex) {
    if (colIndex == startRef.current) {
      return "startNode";
    } else {
      return "neutralNode";
    }
  }

  useEffect(() => {}, [startRef]);

  const gridArray = Object.values(grid).map((row) => Object.values(row));

  return (
    <>
      <div className="topBar"></div>
      <div className="gridHolder">
        {gridArray.map((row, rowIndex) => (
          <div key={`Row${rowIndex}`} className="gridRow">
            {row.map((cell, colIndex) => (
              <div
                key={`Col${colIndex}`}
                className={`${tileColorClassSelection(cell.Id)} gridCell`}
              >
                {mode}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

/*switch (mode) {
  case "Neutral":
    tileColorClass = "neutralNode";
    break;
  case "isStart":
    tileColorClass = "startNode";
    break;
  case "isEnd":
    tileColorClass = "endNode";
    break;
  case "isEnd":
    tileColorClass = "endNode";
    break;
  case "Path":
    tileColorClass = "pathNode";
  default:
    console.log("Kissa");
}

  let tileColorClass = "";



  function selectStatus(startRef, endRef, grid) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let node = grid[`Row${i}`][`Col${j}`];
        if (node.Id == startRef.current) {
          grid[`Row${i}`][`Col${j}`].Status = status.IS_START;
          console.log(grid.Row0.Col0.Status);
        } else {
          node.Status = status.NEUTRAL;
        }
      }
    }
  }
*/
