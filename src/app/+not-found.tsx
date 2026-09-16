import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import { colors, spacing } from '@/theme/colors'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado', headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.text}>Esta tela não existe.</Text>
        <Link href="/" style={styles.link}>
          Voltar para o início
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  text: { fontSize: 16, color: colors.text },
  link: { fontSize: 16, fontWeight: '600', color: colors.navy },
})
