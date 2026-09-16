import Ionicons from '@expo/vector-icons/Ionicons'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StateView } from '@/components/StateView'
import { TransactionRow } from '@/components/TransactionRow'
import { getApiErrorMessage } from '@/lib/errors'
import { formatCurrency, monthLabel } from '@/lib/format'
import { analyticsApi } from '@/services/analytics.api'
import { transactionsApi } from '@/services/transactions.api'
import { useAuthStore } from '@/stores/authStore'
import { colors, radius, spacing } from '@/theme/colors'

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user)
  const now = new Date()
  const [period, setPeriod] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 })

  const summary = useQuery({
    queryKey: ['analytics', 'summary', period.year, period.month],
    queryFn: async () => (await analyticsApi.summary(period.year, period.month)).data,
  })

  const recent = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: async () => (await transactionsApi.list({ limit: 5 })).data.items,
  })

  function shiftMonth(delta: number) {
    setPeriod(({ year, month }) => {
      const d = new Date(year, month - 1 + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() + 1 }
    })
  }

  const refreshing = summary.isRefetching || recent.isRefetching
  const onRefresh = () => {
    summary.refetch()
    recent.refetch()
  }
  const s = summary.data

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {user ? <Text style={styles.greeting}>Olá, {user.name.split(' ')[0]}</Text> : null}

      <View style={styles.monthNav}>
        <Pressable accessibilityLabel="Mês anterior" hitSlop={12} onPress={() => shiftMonth(-1)}>
          <Ionicons name="chevron-back" size={24} color={colors.navy} />
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel(period.year, period.month)}</Text>
        <Pressable accessibilityLabel="Próximo mês" hitSlop={12} onPress={() => shiftMonth(1)}>
          <Ionicons name="chevron-forward" size={24} color={colors.navy} />
        </Pressable>
      </View>

      {summary.isLoading || summary.error ? (
        <StateView
          loading={summary.isLoading}
          error={summary.error ? getApiErrorMessage(summary.error, 'Não foi possível carregar o resumo') : null}
          onRetry={summary.refetch}
        />
      ) : s ? (
        <>
          <Card style={styles.hero}>
            <Text style={styles.heroLabel}>Saldo do mês</Text>
            <Text style={styles.heroValue}>{formatCurrency(s.balance)}</Text>
            <View style={styles.heroRow}>
              <Metric label="Receitas" value={s.total_income} color={colors.green} />
              <Metric label="Despesas" value={s.total_expense} color="#fca5a5" />
            </View>
          </Card>

          <View style={styles.grid}>
            <Card style={styles.gridItem}>
              <Text style={styles.smallLabel}>A pagar</Text>
              <Text style={[styles.smallValue, { color: colors.warning }]}>{formatCurrency(s.pending_total)}</Text>
            </Card>
            <Card style={styles.gridItem}>
              <Text style={styles.smallLabel}>Disponível</Text>
              <Text style={styles.smallValue}>{formatCurrency(s.available_balance)}</Text>
            </Card>
          </View>

          {s.categories.length > 0 ? (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Maiores gastos</Text>
              {s.categories.slice(0, 5).map((c) => (
                <View key={c.category_id ?? c.category_name} style={styles.categoryRow}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{c.category_name}</Text>
                    <Text style={styles.categoryValue}>{formatCurrency(c.total)}</Text>
                  </View>
                  <View style={styles.bar}>
                    <View style={[styles.barFill, { width: `${Math.min(c.percentage, 100)}%` }]} />
                  </View>
                </View>
              ))}
            </Card>
          ) : null}
        </>
      ) : null}

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas transações</Text>
          <Pressable onPress={() => router.push('/transactions')}>
            <Text style={styles.link}>Ver todas</Text>
          </Pressable>
        </View>
        {recent.data?.length ? (
          recent.data.map((t) => <TransactionRow key={t.id} transaction={t} />)
        ) : (
          <StateView loading={recent.isLoading} empty="Nenhuma transação ainda" />
        )}
      </Card>

      <Button title="Nova transação" onPress={() => router.push('/transaction/new')} />
    </ScrollView>
  )
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.heroLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{formatCurrency(value)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  greeting: { fontSize: 22, fontWeight: '700', color: colors.text },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthLabel: { fontSize: 17, fontWeight: '600', color: colors.navy },
  hero: { backgroundColor: colors.navy, borderColor: colors.navy, gap: spacing.sm },
  heroLabel: { fontSize: 13, color: '#bcccdc' },
  heroValue: { fontSize: 32, fontWeight: '700', color: colors.white },
  heroRow: { flexDirection: 'row', marginTop: spacing.sm },
  metric: { flex: 1, gap: 2 },
  metricValue: { fontSize: 17, fontWeight: '600' },
  grid: { flexDirection: 'row', gap: spacing.md },
  gridItem: { flex: 1, gap: spacing.xs },
  smallLabel: { fontSize: 13, color: colors.textMuted },
  smallValue: { fontSize: 18, fontWeight: '700', color: colors.text },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  link: { fontSize: 14, fontWeight: '600', color: colors.navy },
  categoryRow: { gap: spacing.xs, paddingVertical: spacing.xs },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryName: { fontSize: 14, color: colors.text },
  categoryValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  bar: { height: 6, borderRadius: radius.pill, backgroundColor: colors.background, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.greenDark },
})
