import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { NeoCard } from '@/components/ui/NeoCard';
import { NeoButton } from '@/components/ui/NeoButton';
import { soundController } from '@/utils/audio';

export interface BlitzSummaryModalProps {
  visible: boolean;
  score: number;
  correctCount: number;
  totalAnswered: number;
  bonusXp: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const BlitzSummaryModal: React.FC<BlitzSummaryModalProps> = ({
  visible,
  score,
  correctCount,
  totalAnswered,
  bonusXp,
  isNewHighScore,
  onPlayAgain,
  onExit,
}) => {
  useEffect(() => {
    if (visible) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        soundController.playSuccess();
      } catch {}
    }
  }, [visible]);

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onExit}
    >
      <View style={styles.overlay}>
        <NeoCard variant="white" style={styles.card} shadowDistance={4}>
          <View style={styles.headerBadgeRow}>
            <View
              style={[
                styles.headerBadge,
                { backgroundColor: isNewHighScore ? Palette.butterYellow : Palette.mint },
              ]}
            >
              <Text style={styles.headerBadgeText}>
                {isNewHighScore ? '🏆 NEW RECORD!' : '⚡ BLITZ COMPLETE'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{"TIME'S UP!"}</Text>

          {/* Big Score Box */}
          <View style={styles.scoreBox}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreLabel}>TOTAL BLITZ POINTS</Text>
          </View>

          {/* Stats Breakdown Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statPill, { backgroundColor: Palette.mint }]}>
              <Text style={styles.statVal}>{correctCount}</Text>
              <Text style={styles.statLbl}>CORRECT</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: Palette.peach }]}>
              <Text style={styles.statVal}>{accuracy}%</Text>
              <Text style={styles.statLbl}>ACCURACY</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: Palette.lavender }]}>
              <Text style={styles.statVal}>+{bonusXp}</Text>
              <Text style={styles.statLbl}>BONUS XP</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonStack}>
            <NeoButton
              variant="butterYellow"
              size="lg"
              title="PLAY AGAIN ➔"
              onPress={onPlayAgain}
            />
            <NeoButton
              variant="card"
              size="md"
              title="BACK TO PRACTICE"
              onPress={onExit}
            />
          </View>
        </NeoCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  headerBadgeRow: {
    flexDirection: 'row',
  },
  headerBadge: {
    borderWidth: 2,
    borderColor: Palette.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  headerBadgeText: {
    fontFamily: Typography.badge,
    fontSize: 11,
    fontWeight: '800',
    color: Palette.text,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 32,
    color: Palette.text,
    textAlign: 'center',
  },
  scoreBox: {
    width: '100%',
    backgroundColor: Palette.background,
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  scoreNumber: {
    fontFamily: Typography.display,
    fontSize: 44,
    color: Palette.text,
  },
  scoreLabel: {
    fontFamily: Typography.badge,
    fontSize: 10,
    color: Palette.textMuted,
    marginTop: -2,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.xs,
    justifyContent: 'space-between',
  },
  statPill: {
    flex: 1,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: Typography.display,
    fontSize: 18,
    color: Palette.text,
  },
  statLbl: {
    fontFamily: Typography.badge,
    fontSize: 8,
    color: Palette.text,
    marginTop: 2,
  },
  buttonStack: {
    width: '100%',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
});

export default BlitzSummaryModal;
