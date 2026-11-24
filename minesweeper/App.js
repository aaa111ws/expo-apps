import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { COLORS } from './config';
import { useInterval } from './useInterval';
import { Header, BoardView, ModeSwitcher, MainMenu, GameOverModal } from './components';
import { createInitialGameState, handleCellPress, handleCellLongPress } from './gameEngine';

export default function App() {
  const [isInMenu, setIsInMenu] = useState(true);
  const [gameState, setGameState] = useState(createInitialGameState);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFlagMode, setIsFlagMode] = useState(false);

  const startGame = () => {
    setGameState(createInitialGameState());
    setIsPaused(false);
    setIsFlagMode(false);
    setIsInMenu(false);
  };

  const resetGame = () => {
    setGameState(createInitialGameState());
    setIsPaused(false);
    setIsFlagMode(false);
  };

  useInterval(() => {
    setGameState(prev => ({ ...prev, time: prev.time + 1 }));
  }, isInMenu || gameState.isGameOver || isPaused || gameState.isFirstClick ? null : 1000);

  const onCellPress = useCallback((r, c) => {
    setGameState(prev =>
      isFlagMode ? handleCellLongPress(prev, r, c) : handleCellPress(prev, r, c)
    );
  }, [isFlagMode]);

  const onCellLongPress = useCallback((r, c) => {
    setGameState(prev => handleCellLongPress(prev, r, c));
  }, []);

  if (isInMenu) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <MainMenu onStartGame={startGame} highScore={highScore} />
      </SafeAreaView>
    );
  }

  if (gameState.isGameOver && gameState.isWin) {
    if (gameState.time > 0 && (highScore === 0 || gameState.time < highScore)) {
      setHighScore(gameState.time);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Header
        minesLeft={gameState.minesLeft}
        time={gameState.time}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(prev => !prev)}
        onReset={resetGame}
      />

      <BoardView
        board={gameState.board}
        rows={9}
        cols={9}
        onCellPress={onCellPress}
        onCellLongPress={onCellLongPress}
      />

      <ModeSwitcher
        isFlagMode={isFlagMode}
        onToggleMode={() => setIsFlagMode(prev => !prev)}
      />

      {isPaused && !gameState.isGameOver && (
        <TouchableOpacity activeOpacity={1} style={styles.pauseOverlay} onPress={() => setIsPaused(false)}>
          <Text style={styles.pauseLabel}>ПАУЗА</Text>
        </TouchableOpacity>
      )}

      <GameOverModal
        visible={gameState.isGameOver}
        isWin={gameState.isWin}
        score={gameState.time}
        onRestart={resetGame}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  pauseOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  pauseLabel: { color: COLORS.textPrimary, fontSize: 26, fontWeight: 'bold', letterSpacing: 3 },
});
