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

export interface RecordAnswerResult {
  stats: GameStats;
  leveledUp: boolean;
  xpGain: number;
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
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadGameStats().then((loaded) => {
      if (isMounted) {
        setStats(loaded);
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
      if (stats.lastActiveDate === today) {
        // Already active today; streak maintained
        newStreak = Math.max(1, stats.currentStreak);
      } else if (stats.lastActiveDate === yesterday) {
        // Consecutive active day!
        newStreak = stats.currentStreak + 1;
      } else {
        // Missed one or more days; start fresh
        newStreak = 1;
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
   * Clears all progress and resets to initial defaults
   */
  const resetStats = useCallback(async () => {
    await clearGameStats();
    setStats(INITIAL_GAME_STATS);
  }, []);

  return {
    stats,
    loading,
    recordAnswer,
    resetStats,
    refreshStats,
  };
};

export default useGameStats;
