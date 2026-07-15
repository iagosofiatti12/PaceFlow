# CLAUDE.md — Guia para agentes e novos desenvolvedores

Este arquivo define como qualquer IA ou pessoa deve trabalhar neste repositório.

## O que é o app

**PaceFlow** é uma calculadora de pace para corredores (React Native + Expo). Quatro abas:

- **Pace**: distância + tempo → ritmo em min/km, com feedback (elite/avançado/etc.) e gravação no histórico
- **Tempo**: distância + pace → tempo total estimado
- **Tabela**: gera tabela km a km com tempos parciais e acumulados
- **Histórico**: últimos 10 cálculos de pace, persistidos no aparelho; tocar num item restaura o cálculo na aba Pace

Público: corredores amadores brasileiros. Todo texto de UI é em **português brasileiro**.

## Stack

- **Expo SDK 54** (managed workflow — as pastas `/android` e `/ios` são geradas, nunca editadas ou commitadas)
- **React Native 0.81 + React 19 + TypeScript estrito**
- **AsyncStorage** (`@react-native-async-storage/async-storage`) para o histórico
- **Fontes**: Geist Sans e Geist Mono via `@expo-google-fonts/*`, carregadas com `useFonts` no `App.tsx`
- **Lint**: ESLint 9 flat config (`eslint.config.js`) com `eslint-config-expo` + `eslint-config-prettier`
- **Testes**: Jest com preset `jest-expo`; testes em `src/**/__tests__/*.test.ts`
- **Hooks de git**: Husky + lint-staged (ESLint + Prettier nos arquivos staged)
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) — lint, typecheck, format:check e testes

## Arquitetura

```
App.tsx                    → raiz: aba ativa, animação de fade, item restaurado do histórico
src/components/            → um componente por aba (cada um gerencia o PRÓPRIO estado)
src/components/ui/         → componentes reutilizáveis: Card, InputField, Button, ButtonRow, ResultCard
src/constants/theme.ts     → TODOS os tokens: COLORS, SPACING, RADIUS, FONT_SIZES, FONTS
src/types.ts               → tipos compartilhados (TabKey, PaceFeedback)
src/utils/paceHelpers.ts   → cálculos, validações e máscaras (funções puras, todas testadas)
src/utils/storage.ts       → persistência do histórico (AsyncStorage)
src/utils/feedback.ts      → vibração + alerta padrão de validação
```

Padrões estabelecidos:

- **Estado local**: cada aba é dona do próprio estado. O `App.tsx` só conhece a aba ativa e o `restoredItem` (que preenche o `PaceCalculator` via prop `initialItem` + `key`). Não recriar estado global.
- **Lógica pura em `utils/`**: componentes não fazem cálculo; chamam funções de `paceHelpers.ts`. Toda função nova em `utils/` nasce com teste.
- **Fluxo de validação**: validar com helpers → em erro, `showValidationError(mensagem)` → em sucesso, `notifySuccess()`.

## Convenções de código

- Nomes de componentes em PascalCase, um componente por arquivo, `export default` no fim
- Funções auxiliares em camelCase, arrow functions com tipos explícitos de retorno
- Comentários e textos de UI em português brasileiro
- **Nunca hardcodar cores, espaçamentos ou fontes** — sempre importar de `src/constants/theme.ts`
- Números na UI usam `fontFamily: FONTS.mono` (ou `monoSemiBold`) com `fontVariant: ['tabular-nums']`
- Todo elemento interativo tem `accessibilityLabel`, `accessibilityRole` e, quando útil, `accessibilityHint`
- Estilos com `StyleSheet.create`, chaves em ordem alfabética (o lint avisa)
- Formatação é do Prettier (config em `.prettierrc`) — não discutir estilo manualmente

## Regras obrigatórias

1. **Nunca commitar direto na `main`.** Toda mudança nasce numa branch descritiva (`fix/...`, `feat/...`, `refactor/...`, `chore/...`, `design/...`, `docs/...`, `test/...`).
2. **Commits saem apenas com a autoria do dono do repositório.** Não adicionar `Co-Authored-By` nem qualquer assinatura de IA nas mensagens.
3. **Nunca usar `git add -A` ou `git add .`** — adicionar arquivos explicitamente, para não arrastar trabalho não relacionado do dono do repo.
4. **Antes de mexer em qualquer estilo/layout/cor, ler o arquivo `design_audit`** na raiz — é a fonte da verdade das decisões visuais.
5. **Consultar documentação atualizada (Context7 ou docs oficiais) antes de usar API de biblioteca** — não confiar só em conhecimento de treinamento para versões do Expo/RN.
6. **Mensagens de commit em português**, no formato `tipo: descrição` (ex: `fix: ...`, `refactor: ...`).
7. O dono do projeto é iniciante (~2 meses de dev): **explicar cada decisão técnica de forma didática**, com analogias quando ajudar.

## Como rodar, buildar e testar

```bash
npm install          # instala dependências (o Husky se configura sozinho via prepare)
npm start            # servidor Expo (testar com Expo Go no celular)
npm run android      # abre no emulador Android (requer Android Studio) ou dispositivo
npm test             # roda a suíte de testes (Jest)
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run format:check # verifica formatação sem alterar
```

Antes de encerrar qualquer tarefa que toque código: `npm run lint && npm run typecheck && npm test` devem passar. O CI roda exatamente isso (mais `format:check`).

Build de produção/publicação: via **EAS (Expo Application Services)** — ainda não configurado; quando for configurar, usar `eas build` (não gerar pastas nativas manualmente).

## Decisões técnicas e o porquê

- **Estado local por aba (sem Redux/Context)**: o app é pequeno; estado global era prop drilling desnecessário. As abas desmontam ao trocar (reset natural dos campos).
- **`jest-expo` em vez do preset `react-native`**: mocka os módulos nativos do Expo automaticamente, sem `transformIgnorePatterns` manual.
- **ESLint flat config com `eslint-config-expo`**: caminho oficial do Expo; substituiu 6 plugins instalados à mão.
- **`react-native-safe-area-context`**: o `SafeAreaView` do `react-native` está depreciado.
- **Prettier com `endOfLine: "auto"`**: o desenvolvimento acontece no Windows (CRLF); sem isso o format:check briga com o git.
- **Geist Sans/Mono com `tabular-nums`**: decisão do `design_audit` — números com largura fixa alinham em tabelas e não "dançam" ao digitar.
- **Cores do feedback de pace com `textColor` dinâmico**: fundos claros recebem texto escuro para cumprir contraste WCAG.
- **Id do histórico = timestamp + sufixo aleatório**: `Date.now()` sozinho colidia em cálculos no mesmo milissegundo.
- **Histórico limitado a 10 itens**: mantém o AsyncStorage leve e a lista útil.

## O que NUNCA fazer neste repositório

- Commitar na `main` ou fazer push forçado
- Adicionar assinatura de IA (`Co-Authored-By`, "Generated with...") em commits ou PRs
- Hardcodar cores/tamanhos/fontes fora do `theme.ts`
- Editar ou commitar pastas nativas (`/android`, `/ios`) — são geradas pelo Expo
- Remover validações de entrada ou os feedbacks de acessibilidade
- Rodar `npm audit fix --force` (pode quebrar versões do Expo; tratar vulnerabilidades com atualização consciente)
- Adicionar dependências sem verificar compatibilidade com o Expo (`npx expo install` em vez de `npm install` para libs com código nativo)
- Apagar ou "simplificar" testes para fazer o CI passar
