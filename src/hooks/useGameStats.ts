import { useState, useEffect, useCallback } from 'react';
import {
  GameStats,
  INITIAL_GAME_STATS,
  loadGameStats,
  saveGameStats,
  clearGameStats,
  getTodayDateString,
  getYesterdayDateString,
  calculateLevel,
} from '@/utils/storage';
import { soundController } from '@/utils/audio';

export interface RecordAnswerResult {
  stats: GameStats;
  leveledUp: boolean;
  xpGain: number;
  newLevel: number;
}

export interface BlitzSessionResult {
  stats: GameStats;
  isNewHighScore: boolean;
  leveledUp: boolean;
  newLevel: number;
}

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>(INITIAL_GAME_STATS);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and load saved stats on mount
  const refreshStats = useCallback(async () => {
    setLoading(true);
    const loaded = await loadGameStats();
    setStats(loaded);
    soundController.setSoundEnabled(loaded.soundEnabled);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadGameStats().then((loaded) => {
      if (isMounted) {
        setStats(loaded);
        soundController.setSoundEnabled(loaded.soundEnabled);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Records an answer attempt, calculates streak, XP, level, and updates offline storage
   */
  const recordAnswer = useCallback(
    async (category: string, isCorrect: boolean): Promise<RecordAnswerResult> => {
      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      let newStreak = stats.currentStreak;

      // Handle daily streaks
      if (isCorrect) {
        if (stats.lastActiveDate === today) {
          newStreak = Math.max(1, stats.currentStreak);
        } else if (stats.lastActiveDate === yesterday) {
          newStreak = stats.currentStreak + 1;
        } else {
          newStreak = 1;
        }
      }

      const bestStreak = Math.max(stats.bestStreak, newStreak);
      const xpGain = isCorrect ? 10 + Math.min(newStreak, 5) * 2 : 0;
      const newXp = stats.xp + xpGain;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > stats.level;

      const currentCategoryScore = stats.categoryHighScores[category] ?? 0;
      const newCategoryScore = isCorrect ? currentCategoryScore + 1 : currentCategoryScore;

      const updatedStats: GameStats = {
        ...stats,
        xp: newXp,
        level: newLevel,
        currentStreak: newStreak,
        bestStreak,
        lastActiveDate: today,
        totalSolved: stats.totalSolved + 1,
        totalCorrect: isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect,
        totalWrong: isCorrect ? stats.totalWrong : stats.totalWrong + 1,
        categoryHighScores: {
          ...stats.categoryHighScores,
          [category]: newCategoryScore,
        },
      };

      setStats(updatedStats);
      await saveGameStats(updatedStats);
      return {
        stats: updatedStats,
        leveledUp,
        xpGain,
        newLevel,
      };
    },
    [stats]
  );

  /**
   * Deducts 1 50-50 power-up from inventory if available
   */
  const consumeFiftyFifty = useCallback(async (): Promise<boolean> => {
    if (stats.powerUps.fiftyFifty <= 0) return false;

    const updatedStats: GameStats = {
      ...stats,
      powerUps: {
        ...stats.powerUps,
        fiftyFifty: stats.powerUps.fiftyFifty - 1,
      },
    };
    setStats(updatedStats);
    await saveGameStats(updatedStats);
    return true;
  }, [stats]);

  /**
   * Consumes 1 streak freeze shield
   */
  const consumeStreakFreeze = useCallback(async (): Promise<boolean> => {
    if (stats.powerUps.streakFreeze <= 0) return false;

    const updatedStats: GameStats = {
      ...stats,
      powerUps: {
        ...stats.powerUps,
        streakFreeze: stats.powerUps.streakFreeze - 1,
      },
    };
    setStats(updatedStats);
    await saveGameStats(updatedStats);
    return true;
  }, [stats]);

  /**
   * Saves Blitz mode session score, awards bonus XP, and tracks high scores
   */
  const recordBlitzResult = useCallback(
    async (score: number, bonusXp: number): Promise<BlitzSessionResult> => {
      const isNewHighScore = score > stats.blitzHighScore;
      const newHighScore = Math.max(stats.blitzHighScore, score);
      const newXp = stats.xp + bonusXp;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > stats.level;

      const updatedStats: GameStats = {
        ...stats,
        xp: newXp,
        level: newLevel,
        blitzHighScore: newHighScore,
      };

      setStats(updatedStats);
      await saveGameStats(updatedStats);
      return {
        stats: updatedStats,
        isNewHighScore,
        leveledUp,
        newLevel,
      };
    },
    [stats]
  );

  /**
   * Toggles global sound state
   */
  const toggleSound = useCallback(async (): Promise<boolean> => {
    const nextState = !stats.soundEnabled;
    soundController.setSoundEnabled(nextState);
    const updatedStats: GameStats = {
      ...stats,
      soundEnabled: nextState,
    };
    setStats(updatedStats);
    await saveGameStats(updatedStats);
    return nextState;
  }, [stats]);

  /**
   * Clears all progress and resets to initial defaults
   */
  const resetStats = useCallback(async () => {
    await clearGameStats();
    setStats(INITIAL_GAME_STATS);
    soundController.setSoundEnabled(true);
  }, []);

  return {
    stats,
    loading,
    recordAnswer,
    consumeFiftyFifty,
    consumeStreakFreeze,
    recordBlitzResult,
    toggleSound,
    resetStats,
    refreshStats,
  };
};

export default useGameStats;
