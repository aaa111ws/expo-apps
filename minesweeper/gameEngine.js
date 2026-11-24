import { BOARD_SIZE, MINE_COUNT } from './config';
import { createBoard, plantMines, revealCell, checkWin } from './logic';

export function createInitialGameState() {
  return {
    board: createBoard(BOARD_SIZE, BOARD_SIZE),
    isFirstClick: true,
    isGameOver: false,
    isWin: false,
    time: 0,
    minesLeft: MINE_COUNT,
  };
}

export function handleCellPress(state, r, c) {
  if (state.isGameOver || state.board[r][c].isFlagged || state.board[r][c].isRevealed) {
    return state;
  }

  let newBoard = state.board;
  let isFirstClick = state.isFirstClick;

  if (isFirstClick) {
    newBoard = plantMines(newBoard, BOARD_SIZE, BOARD_SIZE, MINE_COUNT, r, c);
    isFirstClick = false;
  }

  if (newBoard[r][c].isMine) {
    // Взрыв: открываем все мины на поле
    let revealedBoard = newBoard.map(row => row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed
    })));
    return {
      ...state,
      board: revealedBoard,
      isGameOver: true,
      isWin: false,
      isFirstClick,
    };
  }

  newBoard = revealCell(newBoard, r, c, BOARD_SIZE, BOARD_SIZE);
  const won = checkWin(newBoard, BOARD_SIZE, BOARD_SIZE);

  if (won) {
    let flaggedBoard = newBoard.map(row => row.map(cell => ({
      ...cell,
      isFlagged: cell.isMine ? true : cell.isFlagged
    })));
    return {
      ...state,
      board: flaggedBoard,
      isGameOver: true,
      isWin: true,
      isFirstClick,
    };
  }

  return {
    ...state,
    board: newBoard,
    isFirstClick,
  };
}

export function handleCellLongPress(state, r, c) {
  if (state.isGameOver || state.board[r][c].isRevealed) return state;

  let newBoard = state.board.map(row => row.map(cell => ({ ...cell })));
  let cell = newBoard[r][c];
  cell.isFlagged = !cell.isFlagged;

  let minesLeft = state.minesLeft + (cell.isFlagged ? -1 : 1);

  return {
    ...state,
    board: newBoard,
    minesLeft,
  };
}
