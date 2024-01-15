function bellmanFord(start_row, start_col, end_row, end_col, grid, weights) {
    const dist = Array.from({ length: 36 }, () => Array(90).fill(Infinity));
    dist[start_row][start_col] = 0;
    const prev = Array.from({ length: 36 }, () => Array(90).fill(undefined));
    const offsets = [[1,0], [0,1], [-1,0], [0,-1]];
  
    let changed = true; // used to check if edge relaxation is complete
    // for (i = 1 to |V| - 1)
    for (let i = 0; i < 36 * 90; i ++) {
      changed = false;
      // for e(=u -> v) in E
      for (let rowIdx = 0; rowIdx < 36; rowIdx ++) {
        for (let colIdx = 0; colIdx < 90; colIdx ++) {
          for (let offsetIdx = 0; offsetIdx < 4; offsetIdx ++) {
            const adjRow = rowIdx + offsets[offsetIdx][0];
            const adjCol = colIdx + offsets[offsetIdx][1];
            // Relax(e)
            if (
              (0 <= adjRow && adjRow <= 35) && 
              (0 <= adjCol && adjCol <= 89) &&
              (grid[adjRow][adjCol] === 1 || grid[adjRow][adjCol] === 4)
            ) {
              let newDistance = dist[rowIdx][colIdx] + weights[adjRow][adjCol];
              let oldDistance = dist[adjRow][adjCol]
              if (newDistance < oldDistance) {
                changed = true;
                dist[adjRow][adjCol] = newDistance;
                prev[adjRow][adjCol] = [rowIdx, colIdx];
              }
            }
          }
        }
      }
      if (!changed) {
        break;
      }
    }

    // if there is no path
    if (prev[end_row][end_col] === undefined) {
        return false;
    }
    // reconstruct path
    else {
      let path = [];
      let parent = [end_row, end_col];
      while (parent !== undefined) {
        path.unshift(parent);
        parent = prev[parent[0]][parent[1]];  
      }        
      return path;
    }
}
  
  export default bellmanFord;