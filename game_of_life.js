const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 30;
const CELL_SIZE = 30;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
let gameRunning = false;

function randomizeGrid() {
    grid = grid.map(row => row.map(() => Math.random() > 0.5 ? 1 : 0));
    drawGrid();
  }
  function clearGrid() {
    grid = grid.map(row => row.map(() => 0));
    drawGrid();
  }
  function nextGeneration() {
    const newGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        let liveNeighbors = 0;
  
        // Count live neighbors
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue; // current cell
            const ni = i + x;
            const nj = j + y;
            if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
              liveNeighbors += grid[ni][nj]; //live neighbors count
            }
          }
        }
  
        // Apply rules
        if (grid[i][j] === 1) {
          newGrid[i][j] = liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0;
        } else {
          newGrid[i][j] = liveNeighbors === 3 ? 1 : 0;
        }
      }
    }
  
    grid = newGrid;
    drawGrid();
  }
  function drawGrid() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.fillStyle = grid[i][j] === 1 ? '#FFFF00' : '#999999';
        ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#ddd';
        ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
  
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    grid[y][x] = 1 - grid[y][x];
    drawGrid();
  });
  
  // Game loop
  let interval;
  function startstopGame() {
    if (!gameRunning) {
        gameRunning = true;
      interval = setInterval(nextGeneration, 200);
    }
    else {
      stopGame();
    }
  }
  
  function stopGame() {
    gameRunning = false;
    clearInterval(interval);
  }
  
  // Button actions
  document.getElementById('startstopBtn').addEventListener('click', startstopGame);
  document.getElementById('randomBtn').addEventListener('click', randomizeGrid);
  document.getElementById('clearBtn').addEventListener('click', clearGrid);
  
  // Initialize canvas with a clear grid
  drawGrid();
