export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 65;
export const SPEED_STEP = 3;

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const COLORS = {
  background: '#121212',
  boardBg: '#1E1E1E',
  border: '#333333',
  snakeHead: '#00E676',
  snakeBody: '#00C853',
  food: '#FF5252',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  buttonBg: '#2C2C2C',
  accent: '#00E676',
};
