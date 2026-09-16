# Porte do web (React/Vite) para o app

O frontend web antigo está no repositório [biveto-fin](https://github.com/AppFinanceiro-GECS/biveto-fin/tree/main/frontend/src/pages), e a lógica de cada tela pode ser consultada lá. Os clientes de API de todos os domínios já foram copiados para `src/services/`.

Como portar uma tela:

1. Leia a página em `frontend/src/pages/<Tela>.tsx` do biveto-fin para entender regras e chamadas.
2. Tipos de resposta: confira o schema no biveto-api (`app/modules/<dominio>/schemas/`) e adicione em `src/types/api.ts`; tipe o método em `src/services/`.
3. Crie a rota em `src/app/(app)/...` usando `useQuery`/`useMutation` e os componentes de `src/components/`.
4. Após mutações, invalide as queries afetadas (`transactions`, `analytics`, `accounts`...).
5. Siga o protótipo/layout do time de UX; não copie Tailwind do web.

| Tela web | Status | Observação |
|---|---|---|
| Login | ✅ | `(auth)/login` |
| Invite | ✅ | `(auth)/invite`, deep link `biveto://invite?token=` |
| Dashboard | ✅ parcial | resumo mensal, maiores gastos, últimas transações; faltam gráficos e insights |
| Transactions | ✅ parcial | lista, busca, filtro por tipo, criação; faltam edição, exclusão, cartão de crédito, parcelas, recorrência, transferência |
| Accounts | ✅ parcial | listagem; faltam criar/editar/ajuste de saldo |
| Settings | ✅ parcial | aba Perfil com logout; faltam troca de senha e preferências |
| ResetPassword | ⬜ | precisa de deep link / universal link a partir do e-mail |
| CreditCards | ⬜ | |
| Invoices | ⬜ | |
| Installments | ⬜ | |
| Upload | ⬜ | usar `expo-document-picker`/`expo-image-picker`; `documentsApi` já aceita `{ uri, name, type }` |
| Receipts | ⬜ | leitura de QR code de cupom: `expo-camera` |
| Budget | ⬜ | |
| Goals | ⬜ | |
| Debts | ⬜ | |
| Recurring | ⬜ | |
| IncomeSources | ⬜ | |
| IncomeSplitRules | ⬜ | |
| BenefitCards | ⬜ | schema zod em `src/schemas/` |
| CashCalendar | ⬜ | |
| Simulators | ⬜ | |
| Insights | ⬜ | |
| WeeklyReview | ⬜ | |
| Chat | ⬜ | |
| Market (grocery) | ⬜ | |
| Automations | ⬜ | |
| Family | ⬜ | |
| HouseholdMigration | ⬜ | |
| Achievements / Challenges | ⬜ | gamificação |
| Onboarding | ⬜ | |
| ApiKeys | ⬜ | provavelmente fica só no painel web/admin |
| admin/* | ⬜ | provavelmente fica fora do app mobile |
| ShareTarget | ❌ | específico de PWA; equivalente nativo é share extension |

Também do web e ainda não portado: notificações (no app, usar `expo-notifications` para push), tema escuro e dicas contextuais (`src/data/financialTips.ts` já está aqui).
