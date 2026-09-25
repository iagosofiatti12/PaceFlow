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
- **Expo Router 6** para navegação: cada aba é um arquivo em `app/` (rotas por arquivo)
- **AsyncStorage** (`@react-native-async-storage/async-storage`) para o histórico
- **Zod 4** para validar o formato do histórico ao ler do aparelho
- **Fontes**: Geist Sans e Geist Mono via `@expo-google-fonts/*`, carregadas com `useFonts` no `app/_layout.tsx`
- **Lint**: ESLint 9 flat config (`eslint.config.js`) com `eslint-config-expo` + `eslint-config-prettier`
- **Testes**: Jest com preset `jest-expo` + `@testing-library/react-native` (hooks) + `expo-router/testing-library` (navegação); testes em `src/**/__tests__/*.test.ts(x)` — nunca dentro de `app/`, onde todo arquivo vira rota
- **Hooks de git**: Husky + lint-staged (ESLint + Prettier nos arquivos staged)
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) — lint, typecheck, format:check e testes

## Arquitetura

```
app/_layout.tsx            → layout raiz: fontes, área segura, logo e navegador de abas (Tabs)
app/index.tsx              → aba Pace (rota "/"); recebe ?restore=<id> para restaurar um cálculo
app/time.tsx, table.tsx, history.tsx → abas Tempo, Tabela e Histórico (rotas /time, /table, /history)
src/components/            → um componente por aba (cada um gerencia o PRÓPRIO estado) + Header e TabBar
src/components/ui/         → componentes reutilizáveis: Card, ScreenHeader, InputField, TimeInput, Button, ButtonRow, ResultCard, KeyboardScreen
src/constants/theme.ts     → TODOS os tokens: paletas LIGHT_COLORS/DARK_COLORS, PACE_LEVEL_COLORS, SPACING, RADIUS, FONT_SIZES, FONTS, FONT_SCALE
src/constants/messages.ts  → textos das mensagens de validação (um por código de erro)
src/constants/paceLevels.ts→ aparência de cada nível de pace (rótulo, emoji, cores)
src/domain/                → regra de negócio pura, só números: pace, parciais, níveis, limites
src/format/                → texto ↔ número: máscaras de digitação, tempo, distância (vírgula decimal), datas relativas
src/validation/rules.ts    → valida o texto dos campos e devolve o número convertido ou um código de erro
src/hooks/useMaskedField.ts→ estado de um campo com máscara (value, onChangeText, clear)
src/hooks/useTheme.ts      → useColors() e createThemedStyles(): cores do tema claro/escuro
src/utils/storage.ts       → persistência do histórico (AsyncStorage)
src/utils/historySchema.ts → formato do histórico (schema Zod v2) e migração da v1
src/utils/feedback.ts      → vibração + alerta padrão de validação
docs/AUDITORIA.md          → auditoria técnica e roadmap do revamp (fases 0–5)
```

Padrões estabelecidos:

- **Estado local**: cada aba é dona do próprio estado. Não recriar estado global.
- **Navegação pela rota**: para mandar algo de uma aba para outra, use parâmetros de rota. Ex: o Histórico chama `router.navigate({ pathname: '/', params: { restore: id, t } })` e a aba Pace lê com `useLocalSearchParams`. Os arquivos em `app/` são finos: só montam a tela com os componentes de `src/components/`.
- **Abas ficam montadas ao trocar**: os campos não se apagam ao mudar de aba. Tela que mostra dados salvos (Histórico) recarrega com `useFocusEffect`, e não com `useEffect`.
- **Camadas de lógica pura**: componentes não fazem cálculo. `domain/` só trabalha com números (sem texto de tela nem cores), `format/` converte texto ↔ número e `validation/` valida os campos. Toda função nova nessas pastas (e em `hooks/`) nasce com teste; o CI exige cobertura mínima de 90% nelas.
- **Fluxo de validação**: `const r = validateDistance(texto)` → se `!r.valid`, `showValidationError(r.error)` (o código vira texto via `constants/messages.ts`) → se válido, usar `r.value` (já é número) e chamar `notifySuccess()`.
- **Campos com máscara**: `const distance = useMaskedField(formatDistanceInput)` em vez de `useState` + handler manual.

## Convenções de código

- Nomes de componentes em PascalCase, um componente por arquivo, `export default` no fim
- Funções auxiliares em camelCase, arrow functions com tipos explícitos de retorno
- Comentários e textos de UI em português brasileiro
- **Nunca hardcodar cores, espaçamentos ou fontes.** Espaçamentos e fontes vêm de `src/constants/theme.ts`. Cores vêm do tema atual: `const useStyles = createThemedStyles((colors) => ({ ... }))` no lugar de `StyleSheet.create` e, para cores fora do StyleSheet (ex: `color` de ícone), `const colors = useColors()`. Use o token pelo **papel** (`surface`, `accentText`, `text.secondary`), ver DESIGN.md
- Números na UI usam `fontFamily: FONTS.mono` (ou `monoSemiBold`) com `fontVariant: ['tabular-nums']`
- Distância na tela sempre com vírgula decimal: `formatKm(km)`, nunca `km.toString()`; para ler o campo, `parseKm(texto)`
- Texto em elemento de largura fixa (botão, aba, campo, célula, número grande) leva `maxFontSizeMultiplier={FONT_SCALE.control}` (ou `.display`); texto corrido fica sem teto
- Todo elemento interativo tem `accessibilityLabel`, `accessibilityRole` e, quando útil, `accessibilityHint`
- Estilos com `StyleSheet.create`, chaves em ordem alfabética (o lint avisa)
- Formatação é do Prettier (config em `.prettierrc`) — não discutir estilo manualmente

## Regras obrigatórias

1. **Nunca commitar direto na `main`.** Toda mudança nasce numa branch descritiva (`fix/...`, `feat/...`, `refactor/...`, `chore/...`, `design/...`, `docs/...`, `test/...`).
2. **Commits saem apenas com a autoria do dono do repositório.** Não adicionar `Co-Authored-By` nem qualquer assinatura de IA nas mensagens.
3. **Nunca usar `git add -A` ou `git add .`** — adicionar arquivos explicitamente, para não arrastar trabalho não relacionado do dono do repo.
4. **Antes de mexer em qualquer estilo/layout/cor, ler o arquivo `DESIGN.md`** na raiz — é a fonte da verdade das decisões visuais.
5. **Consultar documentação atualizada (Context7 ou docs oficiais) antes de usar API de biblioteca** — não confiar só em conhecimento de treinamento para versões do Expo/RN.
6. **Mensagens de commit em português**, no formato `tipo: descrição` (ex: `fix: ...`, `refactor: ...`).
7. O dono do projeto é iniciante (~2 meses de dev): **explicar cada decisão técnica de forma didática**, com analogias quando ajudar.

## Como rodar, buildar e testar

```bash
npm install          # instala dependências (o Husky se configura sozinho via prepare)
npm start            # servidor Expo (testar com Expo Go no celular)
# ao mexer em app.json/plugins ou trocar de branch com rotas novas: npx expo start --clear
npm run android      # abre no emulador Android (requer Android Studio) ou dispositivo
npm test             # roda a suíte de testes (Jest)
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run format:check # verifica formatação sem alterar
```

Antes de encerrar qualquer tarefa que toque código: `npm run lint && npm run typecheck && npm test` devem passar. O CI roda exatamente isso (mais `format:check`).

Build de produção/publicação: via **EAS (Expo Application Services)** — ainda não configurado; quando for configurar, usar `eas build` (não gerar pastas nativas manualmente).

## Decisões técnicas e o porquê

- **Estado local por aba (sem Redux/Context)**: o app é pequeno; estado global era prop drilling desnecessário.
- **Expo Router com `Tabs` (estável) + `TabBar` próprio**: dá botão voltar do Android, links diretos (`paceflow://history`) e uma tela por arquivo. As abas customizadas de `expo-router/ui` ainda são experimentais, então usamos as `Tabs` estáveis com `tabBarPosition: 'top'` e a nossa barra no `tabBar`, mantendo o visual do DESIGN.md. O fade entre abas é a opção `animation: 'fade'`.
- **`jest-expo` em vez do preset `react-native`**: mocka os módulos nativos do Expo automaticamente, sem `transformIgnorePatterns` manual.
- **ESLint flat config com `eslint-config-expo`**: caminho oficial do Expo; substituiu 6 plugins instalados à mão.
- **`react-native-safe-area-context`**: o `SafeAreaView` do `react-native` está depreciado.
- **Prettier com `endOfLine: "auto"`**: o desenvolvimento acontece no Windows (CRLF); sem isso o format:check briga com o git.
- **Modo escuro seguindo o celular**: `userInterfaceStyle: "automatic"` no `app.json` + `useColorScheme` do React Native. O `expo-system-ui` é obrigatório para isso funcionar em builds de Android (documentação do Expo).
- **Splash com `expo-splash-screen`**: o plugin no `app.json` define a splash clara e a escura, e o `app/_layout.tsx` a segura na tela (`preventAutoHideAsync`) até as fontes carregarem. Se as fontes falharem, o app abre mesmo assim, com a fonte do sistema. A splash só aparece de verdade em build de preview/produção; o Expo Go mostra a dele.
- **Teto de ampliação só onde a largura é fixa** (`FONT_SCALE`): respeita quem aumenta a fonte do celular sem deixar botão, aba ou número grande estourar a tela.
- **`createThemedStyles` monta os dois StyleSheets uma vez**: o hook só escolhe entre o claro e o escuro, sem recriar estilos a cada render.
- **Contraste testado no CI** (`contrast.test.ts`): cor nova tem que passar no WCAG AA nos dois temas.
- **Geist Sans/Mono com `tabular-nums`**: decisão do `DESIGN.md` — números com largura fixa alinham em tabelas e não "dançam" ao digitar.
- **Nível de pace separado da aparência**: `domain/levels.ts` só diz qual é o nível (`'elite'`, `'beginner'`...); texto, emoji e cor ficam em `constants/paceLevels.ts`. A mesma regra serve para modo escuro ou outro idioma. Fundos claros recebem texto escuro para cumprir contraste WCAG.
- **Validação devolve código de erro, não texto**: a regra não muda se a frase mudar, e o `Record<ValidationError, string>` obriga todo código novo a ter mensagem.
- **`Pressable` em vez de `TouchableOpacity`**: API atual do React Native, com estilo de "pressionado" controlado por nós.
- **Id do histórico = timestamp + sufixo aleatório**: `Date.now()` sozinho colidia em cálculos no mesmo milissegundo.
- **Histórico limitado a 10 itens**: mantém o AsyncStorage leve e a lista útil.
- **Histórico guarda dados brutos (v2)**: `{ version: 2, items: [{ id, distanceKm, durationSeconds, createdAt }] }`. O pace e os textos são recalculados na hora de mostrar. A v1 (texto já formatado) é migrada e regravada automaticamente na primeira leitura.
- **Zod valida o histórico ao ler**: o que vem do aparelho pode ter sido gravado por uma versão antiga ou estar corrompido. Itens inválidos são descartados um a um, sem perder o resto. Mudou o formato? Crie a v3 em `historySchema.ts` e uma migração da v2, nunca altere a v2 no lugar.
- **Tempo máximo de 99:59:59**: o campo de horas tem 2 dígitos e o limite cobre ultramaratonas (coerente com os 500 km de distância).
- **Pace arredondado ao segundo** (não truncado): mesmo critério do cálculo de tempo, para as abas baterem entre si.
- **`react-dom` fixado em 19.1.0, mesmo sem versão web**: o `expo-router` traz componentes web (Radix) que exigem `react-dom`. Sem fixar, o npm instala a versão mais nova, que pede um React mais novo que o do SDK 54, e o `npm ci` do CI quebra. Não remover; atualizar junto com o `react` quando o SDK mudar.
- **Lockfile gerado com npm 11** (o mesmo do Node 24 do CI): npm de versões diferentes escrevem o `package-lock.json` de formas diferentes e o `npm ci` quebra.

## O que NUNCA fazer neste repositório

- Commitar na `main` ou fazer push forçado
- Adicionar assinatura de IA (`Co-Authored-By`, "Generated with...") em commits ou PRs
- Hardcodar cores/tamanhos/fontes fora do `theme.ts`
- Editar ou commitar pastas nativas (`/android`, `/ios`) — são geradas pelo Expo
- Remover validações de entrada ou os feedbacks de acessibilidade
- Rodar `npm audit fix --force` (pode quebrar versões do Expo; tratar vulnerabilidades com atualização consciente)
- Adicionar dependências sem verificar compatibilidade com o Expo (`npx expo install` em vez de `npm install` para libs com código nativo)
- Apagar ou "simplificar" testes para fazer o CI passar
