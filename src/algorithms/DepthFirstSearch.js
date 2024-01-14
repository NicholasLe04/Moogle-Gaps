function dfs_util(visited, start_row, start_col, end_row, end_col, path, grid) {
  visited[start_row][start_col] = true;
  path.push([start_row, start_col]);
  
  if (start_row === end_row && start_col === end_col) {
    return path;
  }
  const offsets = [[1,0], [0,1], [-1,0], [0,-1]];
  for (let offsetIdx = 0; offsetIdx < 4; offsetIdx ++) {
    const newRow = start_row + offsets[offsetIdx][0];
    const newCol = start_col + offsets[offsetIdx][1];
    if (
      (0 <= newRow && newRow <= 35) &&
      (0 <= newCol && newCol <= 89) &&
      !visited[newRow][newCol] &&
      (grid[newRow][newCol] === 1 || grid[newRow][newCol] === 4) &&
      dfs_util(visited, newRow, newCol, end_row, end_col, path, grid)
    ) {
      return path;
    }
  }
  path.pop();
  return false;
}

export default dfs_util;