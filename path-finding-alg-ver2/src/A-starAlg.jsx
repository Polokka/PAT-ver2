// Heuristiikkafunktio
function heuristic(node, endNode) {
  let dx = Math.abs(node.x - endNode.x);
  let dy = Math.abs(node.y - endNode.y);

  return dx + dy;
}

//Muunnetaan node coordinaateiksi
function toCoords(ref, cols) {
  let y = Math.floor(ref / cols);
  console.log(cols);
  let x = ref % cols;
  return { x: x, y: y };
}

// A* algoritmi
export const aStar = async (
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
  setIsRunningAStar
) => {
  let openSet = [startRef];

  let cameFrom = {};
  let gScore = {};
  let fScore = {};
  let gridForAlg = [];
  let startRefCoords = toCoords(startRef, cols);
  let endNodeCoords = toCoords(endRef, cols);

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

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let node = i * cols + j;
      gScore[node] = Infinity;
      fScore[node] = Infinity;
    }
  }

  gScore[startRef] = 0;
  fScore[startRef] = heuristic(startRefCoords, endRef);

  while (openSet.length > 0) {
    if (!isRunningAStarRef.current) {
      return;
    }
    let current = openSet.reduce((a, b) => (fScore[a] < fScore[b] ? a : b));
    if (current == endRef) {
      let path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom[temp];
      }
      setAlgPath(path.map(Number));
      setIsRunningAStar(false);
      return;
    }

    openSet = openSet.filter((node) => node !== current);

    visitedNodes.add(current);

    for (let neighbor in gridForAlg[current]) {
      if (!isRunningAStarRef.current) {
        return;
      }
      let tentativeGScore = gScore[current] + 1;
      if (tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] =
          gScore[neighbor] + heuristic(toCoords(neighbor, cols), endNodeCoords);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (!isRunningAStarRef.current) {
      return;
    }
    setVisitedNodes(new Set(Object.keys(cameFrom).map(Number)));
  }
  setIsRunningAStar(false);
};
