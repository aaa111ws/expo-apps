import { GRID_SIZE } from './config';

export const isSamePosition = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

export const isOppositeDirection = (d1, d2) => d1.x + d2.x === 0 && d1.y + d2.y === 0;

export const generateRandomFood = (snake) => {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => isSamePosition(s, food)));
  return food;
};

export const checkCollision = (head, snakeBody) => {
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true;
  }
  return snakeBody.some((segment) => isSamePosition(segment, head));
};

export const getNextHeadPosition = (head, dir) => ({
  x: head.x + dir.x,
  y: head.y + dir.y,
});
