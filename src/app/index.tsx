import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette, Typography, Spacing, BorderRadius, NeoStyles } from '@/constants/theme';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import { NeoAdBanner } from '@/components/ads/NeoAdBanner';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import {
  generateArithmeticQuestion,
  generateAdvancedQuestion,
  MathQuestion,
  OperationType,
  AdvancedCategory,
} from '@/utils/mathEngine';
import { useGameStats } from '@/hooks/useGameStats';

export default function HomeScreen() {
  const { stats, recordAnswer } = useGameStats();

  // Mode and Category selection
  const [tier, setTier] = useState<'arithmetic' | 'advanced'>('arithmetic');
  const [arithmeticOp, setArithmeticOp] = useState<OperationType>('addition');
  const [advancedCat, setAdvancedCat] = useState<AdvancedCategory>('trigonometry');

  // Gameplay state
  const [question, setQuestion] = useState<MathQuestion>(() =>
    generateArithmeticQuestion({ operation: 'addition', digits: 2 })
  );
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Celebration state
  const [levelUpVisible, setLevelUpVisible] = useState<boolean>(false);
  const [newLevelReached, setNewLevelReached] = useState<number>(1);

  // Built-in Pastel Calculator Modal State
  const [calcVisible, setCalcVisible] = useState<boolean>(false);
  const [calcExpr, setCalcExpr] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');

  const resetQuestionState = (newQ: MathQuestion) => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setFeedbackMsg('');
    setQuestion(newQ);
  };

  const handleSelectTier = (newTier: 'arithmetic' | 'advanced') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    setTier(newTier);
    if (newTier === 'arithmetic') {
      resetQuestionState(generateArithmeticQuestion({ operation: arithmeticOp, digits: 2 }));
    } else {
      resetQuestionState(generateAdvancedQuestion(advancedCat));
    }
  };

  const handleSelectArithmeticOp = (op: OperationType) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    setArithmeticOp(op);
    resetQuestionState(generateArithmeticQuestion({ operation: op, digits: 2 }));
  };

  const handleSelectAdvancedCat = (cat: AdvancedCategory) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    setAdvancedCat(cat);
    resetQuestionState(generateAdvancedQuestion(cat));
  };

  // Generate next question
  const loadNextQuestion = () => {
    if (tier === 'arithmetic') {
      resetQuestionState(generateArithmeticQuestion({ operation: arithmeticOp, digits: 2 }));
    } else {
      resetQuestionState(generateAdvancedQuestion(advancedCat));
    }
  };

  // Answer selection handler
  const handleSelectOption = async (option: string | number) => {
    if (isAnswered || !question) return;

    const correct = String(option) === String(question.correctAnswer);
    setSelectedOption(option);
    setIsAnswered(true);
    setIsCorrect(correct);

    const categoryKey = tier === 'arithmetic' ? arithmeticOp : advancedCat;
    const result = await recordAnswer(categoryKey, correct);

    if (correct) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {}
      setFeedbackMsg(`🎯 AWESOME! +${result.xpGain} XP`);

      if (result.leveledUp) {
        setNewLevelReached(result.newLevel);
        setTimeout(() => setLevelUpVisible(true), 350);
      }
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      } catch {}
      setFeedbackMsg(`❌ Oops! Answer is ${question.correctAnswer}`);
    }
  };

  // Calculator logic
  const handleCalcPress = (val: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    if (val === 'C') {
      setCalcExpr('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe evaluation for basic arithmetic expressions
        const sanitized = calcExpr.replace(/×/g, '*').replace(/÷/g, '/');
        const evaluated = Function(`'use strict'; return (${sanitized})`)();
        setCalcResult(String(Number(evaluated.toFixed(4))));
      } catch {
        setCalcResult('Error');
      }
    } else {
      setCalcExpr((prev) => prev + val);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header & Stats Banner */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appTitle}>MATH CRUSH</Text>
            <Text style={styles.appSubtitle}>Neo-Brutalist Mental Arena</Text>
          </View>
          <NeoButton
            variant="butterYellow"
            size="sm"
            onPress={() => setCalcVisible(true)}
            title="🧮 CALC"
          />
        </View>

        {/* Stats Strip */}
        <View style={styles.statsGrid}>
          <NeoCard variant="butterYellow" style={styles.statCard}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>🔥 {stats.currentStreak}d</Text>
          </NeoCard>
          <NeoCard variant="mint" style={styles.statCard}>
            <Text style={styles.statLabel}>LEVEL</Text>
            <Text style={styles.statValue}>⚡ Lvl {stats.level}</Text>
          </NeoCard>
          <NeoCard variant="lavender" style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL XP</Text>
            <Text style={styles.statValue}>⭐ {stats.xp}</Text>
          </NeoCard>
          <NeoCard variant="softCoral" style={styles.statCard}>
            <Text style={styles.statLabel}>SOLVED</Text>
            <Text style={styles.statValue}>🎯 {stats.totalSolved}</Text>
          </NeoCard>
        </View>

        {/* 2. Tier & Category Selector */}
        <NeoCard variant="card" style={styles.selectorCard}>
          <View style={styles.tierToggleRow}>
            <Pressable
              style={[
                styles.tierButton,
                tier === 'arithmetic' && styles.tierButtonActive,
              ]}
              onPress={() => handleSelectTier('arithmetic')}
            >
              <Text style={styles.tierButtonText}>ARITHMETIC</Text>
            </Pressable>
            <Pressable
              style={[
                styles.tierButton,
                tier === 'advanced' && styles.tierButtonActive,
              ]}
              onPress={() => handleSelectTier('advanced')}
            >
              <Text style={styles.tierButtonText}>ADVANCED / FORMULAS</Text>
            </Pressable>
          </View>

          {/* Sub-categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subCategoryRow}
          >
            {tier === 'arithmetic' ? (
              <>
                {(['addition', 'subtraction', 'multiplication', 'division', 'mixed'] as OperationType[]).map((op) => (
                  <Pressable
                    key={op}
                    style={[
                      styles.subBadge,
                      arithmeticOp === op && styles.subBadgeActive,
                    ]}
                    onPress={() => handleSelectArithmeticOp(op)}
                  >
                    <Text style={styles.subBadgeText}>
                      {op === 'addition' && '+ ADD'}
                      {op === 'subtraction' && '- SUB'}
                      {op === 'multiplication' && '× MUL'}
                      {op === 'division' && '÷ DIV'}
                      {op === 'mixed' && '⚡ MIXED'}
                    </Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <>
                {(['trigonometry', 'squares', 'roots', 'cubes', 'percentages'] as AdvancedCategory[]).map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.subBadge,
                      advancedCat === cat && styles.subBadgeActive,
                    ]}
                    onPress={() => handleSelectAdvancedCat(cat)}
                  >
                    <Text style={styles.subBadgeText}>
                      {cat === 'trigonometry' && '📐 TRIG'}
                      {cat === 'squares' && 'x² SQUARES'}
                      {cat === 'roots' && '√x ROOTS'}
                      {cat === 'cubes' && 'x³ CUBES'}
                      {cat === 'percentages' && '% PERCENT'}
                    </Text>
                  </Pressable>
                ))}
              </>
            )}
          </ScrollView>
        </NeoCard>

        {/* 3. Gameplay Card */}
        {question && (
          <NeoCard variant="white" style={styles.questionCard} shadowDistance={4}>
            <View style={styles.questionTagRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {tier.toUpperCase()} • {tier === 'arithmetic' ? arithmeticOp.toUpperCase() : advancedCat.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.questionBox}>
              <Text style={styles.questionFormula}>{question.question}</Text>
            </View>

            {/* Multiple Choice Options */}
            <View style={styles.optionsGrid}>
              {question.options.map((opt, index) => {
                const isSelected = selectedOption === opt;
                const isTheCorrect = isAnswered && String(opt) === String(question.correctAnswer);

                let variant: 'card' | 'mint' | 'softCoral' = 'card';
                if (isAnswered) {
                  if (isTheCorrect) variant = 'mint';
                  else if (isSelected && !isCorrect) variant = 'softCoral';
                }

                return (
                  <NeoButton
                    key={`${question.id}_${index}`}
                    variant={variant}
                    onPress={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    style={styles.optionButton}
                    textStyle={styles.optionText}
                    title={String(opt)}
                  />
                );
              })}
            </View>

            {/* Answer Feedback & Next Button */}
            {isAnswered && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>{feedbackMsg}</Text>
                {question.explanation && (
                  <Text style={styles.explanationText}>{question.explanation}</Text>
                )}
                <NeoButton
                  title="NEXT QUESTION ➔"
                  variant="butterYellow"
                  size="md"
                  onPress={loadNextQuestion}
                  style={styles.nextButton}
                />
              </View>
            )}
          </NeoCard>
        )}

        {/* 4. Monetization Banner */}
        <NeoAdBanner variant="peach" />
      </ScrollView>

      {/* 4. Built-in Pastel Calculator Modal */}
      <Modal
        visible={calcVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCalcVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <NeoCard variant="peach" style={styles.calcCard}>
            <View style={styles.calcHeader}>
              <Text style={styles.calcTitle}>🧮 SCRATCHPAD CALC</Text>
              <Pressable
                onPress={() => setCalcVisible(false)}
                style={styles.calcCloseBtn}
              >
                <Text style={styles.calcCloseText}>✕</Text>
              </Pressable>
            </View>

            {/* Screen */}
            <View style={styles.calcScreen}>
              <Text style={styles.calcExprText}>{calcExpr || '0'}</Text>
              <Text style={styles.calcResultText}>{calcResult ? `= ${calcResult}` : ''}</Text>
            </View>

            {/* Keypad */}
            <View style={styles.calcKeypad}>
              {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((key) => (
                <Pressable
                  key={key}
                  style={({ pressed }) => [
                    styles.calcKey,
                    pressed && styles.calcKeyPressed,
                  ]}
                  onPress={() => handleCalcPress(key)}
                >
                  <Text style={styles.calcKeyText}>{key}</Text>
                </Pressable>
              ))}
            </View>
          </NeoCard>
        </View>
      </Modal>

      {/* 5. Level Up Celebration Modal */}
      <LevelUpModal
        visible={levelUpVisible}
        level={newLevelReached}
        onDismiss={() => setLevelUpVisible(false)}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  appTitle: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: Palette.text,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Palette.textMuted,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  statLabel: {
    fontFamily: Typography.badge,
    fontSize: 10,
    color: Palette.textMuted,
    fontWeight: '700',
  },
  statValue: {
    fontFamily: Typography.display,
    fontSize: 15,
    color: Palette.text,
    marginTop: 2,
  },
  selectorCard: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  tierToggleRow: {
    flexDirection: 'row',
    backgroundColor: Palette.background,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Palette.border,
    padding: 3,
    gap: 4,
  },
  tierButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.sm - 2,
  },
  tierButtonActive: {
    backgroundColor: Palette.butterYellow,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  tierButtonText: {
    fontFamily: Typography.badge,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.text,
  },
  subCategoryRow: {
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  subBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  subBadgeActive: {
    backgroundColor: Palette.mint,
    borderWidth: 2,
  },
  subBadgeText: {
    fontFamily: Typography.badge,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.text,
  },
  questionCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  questionTagRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categoryBadge: {
    backgroundColor: Palette.lavender,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  categoryBadgeText: {
    fontFamily: Typography.badge,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.text,
  },
  questionBox: {
    backgroundColor: Palette.background,
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionFormula: {
    fontFamily: Typography.display,
    fontSize: 32,
    color: Palette.text,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    minHeight: 56,
  },
  optionText: {
    fontFamily: Typography.display,
    fontSize: 22,
  },
  feedbackContainer: {
    marginTop: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  feedbackText: {
    fontFamily: Typography.badge,
    fontSize: 16,
    fontWeight: '800',
    color: Palette.text,
  },
  explanationText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Palette.textMuted,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: Spacing.sm,
    alignSelf: 'stretch',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.4)',
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  calcCard: {
    width: '100%',
    maxHeight: '80%',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  calcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcTitle: {
    fontFamily: Typography.display,
    fontSize: 18,
    color: Palette.text,
  },
  calcCloseBtn: {
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Palette.white,
  },
  calcCloseText: {
    fontWeight: '800',
    fontSize: 14,
  },
  calcScreen: {
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  calcExprText: {
    fontFamily: Typography.sans,
    fontSize: 18,
    color: Palette.textMuted,
  },
  calcResultText: {
    fontFamily: Typography.display,
    fontSize: 24,
    color: Palette.text,
  },
  calcKeypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  calcKey: {
    width: '22%',
    height: 48,
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...NeoStyles.badge,
  },
  calcKeyText: {
    fontFamily: Typography.badge,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  calcKeyPressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    elevation: 1,
  },
});
