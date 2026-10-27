import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  PressableProps,
  GestureResponderEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette, BorderRadius, Typography } from '@/constants/theme';

export type NeoButtonVariant =
  | 'mint'
  | 'peach'
  | 'butterYellow'
  | 'softCoral'
  | 'lavender'
  | 'white'
  | 'card';

export interface NeoButtonProps extends Omit<PressableProps, 'style'> {
  title?: string;
  children?: React.ReactNode;
  variant?: NeoButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  shadowDistance?: number;
  haptic?: boolean | 'light' | 'medium' | 'heavy';
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  title,
  children,
  variant = 'butterYellow',
  size = 'md',
  disabled = false,
  style,
  textStyle,
  shadowDistance = 3,
  haptic = 'light',
  onPress,
  ...pressableProps
}) => {
  const backgroundColor = Palette[variant] ?? Palette.butterYellow;

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 14 },
    md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16 },
    lg: { paddingVertical: 16, paddingHorizontal: 26, fontSize: 18 },
  }[size];

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    if (haptic !== false) {
      try {
        const impactStyle =
          haptic === 'medium'
            ? Haptics.ImpactFeedbackStyle.Medium
            : haptic === 'heavy'
            ? Haptics.ImpactFeedbackStyle.Heavy
            : Haptics.ImpactFeedbackStyle.Light;
        Haptics.impactAsync(impactStyle).catch(() => {});
      } catch {
        // Graceful fallback on web or unsupported devices
      }
    }
    onPress?.(e);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          shadowOffset: pressed
            ? { width: 1, height: 1 }
            : { width: shadowDistance, height: shadowDistance },
          transform: pressed
            ? [{ translateX: shadowDistance - 1 }, { translateY: shadowDistance - 1 }]
            : [{ translateX: 0 }, { translateY: 0 }],
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      {...pressableProps}
    >
      {children ? (
        children
      ) : (
        <Text
          style={[
            styles.defaultText,
            { fontSize: sizeStyles.fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.border,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  defaultText: {
    color: Palette.text,
    fontFamily: Typography.badge,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default NeoButton;
