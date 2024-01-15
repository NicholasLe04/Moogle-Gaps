import React, { useState } from 'react';
import './Grid.css';

import bellmanFord from '../algorithms/BellmanFord';
import depthFirstSearch from '../algorithms/DepthFirstSearch';
import dijkstra from '../algorithms/Dijkstra';
import cityPreset from '../presets/Presets';

const tiles = {
  "empty": [],
  "4-way": [[0,1], [1,0], [1,1], [1,2], [2,1]],
  "3-way-1": [[1,0], [1,1], [1,2], [2,1]],
  "3-way-2": [[0,1], [1,1], [1,2], [2,1]],
  "3-way-3": [[0,1], [1,0], [1,1], [2,1]],
  "3-way-4": [[0,1], [1,0], [1,1], [1,2]],
  "L-turn-1": [[0,1], [1,1], [1,2]],
  "L-turn-2": [[0,1], [1,0], [1,1]],
  "L-turn-3": [[1,0], [1,1], [2,1]],
  "L-turn-4": [[1,1], [1,2], [2,1]],
  "vertical": [[0,1], [1,1], [2,1]],
  "horizontal": [[1,0], [1,1], [1,2]],
  "roundabout": [[0,0], [0,1], [0,2], [1,0], [1,2], [2,0], [2,1], [2,2]]
}

const types = {
  0: "empty", 
  1: "road",
  3: "start",
  4: "end",
  6: "building",
  10: "path no-traffic",
  11: "path mild-traffic",
  12: "path moderate-traffic",
  13: "path high-traffic",
}

function Grid() {
  const [selectedTile, setSelectedTile] = useState("empty");
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [algorithm, setAlgorithm] = useState("dfs");
  const [currentPath, setCurrentPath] = useState([]);
  const [grid, setGrid] = useState(Array.from({ length: 36 }, () => Array(90).fill(0)));
  const [weights, setWeights] = useState(Array.from({ length: 36 }, () => Array(90).fill(1)));

  const offsets = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

  function loadPreset(preset) {
    clearGrid();
    setGrid(structuredClone(preset));
  }

  function clearGrid() {
    setStart();
    setEnd();
    setCurrentPath([]);
    setGrid(Array.from({ length: 36 }, () => Array(90).fill(0)));
    setWeights(Array.from({ length: 36 }, () => Array(90).fill(1)));
  }

  function paintRoad(row, col) {
    const newGrid = [...grid];
    const newWeights = [...weights];
    const containerRow = Math.floor(row / 3) * 3;
    const containerCol = Math.floor(col / 3) * 3;
    
    // paint the 3x3 square
    for (let rowIdx = 0; rowIdx < 3; rowIdx ++) {
      for (let colIdx = 0; colIdx < 3; colIdx ++) {
        const subRowIdx = containerRow + rowIdx;
        const subColIdx = containerCol + colIdx;
        // if painting over a building, adjust weights
        if (newGrid[subRowIdx][subColIdx] === 6) {
          for (let offsetIdx = 0; offsetIdx < offsets.length; offsetIdx ++) {
            const offsetRow = subRowIdx+offsets[offsetIdx][0];
            const offsetCol = subColIdx+offsets[offsetIdx][1];
            if ((0 <= offsetRow && offsetRow <= 35) && (0 <= offsetCol && offsetCol <= 89)) {
              newWeights[offsetRow][offsetCol] --;
            }
          }
        }
        if (tiles[selectedTile].some(arr => JSON.stringify(arr) === JSON.stringify([rowIdx, colIdx]))) {
          newGrid[subRowIdx][subColIdx] = 1;
        }
        else {
          newGrid[subRowIdx][subColIdx] = 0;
        }
      }
    }
    setWeights(newWeights);
    setGrid(newGrid);
  }

  function paintBuilding(row, col) {
    const newGrid = [...grid];
    const newWeights = [...weights];

    newGrid[row][col] = 6;
    for (let offsetIdx = 0; offsetIdx < offsets.length; offsetIdx ++) {
      const offsetRow = row+offsets[offsetIdx][0];
      const offsetCol = col+offsets[offsetIdx][1];
      if ((0 <= offsetRow && offsetRow <= 35) && (0 <= offsetCol && offsetCol <= 89)) {
        newWeights[offsetRow][offsetCol] ++;
      }
    }
    setWeights(newWeights);
    setGrid(newGrid);
  }

  function paintStartEnd(row, col) {
    const newGrid = [...grid];
    const newWeights = [...weights];

    if (newGrid[row][col] === 6) {
      for (let offsetIdx = 0; offsetIdx < offsets.length; offsetIdx ++) {
        const offsetRow = row+offsets[offsetIdx][0];
        const offsetCol = col+offsets[offsetIdx][1];
        if ((0 <= offsetRow && offsetRow <= 35) && (0 <= offsetCol && offsetCol <= 89)) {
          newWeights[offsetRow][offsetCol] --;
        }
      }
    }
    const newValue = selectedTile === "start" ? 3 : 4
    newGrid.forEach(row => row.forEach((value, index) => {
      if (value === newValue) {
        row[index] = 0;
      }
    }));
    newGrid[row][col] = newValue;
    newValue === 3 ? setStart([row, col]) : setEnd([row, col]);

    setWeights(newWeights);
    setGrid(newGrid);
  }

  function paint(row, col) {
    resetPath();

    if (Object.keys(tiles).includes(selectedTile)) {
      paintRoad(row, col);
    }
    else if (selectedTile === "building") {
      paintBuilding(row, col);
    }
    else {
      paintStartEnd(row, col);
    }
  }

  function pathfind() {
    resetPath();

    if (start === undefined || end === undefined) {
      alert("You must set a start and end point to generate a path!");
      return;
    }
    
    let path = [];

    if (algorithm === 'dijkstra') {
      path = dijkstra(start[0], start[1], end[0], end[1], grid, weights);
    }
    else if (algorithm === 'bellman ford') {
      path = bellmanFord(start[0], start[1], end[0], end[1], grid, weights);
    }
    else if (algorithm === 'dfs') {
      var visited = Array.from({ length: 36 }, () => Array(90).fill(false));
      path = depthFirstSearch(visited, start[0], start[1], end[0], end[1], [], grid);
    }

    if (!path) {
      alert('There is no path connecting your start and end points!');
    }
    else {
      let i = 1;
      const intervalId = setInterval(() => {
        if (i < path.length - 1) {
          const [pathRow, pathCol] = path[i];
          const newGrid = [...grid];
          newGrid[pathRow][pathCol] = 10 + Math.floor(weights[pathRow][pathCol] / 2);
          setGrid(newGrid);
          i++;
        } 
        else {
          clearInterval(intervalId);
          setCurrentPath(path);
        }
      }, 15);
    }
  }

  function resetPath() {
    const newGrid = [...grid];
    for (let i = 1; i < currentPath.length-1; i ++) {
      var [pathRow, pathCol] = currentPath[i];
      newGrid[pathRow][pathCol] = 1;
    }
    setGrid(newGrid);

    setCurrentPath([]);
  }

  return (
    <>
      <button onClick={() => {loadPreset(cityPreset)}}>City Preset</button>
      <button onClick={() => clearGrid()}>Clear Grid</button>
      <div className='grid'>
        {grid.map((row, rowIndex) => (
          <div style={{ display: "flex" }} key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <div
                className={`grid-cell ${types[cell]} ${(((rowIndex - 1) % 3 === 0 && (columnIndex - 1) % 3 === 0) ? ' center' : '')}`}
                key={`${rowIndex}-${columnIndex}`}
                onClick={() => paint(rowIndex, columnIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <select onChange={(e) => {setAlgorithm(e.target.value)}}>
        <option value="dfs">Depth First Search</option>
        <option value="dijkstra">Dijkstra's Algorithm</option>
        <option value="bellman ford">Bellman Ford</option>
      </select>
      <button onClick={pathfind}>Find a Path!</button>
      <ul style={{display: "flex", alignItems: "center", justifyContent: "space-between", listStyle: "none"}}>
        <li onClick={() => setSelectedTile("start")}>
          Start
          <div className='grid-cell-lrg start'/>
        </li>
        <li onClick={() => setSelectedTile("end")}>
          End
          <div className='grid-cell-lrg end'/>
        </li>
        <li onClick={() => setSelectedTile("building")}>
          Building
          <div className='grid-cell-lrg building'/>
        </li>
        {
          Object.keys(tiles).map((tile) => {
            return (
              <li style={{margin: "20px"}} onClick={() => setSelectedTile(tile)}>
                {
                  [0,1,2].map((rowIdx) => {
                    return( <div style={{display: "flex"}}>
                      {
                        [0,1,2].map((colIdx) => {
                          return(
                            <div 
                              className='grid-cell'
                              style={{ backgroundColor: tiles[tile].some(arr => JSON.stringify(arr) === JSON.stringify([rowIdx, colIdx])) ? "gray" : "white" }}
                            />
                          )
                        })
                      }
                    </div>)
                  })
                }
              </li>
            )
          })
        }
      </ul>
    </>
  );
}

export default Grid;