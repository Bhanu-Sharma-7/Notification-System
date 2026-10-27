import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { NeoCard } from '@/components/ui/NeoCard';

export interface BlitzTimerBarProps {
  secondsLeft: number;
  totalSeconds?: number;
  score: number;
}

export const BlitzTimerBar: React.FC<BlitzTimerBarProps> = ({
  secondsLeft,
  totalSeconds = 60,
  score,
}) => {
  const percentage = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const isUrgent = secondsLeft <= 10;
  const timerColor = isUrgent ? Palette.softCoral : Palette.butterYellow;

  const formattedTime = `00:${String(Math.max(0, secondsLeft)).padStart(2, '0')}`;

  return (
    <NeoCard
      variant={isUrgent ? 'softCoral' : 'white'}
      style={styles.container}
      shadowDistance={3}
    >
      <View style={styles.topRow}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeLabel}>⏱️ TIME</Text>
          <Text style={[styles.timeValue, isUrgent && styles.urgentText]}>
            {formattedTime}
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>⚡ BLITZ SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage * 100}%`,
              backgroundColor: timerColor,
            },
          ]}
        />
      </View>
    </NeoCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.sm,
    gap: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeLabel: {
    fontFamily: Typography.badge,
    fontSize: 10,
    color: Palette.textMuted,
  },
  timeValue: {
    fontFamily: Typography.display,
    fontSize: 20,
    color: Palette.text,
  },
  urgentText: {
    color: '#DC2626',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreLabel: {
    fontFamily: Typography.badge,
    fontSize: 10,
    color: Palette.textMuted,
  },
  scoreValue: {
    fontFamily: Typography.display,
    fontSize: 20,
    color: Palette.text,
  },
  track: {
    height: 12,
    backgroundColor: Palette.background,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRightWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.full,
  },
});

export default BlitzTimerBar;
