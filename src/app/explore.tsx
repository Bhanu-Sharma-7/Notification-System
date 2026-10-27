import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Palette, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard, NeoCardVariant } from '@/components/ui/NeoCard';
import { NeoAdBanner } from '@/components/ads/NeoAdBanner';
import { useGameStats } from '@/hooks/useGameStats';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  color: NeoCardVariant;
}

export default function ExploreScreen() {
  const { stats, resetStats } = useGameStats();

  const accuracy = stats.totalSolved > 0
    ? Math.round((stats.totalCorrect / stats.totalSolved) * 100)
    : 0;

  // Achievement logic
  const achievements: Achievement[] = [
    {
      id: 'rookie',
      title: 'ROOKIE SOLVER',
      desc: 'Solve at least 5 math questions',
      icon: '🥉',
      unlocked: stats.totalSolved >= 5,
      color: 'butterYellow',
    },
    {
      id: 'streak_master',
      title: 'STREAK MASTER',
      desc: 'Maintain a 3-day daily streak',
      icon: '🔥',
      unlocked: stats.bestStreak >= 3,
      color: 'softCoral',
    },
    {
      id: 'quick_thinker',
      title: 'QUICK THINKER',
      desc: 'Solve 25 total questions',
      icon: '⚡',
      unlocked: stats.totalSolved >= 25,
      color: 'mint',
    },
    {
      id: 'sharpshooter',
      title: 'SHARPSHOOTER',
      desc: 'Maintain 80%+ accuracy (min 10 solved)',
      icon: '🎯',
      unlocked: stats.totalSolved >= 10 && accuracy >= 80,
      color: 'lavender',
    },
    {
      id: 'century_club',
      title: 'CENTURY CLUB',
      desc: 'Solve 100 total questions',
      icon: '💯',
      unlocked: stats.totalSolved >= 100,
      color: 'peach',
    },
    {
      id: 'grandmaster',
      title: 'GRANDMASTER',
      desc: 'Reach Level 5 progression',
      icon: '👑',
      unlocked: stats.level >= 5,
      color: 'butterYellow',
    },
    {
      id: 'daily_grinder',
      title: 'DAILY GRINDER',
      desc: 'Maintain a 7-day daily streak',
      icon: '🗓️',
      unlocked: stats.bestStreak >= 7,
      color: 'softCoral',
    },
    {
      id: 'math_ninja',
      title: 'MATH NINJA',
      desc: 'Reach Level 10 mastery',
      icon: '🥷',
      unlocked: stats.level >= 10,
      color: 'mint',
    },
  ];

  const handleReset = () => {
    Alert.alert(
      'Reset All Progress?',
      'Yeh aapki streak, XP, high scores, aur achievements sabhi ko wipe kar dega. Kya aap sure hain?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Reset',
          style: 'destructive',
          onPress: async () => {
            await resetStats();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>STATS & TROPHIES</Text>
          <Text style={styles.headerSubtitle}>Offline Mental Progress</Text>
        </View>

        {/* 1. Performance Overview Card */}
        <NeoCard variant="white" style={styles.overviewCard} shadowDistance={4}>
          <Text style={styles.sectionHeading}>🎯 PERFORMANCE OVERVIEW</Text>
          
          <View style={styles.bigAccuracyBox}>
            <Text style={styles.bigAccuracyNumber}>{accuracy}%</Text>
            <Text style={styles.bigAccuracyLabel}>OVERALL ACCURACY</Text>
          </View>

          <View style={styles.statBreakdownGrid}>
            <View style={[styles.breakdownPill, { backgroundColor: Palette.mint }]}>
              <Text style={styles.breakdownValue}>{stats.totalCorrect}</Text>
              <Text style={styles.breakdownLabel}>CORRECT</Text>
            </View>
            <View style={[styles.breakdownPill, { backgroundColor: Palette.softCoral }]}>
              <Text style={styles.breakdownValue}>{stats.totalWrong}</Text>
              <Text style={styles.breakdownLabel}>WRONG</Text>
            </View>
            <View style={[styles.breakdownPill, { backgroundColor: Palette.peach }]}>
              <Text style={styles.breakdownValue}>{stats.totalSolved}</Text>
              <Text style={styles.breakdownLabel}>TOTAL</Text>
            </View>
            <View style={[styles.breakdownPill, { backgroundColor: Palette.butterYellow }]}>
              <Text style={styles.breakdownValue}>{stats.bestStreak}d</Text>
              <Text style={styles.breakdownLabel}>BEST STREAK</Text>
            </View>
          </View>
        </NeoCard>

        {/* 2. Category High Scores Breakdown */}
        <NeoCard variant="white" style={styles.breakdownCard}>
          <Text style={styles.sectionHeading}>📊 CATEGORY HIGH SCORES</Text>

          <View style={styles.categoryGrid}>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryGroupTitle}>ARITHMETIC</Text>
              {[
                { label: 'Addition', key: 'addition' },
                { label: 'Subtraction', key: 'subtraction' },
                { label: 'Multiplication', key: 'multiplication' },
                { label: 'Division', key: 'division' },
                { label: 'Mixed Ops', key: 'mixed' },
              ].map((item) => (
                <View key={item.key} style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>{item.label}</Text>
                  <Text style={styles.scoreNumber}>
                    {stats.categoryHighScores[item.key] ?? 0}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.categoryDivider} />

            <View style={styles.categoryColumn}>
              <Text style={styles.categoryGroupTitle}>ADVANCED</Text>
              {[
                { label: 'Trigonometry', key: 'trigonometry' },
                { label: 'Squares (x²)', key: 'squares' },
                { label: 'Roots (√x)', key: 'roots' },
                { label: 'Cubes (x³)', key: 'cubes' },
                { label: 'Percent (%)', key: 'percentages' },
              ].map((item) => (
                <View key={item.key} style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>{item.label}</Text>
                  <Text style={styles.scoreNumber}>
                    {stats.categoryHighScores[item.key] ?? 0}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </NeoCard>

        {/* 3. Badges & Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionHeadingOutside}>🏆 UNLOCKABLE BADGES</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((item) => {
              const cardBg = item.unlocked ? item.color : 'white';
              return (
                <NeoCard
                  key={item.id}
                  variant={cardBg}
                  style={[
                    styles.achievementCard,
                    !item.unlocked && styles.lockedCard,
                  ]}
                  shadowDistance={item.unlocked ? 3 : 1}
                >
                  <View style={styles.achievementIconRow}>
                    <Text style={styles.achievementIcon}>{item.icon}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: item.unlocked
                            ? Palette.border
                            : Palette.textMuted,
                        },
                      ]}
                    >
                      <Text style={styles.statusPillText}>
                        {item.unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementDesc}>{item.desc}</Text>
                </NeoCard>
              );
            })}
          </View>
        </View>

        {/* 4. Danger Zone / Reset Stats */}
        <NeoCard variant="peach" style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>⚙️ DATA MANAGEMENT</Text>
          <Text style={styles.dangerDesc}>
            Aapka data 100% locally device storage par saved hai. Agar aap starting se dobara khelna chahte hain toh reset kar sakte hain.
          </Text>
          <NeoButton
            title="RESET ALL STATS & PROGRESS"
            variant="softCoral"
            size="md"
            onPress={handleReset}
            style={styles.resetBtn}
          />
        </NeoCard>

        {/* Monetization Banner */}
        <NeoAdBanner variant="butterYellow" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  header: {
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    fontFamily: Typography.display,
    fontSize: 26,
    color: Palette.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Palette.textMuted,
    fontWeight: '600',
  },
  sectionHeading: {
    fontFamily: Typography.badge,
    fontSize: 14,
    color: Palette.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  sectionHeadingOutside: {
    fontFamily: Typography.badge,
    fontSize: 15,
    color: Palette.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  overviewCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  bigAccuracyBox: {
    backgroundColor: Palette.background,
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigAccuracyNumber: {
    fontFamily: Typography.display,
    fontSize: 48,
    color: Palette.text,
  },
  bigAccuracyLabel: {
    fontFamily: Typography.badge,
    fontSize: 11,
    color: Palette.textMuted,
    letterSpacing: 0.5,
    marginTop: -4,
  },
  statBreakdownGrid: {
    flexDirection: 'row',
    gap: Spacing.xs,
    justifyContent: 'space-between',
  },
  breakdownPill: {
    flex: 1,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  breakdownValue: {
    fontFamily: Typography.display,
    fontSize: 16,
    color: Palette.text,
  },
  breakdownLabel: {
    fontFamily: Typography.badge,
    fontSize: 9,
    color: Palette.text,
    marginTop: 2,
  },
  breakdownCard: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  categoryColumn: {
    flex: 1,
    gap: 6,
  },
  categoryDivider: {
    width: 2,
    backgroundColor: Palette.border,
  },
  categoryGroupTitle: {
    fontFamily: Typography.badge,
    fontSize: 11,
    color: Palette.textMuted,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  scoreLabel: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: Palette.text,
    fontWeight: '600',
  },
  scoreNumber: {
    fontFamily: Typography.badge,
    fontSize: 12,
    color: Palette.text,
    fontWeight: '800',
  },
  achievementsSection: {
    gap: Spacing.xs,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    padding: Spacing.sm,
    gap: 4,
    borderRadius: BorderRadius.md,
  },
  lockedCard: {
    opacity: 0.55,
    backgroundColor: '#F1F1EF',
  },
  achievementIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  achievementIcon: {
    fontSize: 24,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusPillText: {
    fontSize: 8,
    fontFamily: Typography.badge,
    color: Palette.white,
  },
  achievementTitle: {
    fontFamily: Typography.badge,
    fontSize: 11,
    color: Palette.text,
    fontWeight: '800',
  },
  achievementDesc: {
    fontFamily: Typography.sans,
    fontSize: 10,
    color: Palette.textMuted,
    lineHeight: 14,
  },
  dangerCard: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  dangerTitle: {
    fontFamily: Typography.badge,
    fontSize: 13,
    color: Palette.text,
  },
  dangerDesc: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: Palette.textMuted,
    lineHeight: 16,
  },
  resetBtn: {
    marginTop: Spacing.xs,
  },
});
