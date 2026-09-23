# Guia de contribuição

## Fluxo

1. Trabalhe a partir de uma issue (título claro + o que define "pronto").
2. Branch a partir da `main`: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`. A `prod` só recebe promoções (veja abaixo).
3. Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `feat(transactions): editar transação`.
4. Antes do PR: `npm run lint && npm run typecheck` e teste a tela no Expo Go (Android **e** iOS, se tiver acesso).
5. PR contra a `main` com o template preenchido e **print da tela**. 1 aprovação, *squash merge*.

## Branches: `main` e `prod`

- **`main`**: integração. Recebe os PRs de feature com *squash merge* e pode estar instável. Futuramente gera builds `preview` (APK interno).
- **`prod`**: o que vai para as lojas. Só recebe PR `main` → `prod` (título `release: <resumo>`) com *merge commit*, para continuar ancestral da `main`. Futuramente gera builds `production` no EAS.
- **Hotfix:** `fix/...` a partir da `prod`, PR para a `prod` e depois de volta para a `main`.
- O CI roda igual nas duas. Enquanto não há versão estável, a `prod` serve para testar o fluxo de promoção.

## Definition of Done

- [ ] CI verde (gitleaks, lint, typecheck, expo-doctor, export Android/iOS)
- [ ] Testado em dispositivo/emulador, com estados de carregando, erro e vazio
- [ ] Textos em pt-BR; código em inglês
- [ ] Mudou chamada de API? Tipo atualizado em `src/types/api.ts` conforme o schema do [biveto-api](https://github.com/AppFinanceiro-GECS/biveto-api)
- [ ] Tela nova/portada marcada em [docs/PORTING.md](docs/PORTING.md)

## Convenções

- Rotas em `src/app/` (expo-router); lógica reutilizável em `src/components`, `src/lib`, `src/services`.
- Dados do servidor sempre via TanStack Query; Zustand só para estado global de cliente (ex.: sessão).
- Imports com alias `@/` (ex.: `@/components/Button`).
- Estilos com `StyleSheet.create` e tokens de `src/theme/colors.ts`; nada de cor solta.
- Dependências nativas: instale com `npx expo install <pacote>` (garante versão compatível com o SDK), nunca `npm install` direto.
- Nunca commite `.env`, chaves de assinatura (`*.jks`, `*.p8`, `*.p12`) ou `google-services.json` com credenciais.
