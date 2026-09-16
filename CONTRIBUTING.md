# Guia de contribuição

## Fluxo

1. Trabalhe a partir de uma issue (título claro + o que define "pronto").
2. Branch a partir da `main`: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
3. Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `feat(transactions): editar transação`.
4. Antes do PR: `npm run lint && npm run typecheck` e teste a tela no Expo Go (Android **e** iOS, se tiver acesso).
5. PR contra a `main` com o template preenchido e **print da tela**. 1 aprovação, *squash merge*.

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
