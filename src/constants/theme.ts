import { Platform, StyleSheet, ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// 🎨 Pastel Neo-Brutalist Theme Tokens
// ---------------------------------------------------------------------------

export const Palette = {
  // Canvas & Core
  background: '#F5F2EB', // Warm cozy pastel cream canvas
  card: '#FFFFFF', // Pure crisp white surface
  border: '#18181B', // Solid 2.5px Deep Charcoal
  text: '#18181B', // High-contrast charcoal text
  textMuted: '#6B7280', // Secondary muted text
  white: '#FFFFFF',
  black: '#18181B',

  // Tactile Pastel Accents & Shadows
  mint: '#70C1B3',
  peach: '#FFE5D9',
  butterYellow: '#FFE169',
  softCoral: '#FFAAA6',
  lavender: '#E8EAFF',
} as const;

export const Typography = {
  display: 'LuckiestGuy',
  badge: 'Bungee',
  sans: 'System',
} as const;

export const Spacing = {
  // Semantic scales
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Starter template numeric backward-compatibility
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const NeoStyles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.lg,
    shadowColor: Palette.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  } as ViewStyle,

  button: {
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    shadowColor: Palette.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  } as ViewStyle,

  badge: {
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.sm,
    shadowColor: Palette.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  } as ViewStyle,

  buttonPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  } as ViewStyle,
});

// ---------------------------------------------------------------------------
// 🔄 Compatibility Layer for Expo Starter Files
// ---------------------------------------------------------------------------

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.background,
    backgroundElement: Palette.peach,
    backgroundSelected: Palette.mint,
    textSecondary: Palette.textMuted,
  },
  dark: {
    text: '#FFFFFF',
    background: '#18181B',
    backgroundElement: '#27272A',
    backgroundSelected: '#3F3F46',
    textSecondary: '#A1A1AA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export default {
  Palette,
  Typography,
  Spacing,
  BorderRadius,
  NeoStyles,
  Colors,
  Fonts,
};
