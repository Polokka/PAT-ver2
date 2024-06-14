import { useState, useRef, useEffect, useContext, createContext } from "react";
import "./App.scss";
import { DijkstrasAlg } from "./DijkstrasAlg";
import { aStar } from "./A-starAlg";

const VisitedNodesContext = createContext();

const VisitedNodesProvider = ({ children }) => {
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  return (
    <VisitedNodesContext.Provider value={{ visitedNodes, setVisitedNodes }}>
      {children}
    </VisitedNodesContext.Provider>
  );
};

const useVisitedNodes = () => {
  const context = useContext(VisitedNodesContext);
  return context;
};

const GridNodes = ({ cols, rows }) => {
  let grid = {};

  for (let i = 0; i < rows; i++) {
    let rowKey = `Row${i}`;
    grid[rowKey] = {};
    for (let j = 0; j < cols; j++) {
      let nodeKey = `Col${j}`;
      grid[rowKey][nodeKey] = { Id: i * cols + j };
    }
  }
  return grid;
};

function App() {
  0;
  const cols = 40;
  const rows = 85;

  const grid = GridNodes({ cols, rows });

  //Status Click&Drag
  const [startRef, setStartRef] = useState(1256);
  const [endRef, setEndRef] = useState(1896);
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
    } else if (algPath.includes(colIndex)) {
      return "pathNode";
    } else if (visitedNodes.has(colIndex)) {
      return "visitedNode";
    } else {
      return "neutralNode";
    }
  }

  const handleMouseDown = (nodeId) => {
    if (nodeId == startRef) {
      setDraggingStart(true);
    } else if (nodeId == endRef) {
      setDraggingEnd(true);
    } else if (wallNodes.includes(nodeId)) {
      setDraggingWall(true);
      setWallNodes(wallNodes.filter((node) => node !== nodeId));
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
    } else if (draggingWall && wallNodes.includes(nodeId)) {
      setWallNodes(wallNodes.filter((node) => node !== nodeId));
    }
  };

  const handleMouseLeave = () => {
    setDraggingStart(false);
    setDraggingEnd(false);
    setDraggingWall(false);
  };

  //ClearButtons
  const clearWall = () => {
    if (isRunningDijkstraRef.current || isRunningAStarRef.current) {
      return;
    }
    setWallNodes([]);
  };

  const clearVisitedNodes = () => {
    setVisitedNodes(new Set());
    setAlgPath([]);
  };

  //Alg things

  const [algPath, setAlgPath] = useState([]);

  const gridArray = Object.values(grid).map((row) => Object.values(row));
  const { visitedNodes, setVisitedNodes } = useVisitedNodes();

  //Dijkstra isRunning states
  const [isRunningDijkstra, setIsRunningDijkstra] = useState(false);
  const isRunningDijkstraRef = useRef(isRunningDijkstra);

  useEffect(() => {
    isRunningDijkstraRef.current = isRunningDijkstra;
  }, [isRunningDijkstra]);

  useEffect(() => {
    if (isRunningAStar) {
      return;
    }
    if (isRunningDijkstra) {
      clearVisitedNodes();
      DijkstrasAlg(
        startRef,
        endRef,
        cols,
        rows,
        wallNodes,
        visitedNodes,
        setVisitedNodes,
        algPath,
        setAlgPath,
        isRunningDijkstraRef,
        setIsRunningDijkstra,
        setResultText
      );
    }
  }, [isRunningDijkstra]);

  //A-Star isRunning states
  const [isRunningAStar, setIsRunningAStar] = useState(false);
  const isRunningAStarRef = useRef(isRunningAStar);

  useEffect(() => {
    isRunningAStarRef.current = isRunningAStar;
  }, [isRunningAStar]);

  useEffect(() => {
    if (isRunningDijkstra) {
      return;
    }
    if (isRunningAStar) {
      clearVisitedNodes();
      aStar(
        startRef,
        endRef,
        cols,
        rows,
        wallNodes,
        visitedNodes,
        setVisitedNodes,
        algPath,
        setAlgPath,
        isRunningAStarRef,
        setIsRunningAStar,
        setResultText
      );
    }
  }, [isRunningAStar]);

  const [resultText, setResultText] = useState("Status");

  return (
    <>
      <div className="topBar">
        <button className="topBarItem" onClick={() => clearWall()}>
          Clear walls
        </button>
        <button className="topBarItem" onClick={() => clearVisitedNodes()}>
          Clear Alg Visualization
        </button>
        <button
          className="topBarItem"
          onClick={async () => {
            setIsRunningDijkstra(false);
            setTimeout(() => setIsRunningDijkstra(true));
          }}
        >
          Dijkstra's Algorithm
        </button>
        <button
          className="topBarItem"
          onClick={async () => {
            setIsRunningAStar(false);
            setTimeout(() => setIsRunningAStar(true));
          }}
        >
          A* Algorithm
        </button>
        <button
          className="topBarItem"
          onClick={() => {
            setIsRunningAStar(false);
            setIsRunningDijkstra(false);
          }}
        >
          Stop Algorithms
        </button>
        <p className="topBarItem instructions">
          Instructions: Start(yellow) and end(red) are draggable with mouse.
          Paste walls by clicking/holding empty node/nodes, and remove them by
          clicking/holding.
        </p>
        <div className="topBarItem resultText">{resultText}</div>
      </div>
      <div className="gridHolder" onMouseLeave={handleMouseLeave}>
        {gridArray.map((row, rowIndex) => (
          <div key={`Row${rowIndex}`} className="gridRow">
            {row.map((cell, colIndex) => (
              <div
                key={`Col${colIndex}`}
                className={`${tileColorClassSelection(cell.Id)} gridCell `}
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

const DefaultExport = () => {
  return (
    <>
      <VisitedNodesProvider>
        <App />
      </VisitedNodesProvider>
    </>
  );
};
export default DefaultExport;

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


    for (let rowKey in grid) {
    for (let colKey in grid[rowKey]) {
      let newKey = `${rowKey}${colKey}`;
      gridForAlg[newKey] = grid[rowKey][colKey];
    }
  }


    const visitedNodes = "";${
    visitedNodes.has(cell.Id) ? "visitedNode" : ""
  }
*/
