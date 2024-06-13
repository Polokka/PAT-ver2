export const DijkstrasAlg = async (
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
  setIsRunningDijkstra
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
      if (!isRunningDijkstraRef.current) {
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
  setIsRunningDijkstra(false);
  return path.reverse();
};
