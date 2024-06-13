import { useState, useRef, useEffect, useContext, createContext } from "react";
import "./App.scss";

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
    if (isRunningRef.current) {
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

  const [isRunning, setIsRunning] = useState(false);

  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
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
        isRunningRef,
        setIsRunning
      );
    }
  }, [isRunning]);

  return (
    <>
      <div className="topBar">
        <button className="topBarItem" onClick={() => clearWall()}>
          Clear walls Button
        </button>
        <button className="topBarItem" onClick={() => clearVisitedNodes()}>
          Clear Algorithm
        </button>
        <button
          className="topBarItem"
          onClick={async () => {
            setIsRunning(false);
            setTimeout(() => setIsRunning(true));
          }}
        >
          Dijkstra's Algorithm
        </button>
        <button className="topBarItem" onClick={() => setIsRunning(false)}>
          Stop Algorithm
        </button>
        <p className="topBarItem">
          Instructions: Start(yellow) and end(red) are draggable with mouse.
          Paste walls by clicking/holding empty node/nodes, and remove them by
          clicking/holding.
        </p>
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

const DijkstrasAlg = async (
  startRef,
  endRef,
  cols,
  rows,
  wallNodes,
  visitedNodes,
  setVisitedNodes,
  algPath,
  setAlgPath,
  isRunningRef,
  setIsRunning
) => {
  let gridForAlg = {};

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let node = i * cols + j;
      gridForAlg[node] = {};
      // Lisää naapurit ja niiden etäisyydet
      if (i > 0 && !wallNodes.includes((i - 1) * cols + j))
        gridForAlg[node][(i - 1) * cols + j] = 1; // yläpuolella
      if (i < rows - 1 && !wallNodes.includes((i + 1) * cols + j))
        gridForAlg[node][(i + 1) * cols + j] = 1; // alapuolella
      if (j > 0 && !wallNodes.includes(i * cols + j - 1))
        gridForAlg[node][i * cols + j - 1] = 1; // vasemmalla
      if (j < cols - 1 && !wallNodes.includes(i * cols + j + 1))
        gridForAlg[node][i * cols + j + 1] = 1; // oikealla
    }
  }

  let distances = {},
    previous = {},
    unvisited = new Set();
  for (let node in gridForAlg) {
    distances[node] = node == startRef ? 0 : Infinity;
    unvisited.add(node);
  }

  while (unvisited.size) {
    let closestNode = null;
    for (let node of unvisited) {
      if (!closestNode || distances[node] < distances[closestNode]) {
        closestNode = node;
      }
    }

    if (distances[closestNode] == Infinity) break;
    if (closestNode == endRef) break;

    for (let neighbor in gridForAlg[closestNode]) {
      if (!isRunningRef.current) {
        return;
      }
      let newDistance =
        distances[closestNode] + gridForAlg[closestNode][neighbor];
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = closestNode;
      }
    }
    unvisited.delete(closestNode);
    await new Promise((resolve) => setTimeout(resolve, 0));
    setVisitedNodes(new Set(Object.keys(previous).map(Number)));
  }

  let path = [],
    node = endRef;
  while (node) {
    path.push(node);

    node = previous[node];
    setAlgPath(path.map(Number));
  }
  setIsRunning(false);
  return path.reverse();
};

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
