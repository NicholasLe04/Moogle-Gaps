function dijkstra(start_row, start_col, end_row, end_col, grid, weights) {
  // dist[v] ← INFINITY
  const dist = Array.from({ length: 36 }, () => Array(90).fill(Infinity));
  // prev[v] ← UNDEFINED
  const prev = Array.from({ length: 36 }, () => Array(90).fill(undefined));
  const queue = [];
  // add v to Q
  for (let rowIdx = 0; rowIdx < 36; rowIdx ++) {
    for (let colIdx = 0; colIdx < 90; colIdx ++) {
      queue.push([rowIdx, colIdx]);
    }
  }
  // dist[source] = 0
  dist[start_row][start_col] = 0;
  // while Q is not empty
  while (queue.length > 0) {
    //u ← vertex in Q with min dist[u]
    let u = queue[0];
    let uDist = dist[u[0]][u[1]]
    
    for (let vertexIdx = 1; vertexIdx < queue.length; vertexIdx ++) {
      const vertex = queue[vertexIdx];
      const vertexDist = dist[vertex[0]][vertex[1]];
      if (vertexDist < uDist) {
        u = vertex;
        uDist = vertexDist;
      }
    }
    // u = target
    if (u[0] === end_row && u[1] === end_col) {
      let path = [];
      // if prev[u] is defined or u = source:
      if (prev[u[0]][u[1]] !== undefined) {
        // while u is defined:
        while (u !== undefined) {
          //insert u at the beginning of S
          path.unshift(u);
          // u ← prev[u]
          u = prev[u[0]][u[1]];  
        }        
      }
      return path;
    }
    // remove u from Q
    queue.splice(queue.indexOf(u), 1);
  
    const offsets = [[1,0], [0,1], [-1,0], [0,-1]];
    // for each neighbor v
    for (let offsetIdx = 0; offsetIdx < 4; offsetIdx ++) {
      const newRow = u[0] + offsets[offsetIdx][0];
      const newCol = u[1] + offsets[offsetIdx][1];
      //  of u still in Q
      if (
        queue.some(arr => JSON.stringify(arr) === JSON.stringify([newRow, newCol])) &&
        (0 <= newRow && newRow <= 35) &&
        (0 <= newCol && newCol <= 89) &&
        (grid[newRow][newCol] === 1 || grid[newRow][newCol] === 4)
      ) {
        // alt <- dist[u] + Graph.Edges(u,v)
        const alt = dist[u[0]][u[1]] + (
          [[u[0], u[1]], [newRow, newCol]] in weights ? 
          weights[[[u[0], u[1]], [newRow, newCol]]] : 
          weights[[[newRow, newCol], [u[0], u[1]]]]
        );
        //if alt < dist[v]:
        if (alt < dist[newRow][newCol]) {
          //dist[v] <- alt
          dist[newRow][newCol] = alt;
          //prev[v] <- u
          prev[newRow][newCol] = u;
        }
      }
    }
  }
  return false;
}

export default dijkstra;