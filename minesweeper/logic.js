export function createBoard(rows, cols) {
  let board = Array(rows).fill(null).map((_, r) =>
    Array(cols).fill(null).map((_, c) => ({
      row: r,
      col: c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
  return board;
}

export function plantMines(board, rows, cols, mines, firstRow, firstCol) {
  let placedMines = 0;
  let newBoard = board.map(row => row.map(cell => ({ ...cell })));

  while (placedMines < mines) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);

    if (Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1) continue;

    if (!newBoard[r][c].isMine) {
      newBoard[r][c].isMine = true;
      placedMines++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let nr = r + dr;
          let nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
            count++;
          }
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

export function revealCell(board, r, c, rows, cols) {
  if (board[r][c].isRevealed || board[r][c].isFlagged) return board;

  let newBoard = board.map(row => row.map(cell => ({ ...cell })));
  let queue = [[r, c]];

  while (queue.length > 0) {
    let [currR, currC] = queue.shift();
    let cell = newBoard[currR][currC];

    if (cell.isRevealed || cell.isFlagged) continue;
    cell.isRevealed = true;

    if (cell.neighborMines === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let nr = currR + dr;
          let nc = currC + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (!newBoard[nr][nc].isRevealed && !newBoard[nr][nc].isFlagged) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return newBoard;
}

export function checkWin(board, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cell = board[r][c];
      if (!cell.isMine && !cell.isRevealed) return false;
    }
  }
  return true;
}
