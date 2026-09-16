import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { API_URL, APP_VERSION } from '@/lib/config'
import { useAuthStore } from '@/stores/authStore'
import { colors, spacing } from '@/theme/colors'

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  function confirmSignOut() {
    if (Platform.OS === 'web') {
      signOut()
      return
    }
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ])
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.name}>{user?.name ?? '—'}</Text>
        <Text style={styles.muted}>{user?.email}</Text>
      </Card>

      <Card style={styles.card}>
        <Row label="Versão do app" value={APP_VERSION} />
        <Row label="Servidor" value={API_URL} />
      </Card>

      <Button title="Sair" variant="danger" onPress={confirmSignOut} />
    </ScrollView>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg },
  card: { gap: spacing.sm },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  muted: { fontSize: 14, color: colors.textMuted },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg },
  value: { flexShrink: 1, fontSize: 14, color: colors.text },
})
