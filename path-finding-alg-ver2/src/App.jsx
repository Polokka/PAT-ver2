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
  const cols = 15;
  const rows = 15;

  const grid = GridNodes({ cols, rows });

  //Status Click&Drag
  const [startRef, setStartRef] = useState(0);
  const [endRef, setEndRef] = useState(10);
  const [draggingStart, setDraggingStart] = useState(false);
  const [draggingEnd, setDraggingEnd] = useState(false);
  const [draggingWall, setDraggingWall] = useState(false);
  const [wallNodes, setWallNodes] = useState([]);

  function tileColorClassSelection(colIndex) {
    if (colIndex == startRef) {
      return "startNode";
    } else if (colIndex == endRef) {
      return "endNode";
    } else if (wallNodes.includes(colIndex)) {
      return "wallNode";
    } else {
      return "neutralNode";
    }
  }

  const handleMouseDown = (nodeId) => {
    if (nodeId == startRef) {
      setDraggingStart(true);
    } else if (nodeId == endRef) {
      setDraggingEnd(true);
    } else if (nodeId) {
      setDraggingWall(true);
      setWallNodes([...wallNodes, nodeId]);
    }
  };

  const handleMouseUp = () => {
    setDraggingStart(false);
    setDraggingEnd(false);
    setDraggingWall(false);
  };

  const handleMouseEnter = (nodeId) => {
    if (draggingStart) {
      setStartRef(nodeId);
    } else if (draggingEnd) {
      setEndRef(nodeId);
    } else if (draggingWall && !wallNodes.includes(nodeId)) {
      setWallNodes([...wallNodes, nodeId]);
    }
  };

  const handleMouseLeave = () => {
    setDraggingStart(false);
    setDraggingEnd(false);
    setDraggingWall(false);
  };

  const clearWall = () => {
    setWallNodes([]);
  };

  const gridArray = Object.values(grid).map((row) => Object.values(row));

  return (
    <>
      <div className="topBar" onClick={() => clearWall()}>
        ClearButton
      </div>
      <div className="gridHolder" onMouseLeave={handleMouseLeave}>
        {gridArray.map((row, rowIndex) => (
          <div key={`Row${rowIndex}`} className="gridRow">
            {row.map((cell, colIndex) => (
              <div
                key={`Col${colIndex}`}
                className={`${tileColorClassSelection(cell.Id)} gridCell`}
                onMouseDown={() => handleMouseDown(cell.Id)}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => handleMouseEnter(cell.Id)}
              ></div>
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


    const status = {
    NEUTRAL: "Neutral",
    IS_START: "isStart",
    IS_END: "isEnd",
    IS_WALL: "Wall",
    ON_PATH: "Path",
  };

  const [mode, setMode] = useState(status.NEUTRAL);
*/
