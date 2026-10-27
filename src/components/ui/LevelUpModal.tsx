import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { NeoCard } from '@/components/ui/NeoCard';
import { NeoButton } from '@/components/ui/NeoButton';

export interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onDismiss: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  level,
  onDismiss,
}) => {
  useEffect(() => {
    if (visible) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {}
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <NeoCard variant="butterYellow" style={styles.card} shadowDistance={4}>
          {/* Confetti & Icon Header */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏆</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.sparkleBadge}>
              <Text style={styles.sparkleText}>⚡ PROMOTED</Text>
            </View>
          </View>

          <Text style={styles.title}>LEVEL UP!</Text>
          <Text style={styles.levelSubtitle}>WELCOME TO LEVEL {level}</Text>

          <Text style={styles.description}>
            Your mental math power just ascended! Keep your daily streak going to earn higher XP multipliers.
          </Text>

          <NeoButton
            variant="mint"
            size="lg"
            title="KEEP CRUSHING! ➔"
            onPress={onDismiss}
            style={styles.actionButton}
          />
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
    gap: Spacing.sm,
  },
  iconContainer: {
    backgroundColor: Palette.white,
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.full,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 42,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  sparkleBadge: {
    backgroundColor: Palette.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  sparkleText: {
    fontFamily: Typography.badge,
    fontSize: 10,
    color: Palette.white,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 34,
    color: Palette.text,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  levelSubtitle: {
    fontFamily: Typography.badge,
    fontSize: 15,
    fontWeight: '800',
    color: Palette.text,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Palette.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: Spacing.xs,
  },
  actionButton: {
    alignSelf: 'stretch',
    marginTop: Spacing.xs,
  },
});

export default LevelUpModal;
