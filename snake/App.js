import React, { useState, useRef, useCallback } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text } from 'react-native';
import { COLORS } from './config';
import { isOppositeDirection } from './logic';
import { useInterval } from './useInterval';
import { Header, Board, Controls, GameOverModal } from './components';
import { MainMenu } from './menuComponent';
import { createInitialGameState, executeGameStep } from './gameEngine';

export default function App() {
  const [isInMenu, setIsInMenu] = useState(true);
  const [gameState, setGameState] = useState(createInitialGameState);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentTickDirection = useRef(gameState.direction);

  const handleDirectionChange = useCallback((newDir) => {
    if (isOppositeDirection(currentTickDirection.current, newDir)) return;
    currentTickDirection.current = newDir;
  }, []);

  const startGame = () => {
    const freshState = createInitialGameState();
    setGameState(freshState);
    currentTickDirection.current = freshState.direction;
    setIsPaused(false);
    setIsInMenu(false);
  };

  const resetGame = () => {
    const freshState = createInitialGameState();
    setGameState(freshState);
    currentTickDirection.current = freshState.direction;
    setIsPaused(false);
  };

  const gameStep = () => {
    setGameState((prevState) => {
      const nextState = executeGameStep(prevState, currentTickDirection.current);
      if (nextState.isGameOver && nextState.score > highScore) {
        setHighScore(nextState.score);
      }
      return nextState;
    });
  };

  useInterval(gameStep, isInMenu || gameState.isGameOver || isPaused ? null : gameState.speed);

  if (isInMenu) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <MainMenu onStartGame={startGame} highScore={highScore} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Header
        score={gameState.score}
        highScore={highScore}
        isPaused={isPaused}
        isGameOver={gameState.isGameOver}
        onTogglePause={() => setIsPaused((prev) => !prev)}
      />

      <View style={styles.boardWrapper}>
        <Board snake={gameState.snake} food={gameState.food} />
        {isPaused && !gameState.isGameOver && (
          <View style={styles.pauseOverlay}>
            <Text style={styles.pauseLabel}>ПАУЗА</Text>
          </View>
        )}
      </View>

      <Controls onChangeDirection={handleDirectionChange} />

      <GameOverModal
        visible={gameState.isGameOver}
        score={gameState.score}
        onRestart={resetGame}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  pauseLabel: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});
