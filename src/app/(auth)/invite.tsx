import { useQuery } from '@tanstack/react-query'
import { Link, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { getApiErrorMessage } from '@/lib/errors'
import { authApi } from '@/services/auth.api'
import { useAuthStore } from '@/stores/authStore'
import { colors, spacing } from '@/theme/colors'

/**
 * Cadastro via convite (o backend não tem cadastro aberto).
 * Deep link: koin://invite?token=XXXX
 */
export default function InviteScreen() {
  const params = useLocalSearchParams<{ token?: string }>()
  const signIn = useAuthStore((s) => s.signIn)

  const [tokenInput, setTokenInput] = useState(params.token ?? '')
  const [token, setToken] = useState(params.token?.trim() ?? '')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const invite = useQuery({
    queryKey: ['invite', token],
    queryFn: async () => (await authApi.validateInvite(token)).data,
    enabled: token.length > 0,
    retry: false,
  })

  const inviteEmail = invite.data?.is_valid ? invite.data.email : null
  const inviteError = invite.error
    ? getApiErrorMessage(invite.error, 'Convite não encontrado')
    : invite.data && !invite.data.is_valid
      ? 'Este convite não é mais válido'
      : null

  function submitToken() {
    const trimmed = tokenInput.trim()
    setFormError(trimmed ? null : 'Cole o código do convite')
    setToken(trimmed)
  }

  async function register() {
    if (name.trim().length < 2) return setFormError('Informe seu nome')
    if (password.length < 6) return setFormError('A senha deve ter pelo menos 6 caracteres')
    setFormError(null)
    setSubmitting(true)
    try {
      const { data } = await authApi.registerWithInvite(token, name.trim(), password)
      await signIn(data)
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Não foi possível concluir o cadastro'))
    } finally {
      setSubmitting(false)
    }
  }

  const error = formError ?? inviteError

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Criar conta</Text>
          <View style={styles.form}>
            {inviteEmail ? (
              <>
                <Text style={styles.info}>
                  Convite para <Text style={styles.bold}>{inviteEmail}</Text>
                </Text>
                <TextField label="Nome" value={name} onChangeText={setName} autoComplete="name" />
                <TextField
                  label="Senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Button title="Criar conta" onPress={register} loading={submitting} />
              </>
            ) : (
              <>
                <TextField
                  label="Código do convite"
                  value={tokenInput}
                  onChangeText={setTokenInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Cole aqui o código recebido por email"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Button title="Continuar" onPress={submitToken} loading={invite.isFetching} />
              </>
            )}
            <Link href="/login" style={styles.link}>
              Já tenho conta
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
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  title: { fontSize: 28, fontWeight: '700', color: colors.white, textAlign: 'center' },
  form: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.xl, gap: spacing.lg },
  info: { fontSize: 15, color: colors.text },
  bold: { fontWeight: '700' },
  error: { color: colors.expense, fontSize: 14, textAlign: 'center' },
  link: { color: colors.navy, fontSize: 15, fontWeight: '600', textAlign: 'center', padding: spacing.sm },
})
