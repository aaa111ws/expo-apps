import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GRID_SIZE, COLORS, DIRECTIONS } from './config';

const BOARD_SIZE = Math.min(Dimensions.get('window').width * 0.9, 360);
const CELL_SIZE = BOARD_SIZE / GRID_SIZE;

export function Header({ score, highScore, isPaused, onTogglePause, isGameOver }) {
  return (
    <View style={styles.header}>
      <View style={styles.scoreBox}>
        <Text style={styles.label}>СЧЁТ</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <TouchableOpacity
        style={[styles.pauseButton, isGameOver && styles.disabled]}
        onPress={onTogglePause}
        disabled={isGameOver}
      >
        <Text style={styles.pauseText}>{isPaused ? '▶' : '❚❚'}</Text>
      </TouchableOpacity>
      <View style={styles.scoreBox}>
        <Text style={styles.label}>РЕКОРД</Text>
        <Text style={styles.value}>{highScore}</Text>
      </View>
    </View>
  );
}

export function Board({ snake, food }) {
  return (
    <View style={styles.board}>
      <View style={[styles.cell, styles.food, { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE }]} />
      {snake.map((segment, index) => {
        const isHead = index === 0;
        return (
          <View
            key={`${segment.x}-${segment.y}-${index}`}
            style={[
              styles.cell,
              {
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                backgroundColor: isHead ? COLORS.snakeHead : COLORS.snakeBody,
                borderRadius: isHead ? 5 : 3,
                zIndex: isHead ? 2 : 1,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export function Controls({ onChangeDirection }) {
  const btn = (label, dir) => (
    <TouchableOpacity style={styles.ctrlBtn} onPress={() => onChangeDirection(dir)}>
      <Text style={styles.arrow}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.controls}>
      {btn('▲', DIRECTIONS.UP)}
      <View style={styles.ctrlRow}>
        {btn('◀', DIRECTIONS.LEFT)}
        <View style={styles.spacer} />
        {btn('▶', DIRECTIONS.RIGHT)}
      </View>
      {btn('▼', DIRECTIONS.DOWN)}
    </View>
  );
}

export function GameOverModal({ visible, score, onRestart }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.modalTitle}>ИГРА ОКОНЧЕНА</Text>
        <Text style={styles.scoreText}>Счёт: {score}</Text>
        <TouchableOpacity style={styles.modalBtn} onPress={onRestart}>
          <Text style={styles.modalBtnText}>ИГРАТЬ СНОВА</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginBottom: 16, paddingHorizontal: 10 },
  scoreBox: { alignItems: 'center', minWidth: 70 },
  label: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  value: { color: COLORS.textPrimary, fontSize: 24, fontWeight: 'bold', marginTop: 2 },
  pauseButton: { backgroundColor: COLORS.buttonBg, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  disabled: { opacity: 0.4 },
  pauseText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold' },

  board: { width: BOARD_SIZE, height: BOARD_SIZE, backgroundColor: COLORS.boardBg, borderWidth: 2, borderColor: COLORS.border, position: 'relative', overflow: 'hidden', borderRadius: 6 },
  cell: { position: 'absolute', width: CELL_SIZE - 1, height: CELL_SIZE - 1 },
  food: { backgroundColor: COLORS.food, borderRadius: CELL_SIZE / 2 },

  controls: { marginTop: 24, alignItems: 'center' },
  ctrlRow: { flexDirection: 'row' },
  ctrlBtn: { width: 64, height: 64, backgroundColor: COLORS.buttonBg, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, margin: 4 },
  spacer: { width: 64, height: 64, margin: 4 },
  arrow: { color: COLORS.textPrimary, fontSize: 24 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.78)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  card: { backgroundColor: COLORS.boardBg, paddingVertical: 28, paddingHorizontal: 36, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  modalTitle: { color: COLORS.food, fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  scoreText: { color: COLORS.textPrimary, fontSize: 18, marginBottom: 22 },
  modalBtn: { backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10 },
  modalBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});
