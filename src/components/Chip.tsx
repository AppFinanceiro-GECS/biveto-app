import { Pressable, StyleSheet, Text } from 'react-native'

import { colors, radius, spacing } from '@/theme/colors'

interface ChipProps {
  label: string
  selected?: boolean
  onPress: () => void
}

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: { backgroundColor: colors.navy, borderColor: colors.navy },
  label: { fontSize: 14, color: colors.text },
  labelSelected: { color: colors.white, fontWeight: '600' },
})
