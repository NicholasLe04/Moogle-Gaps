function depthFirstSearch(visited, start_row, start_col, end_row, end_col, path, grid) {
  visited[start_row][start_col] = true;
  path.push([start_row, start_col]);
  
  if (start_row === end_row && start_col === end_col) {
    return path;
  }
  const offsets = [[1,0], [0,1], [-1,0], [0,-1]];
  for (let offsetIdx = 0; offsetIdx < 4; offsetIdx ++) {
    const adjRow = start_row + offsets[offsetIdx][0];
    const adjCol = start_col + offsets[offsetIdx][1];
    if (
      (0 <= adjRow && adjRow <= 35) &&
      (0 <= adjCol && adjCol <= 89) &&
      !visited[adjRow][adjCol] &&
      (grid[adjRow][adjCol] === 1 || grid[adjRow][adjCol] === 4) &&
      depthFirstSearch(visited, adjRow, adjCol, end_row, end_col, path, grid)
    ) {
      return path;
    }
  }
  path.pop();
  return false;
}

export default depthFirstSearch;