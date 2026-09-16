import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { TextField } from '@/components/TextField'
import { getApiErrorMessage } from '@/lib/errors'
import { formatDate, parseAmount, toISODate } from '@/lib/format'
import { accountsApi } from '@/services/accounts.api'
import { categoriesApi, transactionsApi } from '@/services/transactions.api'
import { colors, spacing } from '@/theme/colors'
import type { PaymentMethod, TransactionCreate } from '@/types/api'

type Kind = 'expense' | 'income'

// Cartão de crédito fica de fora: exige credit_card_id + fatura (próxima iteração)
const PAYMENT_METHODS: { label: string; value: PaymentMethod }[] = [
  { label: 'Pix', value: 'pix' },
  { label: 'Débito', value: 'debit_card' },
  { label: 'Dinheiro', value: 'cash' },
  { label: 'Boleto', value: 'boleto' },
  { label: 'Transferência', value: 'bank_transfer' },
]

const today = () => toISODate(new Date())
const yesterday = () => toISODate(new Date(Date.now() - 86_400_000))

export default function NewTransactionScreen() {
  const queryClient = useQueryClient()

  const [kind, setKind] = useState<Kind>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today())
  const [accountId, setAccountId] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [error, setError] = useState<string | null>(null)

  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => (await accountsApi.list()).data,
  })
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await categoriesApi.list()).data,
    staleTime: 5 * 60_000,
  })

  // Contas onde faz sentido lançar manualmente
  const accountOptions = useMemo(
    () => (accounts.data ?? []).filter((a) => a.is_active && a.type !== 'credit_card'),
    [accounts.data],
  )
  const categoryOptions = useMemo(
    () => (categories.data ?? []).filter((c) => c.type === kind && !c.parent_id),
    [categories.data, kind],
  )

  // Sem escolha explícita, usa a primeira conta disponível
  const selectedAccountId = accountId ?? accountOptions[0]?.id ?? null

  function changeKind(next: Kind) {
    setKind(next)
    setCategoryId(null)
  }

  const mutation = useMutation({
    mutationFn: (payload: TransactionCreate) => transactionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      router.back()
    },
    onError: (err) => setError(getApiErrorMessage(err, 'Não foi possível salvar a transação')),
  })

  function submit() {
    const value = parseAmount(amount)
    if (!(value > 0)) return setError('Informe um valor válido')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setError('Data no formato AAAA-MM-DD')
    if (!selectedAccountId) return setError('Selecione uma conta')
    setError(null)
    mutation.mutate({
      type: kind,
      amount: value,
      date,
      account_id: selectedAccountId,
      category_id: categoryId,
      description: description.trim() || undefined,
      payment_method: kind === 'expense' ? paymentMethod : null,
    })
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.chips}>
          <Chip label="Despesa" selected={kind === 'expense'} onPress={() => changeKind('expense')} />
          <Chip label="Receita" selected={kind === 'income'} onPress={() => changeKind('income')} />
        </View>

        <TextField
          label="Valor (R$)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0,00"
          style={styles.amount}
        />
        <TextField label="Descrição" value={description} onChangeText={setDescription} placeholder="Ex.: Mercado" />

        <Section title={`Data · ${/^\d{4}-\d{2}-\d{2}$/.test(date) ? formatDate(date) : '—'}`}>
          <Chip label="Hoje" selected={date === today()} onPress={() => setDate(today())} />
          <Chip label="Ontem" selected={date === yesterday()} onPress={() => setDate(yesterday())} />
        </Section>
        <TextField label="Outra data (AAAA-MM-DD)" value={date} onChangeText={setDate} autoCapitalize="none" />

        <Section title="Conta">
          {accountOptions.length ? (
            accountOptions.map((a) => (
              <Chip key={a.id} label={a.name} selected={selectedAccountId === a.id} onPress={() => setAccountId(a.id)} />
            ))
          ) : (
            <Text style={styles.muted}>{accounts.isLoading ? 'Carregando…' : 'Nenhuma conta disponível'}</Text>
          )}
        </Section>

        {kind === 'expense' ? (
          <Section title="Forma de pagamento">
            {PAYMENT_METHODS.map((p) => (
              <Chip
                key={p.value}
                label={p.label}
                selected={paymentMethod === p.value}
                onPress={() => setPaymentMethod(p.value)}
              />
            ))}
          </Section>
        ) : null}

        <Section title="Categoria">
          {categoryOptions.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={categoryId === c.id}
              onPress={() => setCategoryId(categoryId === c.id ? null : c.id)}
            />
          ))}
        </Section>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Salvar" onPress={submit} loading={mutation.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amount: { fontSize: 24, fontWeight: '700' },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: colors.text },
  muted: { fontSize: 14, color: colors.textMuted },
  error: { color: colors.expense, fontSize: 14, textAlign: 'center' },
})
