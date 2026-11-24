import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BOARD_DISPLAY_SIZE = Math.min(SCREEN_WIDTH * 0.9, 360);

export function Header({ minesLeft, time, isPaused, onTogglePause, onReset }) {
  return (
    <View style={styles.header}>
      <View style={styles.infoBox}>
        <Text style={styles.label}>МИНЫ</Text>
        <Text style={styles.value}>{minesLeft}</Text>
      </View>

      <View style={styles.centerControls}>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetEmoji}>😊</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pauseButton} onPress={onTogglePause}>
          <Text style={styles.pauseText}>{isPaused ? '▶' : '❚❚'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>ВРЕМЯ</Text>
        <Text style={styles.value}>{time}</Text>
      </View>
    </View>
  );
}

export function BoardView({ board, cols, onCellPress, onCellLongPress }) {
  const cellSize = BOARD_DISPLAY_SIZE / cols;

  return (
    <View style={[styles.board, { width: BOARD_DISPLAY_SIZE, height: BOARD_DISPLAY_SIZE }]}>
      {board.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell, c) => {
            let content = '';
            let textColor = COLORS.textPrimary;

            if (cell.isRevealed) {
              if (cell.isMine) {
                content = '💣';
              } else if (cell.neighborMines > 0) {
                content = cell.neighborMines.toString();
                textColor = COLORS.numbers[cell.neighborMines] || COLORS.textPrimary;
              }
            } else if (cell.isFlagged) {
              content = '🚩';
            }

            return (
              <TouchableOpacity
                key={c}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell.isRevealed ? COLORS.cellRevealed : COLORS.cellHidden,
                  },
                ]}
                onPress={() => onCellPress(r, c)}
                onLongPress={() => onCellLongPress(r, c)}
                activeOpacity={0.7}
              >
                <Text style={[styles.cellText, { color: textColor, fontSize: cellSize * 0.45 }]}>
                  {content}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function ModeSwitcher({ isFlagMode, onToggleMode }) {
  return (
    <TouchableOpacity
      style={[
        styles.modeButton,
        { borderColor: isFlagMode ? COLORS.flag : COLORS.accent },
      ]}
      onPress={onToggleMode}
      activeOpacity={0.8}
    >
      <Text style={styles.modeText}>
        {isFlagMode ? '🚩 РЕЖИМ: ФЛАЖОК' : '⛏️ РЕЖИМ: КОПАТЬ'}
      </Text>
    </TouchableOpacity>
  );
}

export function MainMenu({ onStartGame, highScore }) {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>💣 САПЁР</Text>

      {highScore > 0 && (
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>ЛУЧШЕЕ ВРЕМЯ</Text>
          <Text style={styles.scoreValue}>{highScore} сек</Text>
        </View>
      )}

      <TouchableOpacity style={styles.startButton} onPress={onStartGame} activeOpacity={0.8}>
        <Text style={styles.startText}>ИГРАТЬ</Text>
      </TouchableOpacity>
    </View>
  );
}

export function GameOverModal({ visible, isWin, score, onRestart }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={[styles.modalTitle, { color: isWin ? COLORS.accent : COLORS.danger }]}>
          {isWin ? 'ПОБЕДА! 🎉' : 'ВЗРЫВ! 💥'}
        </Text>
        <Text style={styles.modalText}>{isWin ? `Время: ${score} сек` : 'Вы подорвались на мине'}</Text>
        <TouchableOpacity style={styles.modalBtn} onPress={onRestart}>
          <Text style={styles.modalBtnText}>ИГРАТЬ СНОВА</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginBottom: 16, paddingHorizontal: 10 },
  infoBox: { alignItems: 'center', minWidth: 70, backgroundColor: COLORS.boardBg, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '700' },
  value: { color: COLORS.textPrimary, fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  centerControls: { flexDirection: 'row', alignItems: 'center' },
  resetButton: { backgroundColor: COLORS.boardBg, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  resetEmoji: { fontSize: 20 },
  pauseButton: { backgroundColor: COLORS.boardBg, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  pauseText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: 'bold' },

  board: { backgroundColor: COLORS.boardBg, borderWidth: 2, borderColor: COLORS.border, borderRadius: 6, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  cell: { justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.border },
  cellText: { fontWeight: 'bold' },

  modeButton: {
    marginTop: 20,
    backgroundColor: COLORS.boardBg,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  modeText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  menuContainer: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', width: '100%' },
  menuTitle: { color: COLORS.danger, fontSize: 42, fontWeight: 'bold', marginBottom: 8 },
  scoreBox: { backgroundColor: COLORS.boardBg, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', marginBottom: 40 },
  scoreLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  scoreValue: { color: COLORS.textPrimary, fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  startButton: { backgroundColor: COLORS.accent, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14 },
  startText: { color: '#000', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.78)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  card: { backgroundColor: COLORS.boardBg, paddingVertical: 28, paddingHorizontal: 36, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalText: { color: COLORS.textPrimary, fontSize: 16, marginBottom: 22 },
  modalBtn: { backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10 },
  modalBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});
