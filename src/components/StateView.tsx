import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/Button'
import { colors, spacing } from '@/theme/colors'

interface StateViewProps {
  loading?: boolean
  error?: string | null
  empty?: string
  onRetry?: () => void
}

/** Carregando / erro / vazio — o trio que toda lista precisa. */
export function StateView({ loading, error, empty, onRetry }: StateViewProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.navy} size="large" />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error ?? empty}</Text>
      {error && onRetry ? <Button title="Tentar novamente" variant="secondary" onPress={onRetry} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  text: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
})
