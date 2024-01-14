import React, { useEffect, useState } from 'react';
import './Grid.css';
import depthFirstSearch from '../algorithms/DepthFirstSearch';
import dijkstra from '../algorithms/Dijkstra';
import { clear } from '@testing-library/user-event/dist/clear';

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
  5: "path",
  6: "building"
}

function Grid() {
  const [selectedTile, setSelectedTile] = useState("empty");
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [currentPath, setCurrentPath] = useState([]);
  const [grid, setGrid] = useState(Array.from({ length: 36 }, () => Array(90).fill(0)));
  const [weights, setWeights] = useState();

  useEffect(() => {
    let tempWeights = {};
    for (let rowIdx = 0; rowIdx < 36; rowIdx ++) {
      for (let colIdx = 0; colIdx < 90; colIdx ++) {
        const offsets = [[1,0], [0,1], [-1,0], [0,-1]];
  
        for (let offsetIdx = 0; offsetIdx < 4; offsetIdx ++) {
          const nextRow = rowIdx + offsets[offsetIdx][0];
          const nextCol = colIdx + offsets[offsetIdx][1];
          if (
            (0 <= nextRow && nextRow <= 35) &&
            (0 <= nextCol && nextCol <= 89) 
          ) {
            if (!([[rowIdx, colIdx], [nextRow, nextCol]] in tempWeights) && !([[nextRow, nextCol], [rowIdx, colIdx]] in tempWeights)) {
              tempWeights[[[rowIdx, colIdx], [nextRow, nextCol]]] = 1;
            }
          }
        }
      }
    }
  
    setWeights(tempWeights);
  }, [])
  

  function clearGrid() {
    setGrid(Array.from({ length: 36 }, () => Array(90).fill(0)));
    setCurrentPath([]);
  }

  function paint(row, col) {
    resetPath();

    if (selectedTile !== "start" && selectedTile !== "end") {
      const containerRow = Math.floor(row / 3) * 3;
      const containerCol = Math.floor(col / 3) * 3;
      const newGrid = [...grid];
      
      for (let row = 0; row < 3; row ++) {
        for (let col = 0; col < 3; col ++) {
            if (tiles[selectedTile].some(arr => JSON.stringify(arr) === JSON.stringify([row, col]))) {
              newGrid[containerRow + row][containerCol + col] = 1;
            }
            else {
              newGrid[containerRow + row][containerCol + col] = 0;
            }
        }
      }
      setGrid(newGrid);
    }
    else {
      const newGrid = [...grid];
      if (selectedTile === "start") {
        newGrid.forEach(row => row.forEach((value, index) => {
          if (value === 3) {
            row[index] = 0;
          }
        }));
        newGrid[row][col] = 3;
        setStart([row, col])
      }
      else {
        newGrid.forEach(row => row.forEach((value, index) => {
          if (value === 4) {
            row[index] = 0;
          }
        }));
        newGrid[row][col] = 4;
        setEnd([row, col])
      }
      setGrid(newGrid);
    }
  }

  function pathfind(algorithm) {
    resetPath();

    if (start === undefined || end === undefined) {
      alert("you didnt set a start or end");
      return;
    }
    
    let path = [];

    if (algorithm === 'dijkstra') {
      path = dijkstra(start[0], start[1], end[0], end[1], grid, weights);
    }
    else if (algorithm === 'dfs') {
      var visited = Array.from({ length: 36 }, () => Array(90).fill(false));
      path = depthFirstSearch(visited, start[0], start[1], end[0], end[1], [], grid);
    }

    if (!path) {
      alert('no path');
    }
    else {
      let i = 1;
      const intervalId = setInterval(() => {
        if (i < path.length - 1) {
          const [pathRow, pathCol] = path[i];
          const newGrid = [...grid];
          newGrid[pathRow][pathCol] = 5;
          setGrid(newGrid);
          i++;
        } 
        else {
          clearInterval(intervalId);
          setCurrentPath(path);
        }
      }, 25);
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
      <button onClick={() => clearGrid()}>clear</button>
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
      <button onClick={() => pathfind('dfs')}>dfs</button>
      <button onClick={() => pathfind('dijkstra')}>dijkstra</button>
      <ul style={{display: "flex", alignItems: "center", justifyContent: "space-between", listStyle: "none"}}>
        <li onClick={() => setSelectedTile("start")}>
          <div className='grid-cell start'/>
        </li>
        <li onClick={() => setSelectedTile("end")}>
          <div className='grid-cell end'/>
        </li>
        <li onClick={() => setSelectedTile("building")}>
          <div className='grid-cell building'/>
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