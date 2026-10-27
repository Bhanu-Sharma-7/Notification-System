import React, { useState, useEffect, useRef } from 'react';
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
import { BlitzTimerBar } from '@/components/game/BlitzTimerBar';
import { BlitzSummaryModal } from '@/components/game/BlitzSummaryModal';
import {
  generateArithmeticQuestion,
  generateAdvancedQuestion,
  MathQuestion,
  OperationType,
  AdvancedCategory,
} from '@/utils/mathEngine';
import { useGameStats } from '@/hooks/useGameStats';
import { soundController } from '@/utils/audio';

export default function HomeScreen() {
  const {
    stats,
    recordAnswer,
    consumeFiftyFifty,
    recordBlitzResult,
    toggleSound,
  } = useGameStats();

  // Mode and Category selection
  const [gameMode, setGameMode] = useState<'classic' | 'blitz'>('classic');
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

  // Power-up state
  const [eliminatedOptions, setEliminatedOptions] = useState<(string | number)[]>([]);

  // Celebration state
  const [levelUpVisible, setLevelUpVisible] = useState<boolean>(false);
  const [newLevelReached, setNewLevelReached] = useState<number>(1);

  // Blitz mode state
  const [blitzActive, setBlitzActive] = useState<boolean>(false);
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState<number>(60);
  const [blitzScore, setBlitzScore] = useState<number>(0);
  const [blitzCorrectCount, setBlitzCorrectCount] = useState<number>(0);
  const [blitzTotalAnswered, setBlitzTotalAnswered] = useState<number>(0);
  const [blitzSummaryVisible, setBlitzSummaryVisible] = useState<boolean>(false);
  const [blitzNewHighScore, setBlitzNewHighScore] = useState<boolean>(false);
  const [blitzBonusXp, setBlitzBonusXp] = useState<number>(0);

  // Built-in Pastel Calculator Modal State
  const [calcVisible, setCalcVisible] = useState<boolean>(false);
  const [calcExpr, setCalcExpr] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');

  const nextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetQuestionState = (newQ: MathQuestion) => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setFeedbackMsg('');
    setEliminatedOptions([]);
    setQuestion(newQ);
  };

  const handleSelectTier = (newTier: 'arithmetic' | 'advanced') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      soundController.playTap();
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
      soundController.playTap();
    } catch {}
    setArithmeticOp(op);
    resetQuestionState(generateArithmeticQuestion({ operation: op, digits: 2 }));
  };

  const handleSelectAdvancedCat = (cat: AdvancedCategory) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      soundController.playTap();
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
        soundController.playSuccess();
      } catch {}
      setFeedbackMsg(`🎯 AWESOME! +${result.xpGain} XP`);

      if (gameMode === 'blitz' && blitzActive) {
        setBlitzScore((prev) => prev + 100 + Math.min(stats.currentStreak, 5) * 10);
        setBlitzCorrectCount((prev) => prev + 1);
        setBlitzTotalAnswered((prev) => prev + 1);

        // In blitz mode, auto-advance on correct answers after a brief pause
        if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
        nextTimeoutRef.current = setTimeout(() => {
          loadNextQuestion();
        }, 400);
      }

      if (result.leveledUp) {
        setNewLevelReached(result.newLevel);
        setTimeout(() => setLevelUpVisible(true), 350);
      }
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        soundController.playError();
      } catch {}
      setFeedbackMsg(`❌ Oops! Answer is ${question.correctAnswer}`);

      if (gameMode === 'blitz' && blitzActive) {
        setBlitzTotalAnswered((prev) => prev + 1);
      }
    }
  };

  // 50-50 Power-Up Handler
  const handleUseFiftyFifty = async () => {
    if (!question || eliminatedOptions.length > 0 || stats.powerUps.fiftyFifty <= 0 || isAnswered) {
      return;
    }
    const success = await consumeFiftyFifty();
    if (!success) return;

    soundController.playTap();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}

    const wrongOptions = question.options.filter(
      (opt) => String(opt) !== String(question.correctAnswer)
    );
    const toEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  // Blitz Mode Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (gameMode === 'blitz' && blitzActive && blitzSecondsLeft > 0) {
      timer = setInterval(() => {
        setBlitzSecondsLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          if (prev <= 6) {
            soundController.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameMode, blitzActive, blitzSecondsLeft]);

  // Handle Blitz completion when time hits 0
  useEffect(() => {
    if (gameMode === 'blitz' && blitzActive && blitzSecondsLeft === 0) {
      const finalizeBlitz = async () => {
        setBlitzActive(false);
        const bonusXp = Math.round(blitzScore * 0.15) + (blitzCorrectCount * 5);
        setBlitzBonusXp(bonusXp);
        const res = await recordBlitzResult(blitzScore, bonusXp);
        setBlitzNewHighScore(res.isNewHighScore);
        setBlitzSummaryVisible(true);
      };
      finalizeBlitz();
    }
  }, [gameMode, blitzActive, blitzSecondsLeft, blitzScore, blitzCorrectCount, recordBlitzResult]);

  const startBlitzSession = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      soundController.playTap();
    } catch {}
    setBlitzSecondsLeft(60);
    setBlitzScore(0);
    setBlitzCorrectCount(0);
    setBlitzTotalAnswered(0);
    setBlitzSummaryVisible(false);
    setBlitzActive(true);
    setEliminatedOptions([]);
    loadNextQuestion();
  };

  // Calculator logic
  const handleCalcPress = (val: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      soundController.playTap();
    } catch {}
    if (val === 'C') {
      setCalcExpr('');
      setCalcResult('');
    } else if (val === '=') {
      try {
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
        {/* 1. Header & Utility Controls */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appTitle}>MATH CRUSH</Text>
            <Text style={styles.appSubtitle}>Neo-Brutalist Mental Arena</Text>
          </View>

          <View style={styles.headerControls}>
            <NeoButton
              variant={stats.soundEnabled ? 'mint' : 'card'}
              size="sm"
              onPress={toggleSound}
              title={stats.soundEnabled ? '🔊 ON' : '🔇 OFF'}
              style={styles.utilityBtn}
            />
            <NeoButton
              variant="butterYellow"
              size="sm"
              onPress={() => {
                soundController.playTap();
                setCalcVisible(true);
              }}
              title="🧮 CALC"
              style={styles.utilityBtn}
            />
          </View>
        </View>

        {/* 2. Game Mode Selector: Classic vs Blitz */}
        <View style={styles.modeToggleRow}>
          <Pressable
            style={({ pressed }) => [
              styles.modeButton,
              gameMode === 'classic' && styles.modeButtonActive,
              pressed && styles.pressedShift,
            ]}
            onPress={() => {
              soundController.playTap();
              setGameMode('classic');
              setBlitzActive(false);
            }}
          >
            <Text style={styles.modeButtonText}>🎮 CLASSIC PRACTICE</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.modeButton,
              gameMode === 'blitz' && styles.modeButtonBlitzActive,
              pressed && styles.pressedShift,
            ]}
            onPress={() => {
              soundController.playTap();
              setGameMode('blitz');
            }}
          >
            <Text style={styles.modeButtonText}>⚡ 60s BLITZ</Text>
          </Pressable>
        </View>

        {/* Blitz Mode Banner / Timer */}
        {gameMode === 'blitz' && (
          <>
            {blitzActive ? (
              <BlitzTimerBar
                secondsLeft={blitzSecondsLeft}
                totalSeconds={60}
                score={blitzScore}
              />
            ) : (
              <NeoCard variant="butterYellow" style={styles.blitzBannerCard}>
                <View style={styles.blitzBannerHeader}>
                  <Text style={styles.blitzBannerTitle}>⚡ 60-SECOND SPEEDRUN</Text>
                  <Text style={styles.blitzHighScoreText}>
                    RECORD: {stats.blitzHighScore} PTS
                  </Text>
                </View>
                <Text style={styles.blitzBannerDesc}>
                  Solve as many calculations as possible in 1 minute. Earn speed multipliers and bonus XP!
                </Text>
                <NeoButton
                  variant="mint"
                  size="lg"
                  title="START 60s RUN ➔"
                  onPress={startBlitzSession}
                  style={styles.startBlitzBtn}
                />
              </NeoCard>
            )}
          </>
        )}

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

        {/* Power-ups Inventory Bar */}
        <View style={styles.powerUpsRow}>
          <Pressable
            disabled={stats.powerUps.fiftyFifty <= 0 || eliminatedOptions.length > 0 || isAnswered}
            style={({ pressed }) => [
              styles.powerUpPill,
              { backgroundColor: Palette.peach },
              (stats.powerUps.fiftyFifty <= 0 || eliminatedOptions.length > 0) && styles.powerUpDisabled,
              pressed && styles.pressedShift,
            ]}
            onPress={handleUseFiftyFifty}
          >
            <Text style={styles.powerUpText}>
              🎯 50-50 ({stats.powerUps.fiftyFifty})
            </Text>
          </Pressable>

          <View style={[styles.powerUpPill, { backgroundColor: Palette.butterYellow }]}>
            <Text style={styles.powerUpText}>
              🛡️ SHIELD ({stats.powerUps.streakFreeze})
            </Text>
          </View>
        </View>

        {/* 3. Tier & Category Selector */}
        <NeoCard variant="card" style={styles.selectorCard}>
          <View style={styles.tierToggleRow}>
            <Pressable
              style={({ pressed }) => [
                styles.tierButton,
                tier === 'arithmetic' && styles.tierButtonActive,
                pressed && styles.pressedShift,
              ]}
              onPress={() => handleSelectTier('arithmetic')}
            >
              <Text style={styles.tierButtonText}>ARITHMETIC</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.tierButton,
                tier === 'advanced' && styles.tierButtonActive,
                pressed && styles.pressedShift,
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
                    style={({ pressed }) => [
                      styles.subBadge,
                      arithmeticOp === op && styles.subBadgeActive,
                      pressed && styles.pressedShift,
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
                    style={({ pressed }) => [
                      styles.subBadge,
                      advancedCat === cat && styles.subBadgeActive,
                      pressed && styles.pressedShift,
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

        {/* 4. Gameplay Card */}
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
                const isEliminated = eliminatedOptions.includes(opt);

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
                    disabled={isAnswered || isEliminated}
                    style={[styles.optionButton, isEliminated && styles.eliminatedButton]}
                    textStyle={[styles.optionText, isEliminated && styles.eliminatedText]}
                    title={isEliminated ? '✕' : String(opt)}
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

        {/* 5. Monetization Banner */}
        <NeoAdBanner variant="peach" />
      </ScrollView>

      {/* Built-in Pastel Calculator Modal */}
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

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        visible={levelUpVisible}
        level={newLevelReached}
        onDismiss={() => setLevelUpVisible(false)}
      />

      {/* Blitz Session Summary Modal */}
      <BlitzSummaryModal
        visible={blitzSummaryVisible}
        score={blitzScore}
        correctCount={blitzCorrectCount}
        totalAnswered={blitzTotalAnswered}
        bonusXp={blitzBonusXp}
        isNewHighScore={blitzNewHighScore}
        onPlayAgain={startBlitzSession}
        onExit={() => {
          setBlitzSummaryVisible(false);
          setGameMode('classic');
        }}
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
  headerControls: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  utilityBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  appTitle: {
    fontFamily: Typography.display,
    fontSize: 26,
    color: Palette.text,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: '600',
  },
  modeToggleRow: {
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    padding: 3,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  modeButtonActive: {
    backgroundColor: Palette.mint,
    borderWidth: 2,
    borderColor: Palette.border,
  },
  modeButtonBlitzActive: {
    backgroundColor: Palette.butterYellow,
    borderWidth: 2,
    borderColor: Palette.border,
  },
  modeButtonText: {
    fontFamily: Typography.badge,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.text,
  },
  blitzBannerCard: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  blitzBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blitzBannerTitle: {
    fontFamily: Typography.display,
    fontSize: 18,
    color: Palette.text,
  },
  blitzHighScoreText: {
    fontFamily: Typography.badge,
    fontSize: 11,
    fontWeight: '800',
    color: Palette.text,
  },
  blitzBannerDesc: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: Palette.textMuted,
    lineHeight: 16,
  },
  startBlitzBtn: {
    marginTop: Spacing.xs,
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
  powerUpsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  powerUpPill: {
    flex: 1,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
    ...NeoStyles.badge,
  },
  powerUpDisabled: {
    opacity: 0.45,
  },
  powerUpText: {
    fontFamily: Typography.badge,
    fontSize: 11,
    fontWeight: '800',
    color: Palette.text,
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
  eliminatedButton: {
    backgroundColor: '#E4E4E7',
    opacity: 0.4,
  },
  eliminatedText: {
    color: '#A1A1AA',
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
  pressedShift: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
});
