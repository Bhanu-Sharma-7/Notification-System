import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameStats {
  xp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // Format: YYYY-MM-DD
  totalSolved: number;
  totalCorrect: number;
  totalWrong: number;
  categoryHighScores: Record<string, number>;
}

export const INITIAL_GAME_STATS: GameStats = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: '',
  totalSolved: 0,
  totalCorrect: 0,
  totalWrong: 0,
  categoryHighScores: {},
};

const STORAGE_KEY = '@math_game_stats_v1';

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

// ---------------------------------------------------------------------------
// 💾 Storage CRUD Helpers
// ---------------------------------------------------------------------------

export const loadGameStats = async (): Promise<GameStats> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_GAME_STATS;
    const parsed: Partial<GameStats> = JSON.parse(raw);
    return {
      ...INITIAL_GAME_STATS,
      ...parsed,
      level: calculateLevel(parsed.xp ?? 0),
    };
  } catch (error) {
    console.warn('Failed to load game stats from AsyncStorage:', error);
    return INITIAL_GAME_STATS;
  }
};

export const saveGameStats = async (stats: GameStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save game stats to AsyncStorage:', error);
  }
};

export const clearGameStats = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear game stats:', error);
  }
};
