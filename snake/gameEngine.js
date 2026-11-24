import { INITIAL_SNAKE, INITIAL_SPEED, MIN_SPEED, SPEED_STEP, DIRECTIONS } from './config';
import { generateRandomFood, checkCollision, getNextHeadPosition, isSamePosition } from './logic';

export function createInitialGameState() {
  return {
    snake: INITIAL_SNAKE,
    food: generateRandomFood(INITIAL_SNAKE),
    direction: DIRECTIONS.UP,
    score: 0,
    speed: INITIAL_SPEED,
    isGameOver: false,
  };
}

export function executeGameStep(state, currentDirection) {
  const newHead = getNextHeadPosition(state.snake[0], currentDirection);

  if (checkCollision(newHead, state.snake)) {
    return { ...state, isGameOver: true };
  }

  const newSnake = [newHead, ...state.snake];
  let newScore = state.score;
  let newFood = state.food;
  let newSpeed = state.speed;

  if (isSamePosition(newHead, state.food)) {
    newScore += 10;
    newFood = generateRandomFood(newSnake);
    newSpeed = Math.max(MIN_SPEED, state.speed - SPEED_STEP);
  } else {
    newSnake.pop();
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    score: newScore,
    speed: newSpeed,
    direction: currentDirection,
  };
}
