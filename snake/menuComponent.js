import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from './config';

export function MainMenu({ onStartGame, highScore }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐍 ЗМЕЙКА</Text>

      {highScore > 0 && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>ВАШ РЕКОРД</Text>
          <Text style={styles.scoreValue}>{highScore}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={onStartGame}>
        <Text style={styles.startText}>СТАРТ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    color: COLORS.snakeHead,
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  scoreContainer: {
    backgroundColor: COLORS.boardBg,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreValue: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  startButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  startText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
