import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import { Palette, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { NeoCard, NeoCardVariant } from '@/components/ui/NeoCard';

export interface NeoAdBannerProps {
  variant?: NeoCardVariant;
  style?: StyleProp<ViewStyle>;
  onAdPress?: () => void;
  title?: string;
  tagline?: string;
  ctaText?: string;
}

export const NeoAdBanner: React.FC<NeoAdBannerProps> = ({
  variant = 'peach',
  style,
  onAdPress,
  title = '⚡ MATH CRUSH PRO',
  tagline = 'Support offline learning • Unlock custom arenas',
  ctaText = 'EXPLORE',
}) => {
  return (
    <NeoCard
      variant={variant}
      style={[styles.container, style]}
      shadowDistance={3}
    >
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <View style={styles.adBadgeRow}>
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>SPONSORED</Text>
            </View>
          </View>
          <Text style={styles.adTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.adTagline} numberOfLines={1}>
            {tagline}
          </Text>
        </View>

        <Pressable
          onPress={onAdPress}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <Text style={styles.ctaText}>{ctaText}</Text>
        </Pressable>
      </View>
    </NeoCard>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  adBadgeRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  adBadge: {
    backgroundColor: Palette.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adBadgeText: {
    fontFamily: Typography.badge,
    fontSize: 8,
    color: Palette.white,
    letterSpacing: 0.5,
  },
  adTitle: {
    fontFamily: Typography.badge,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.text,
  },
  adTagline: {
    fontFamily: Typography.sans,
    fontSize: 10,
    color: Palette.textMuted,
    fontWeight: '600',
  },
  ctaButton: {
    backgroundColor: Palette.butterYellow,
    borderWidth: 2,
    borderColor: Palette.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: Palette.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  ctaButtonPressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  },
  ctaText: {
    fontFamily: Typography.badge,
    fontSize: 10,
    fontWeight: '800',
    color: Palette.text,
  },
});

export default NeoAdBanner;
