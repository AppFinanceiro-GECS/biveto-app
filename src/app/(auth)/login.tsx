import { Link } from 'expo-router'
import { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { getApiErrorMessage } from '@/lib/errors'
import { authApi } from '@/services/auth.api'
import { useAuthStore } from '@/stores/authStore'
import { colors, spacing } from '@/theme/colors'

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Informe email e senha')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const { data } = await authApi.login(email.trim().toLowerCase(), password)
      await signIn(data)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Email ou senha inválidos'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image source={require('../../../assets/splash-icon.png')} style={styles.logo} />
            <Text style={styles.brand}>Koin</Text>
            <Text style={styles.tagline}>finanças claras. decisões firmes.</Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="voce@exemplo.com"
            />
            <TextField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Entrar" onPress={handleSubmit} loading={loading} />
            <Link href="/invite" style={styles.link}>
              Recebi um convite
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.xxl },
  header: { alignItems: 'center', gap: spacing.sm },
  logo: { width: 88, height: 88 },
  brand: { fontSize: 32, fontWeight: '700', color: colors.white },
  tagline: { fontSize: 15, color: colors.green },
  form: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.xl, gap: spacing.lg },
  error: { color: colors.expense, fontSize: 14, textAlign: 'center' },
  link: { color: colors.navy, fontSize: 15, fontWeight: '600', textAlign: 'center', padding: spacing.sm },
})
