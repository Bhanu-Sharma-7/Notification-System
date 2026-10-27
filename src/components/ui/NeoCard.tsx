import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ViewProps } from 'react-native';
import { Palette, BorderRadius, Spacing } from '@/constants/theme';

export type NeoCardVariant =
  | 'card'
  | 'white'
  | 'mint'
  | 'peach'
  | 'butterYellow'
  | 'softCoral'
  | 'lavender';

export interface NeoCardProps extends ViewProps {
  children?: React.ReactNode;
  variant?: NeoCardVariant;
  padding?: keyof typeof Spacing | number;
  shadowDistance?: number;
  style?: StyleProp<ViewStyle>;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  variant = 'card',
  padding = 'md',
  shadowDistance = 3,
  style,
  ...viewProps
}) => {
  const backgroundColor = Palette[variant] ?? Palette.card;
  const paddingValue = typeof padding === 'number' ? padding : Spacing[padding] ?? Spacing.md;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor,
          padding: paddingValue,
          shadowOffset: { width: shadowDistance, height: shadowDistance },
        },
        style,
      ]}
      {...viewProps}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 2.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.lg,
    shadowColor: Palette.border,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
});

export default NeoCard;
