import { StyleSheet, Text, View } from 'react-native'

import { formatCurrency, formatDate } from '@/lib/format'
import { colors, spacing } from '@/theme/colors'
import type { Transaction } from '@/types/api'

export function TransactionRow({ transaction: t }: { transaction: Transaction }) {
  const isIncome = t.type === 'income' || t.is_transfer_in
  const title = t.description || t.merchant_name || t.category_name || 'Sem descrição'
  const installment = t.installment_total ? ` · ${t.installment_number}/${t.installment_total}` : ''
  const subtitle = [t.category_name, t.credit_card_name ?? t.account_name].filter(Boolean).join(' · ')

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
          {installment}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {formatDate(t.date)}
          {subtitle ? ` · ${subtitle}` : ''}
          {!t.is_paid ? ' · pendente' : ''}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '500', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted },
  amount: { fontSize: 15, fontWeight: '600' },
})
