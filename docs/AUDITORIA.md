# Auditoria técnica e de produto — PaceFlow (setembro/2026)

> Base do projeto de **Complete Product Revamp**. Cada fase do roadmap (seção 6) vira uma
> sequência de branches e PRs pequenos, seguindo as regras do `CLAUDE.md`.
> Decisões visuais continuam tendo o `DESIGN.md` como fonte da verdade.

## Veredito

A engenharia está acima da média para o estágio do projeto: TypeScript estrito, CI, Husky,
testes nas funções puras, tokens de design, documentação e commits organizados.

O ponto fraco é o **produto**: hoje o app é formulário → botão → `Alert`, com poucos recursos
além do que Strava ou Garmin já oferecem. A base de código aguenta o revamp; o que precisa de
mais trabalho é a experiência de uso.

| Área                        | Nota  | Resumo                                                                                    |
| --------------------------- | ----- | ----------------------------------------------------------------------------------------- |
| Ferramentas, CI e qualidade | 4/5   | Lint, tipos e testes passam. Faltavam `expo-doctor` e limite de cobertura.                |
| Arquitetura                 | 3/5   | Boa para o tamanho, mas a regra de negócio conhece cores e o histórico guarda texto.      |
| Stack                       | 3.5/5 | Moderna (SDK 54, RN 0.81, New Arch). Navegação feita à mão; versões com `^` em libs Expo. |
| Testes                      | 2.5/5 | `utils` ~93% de cobertura; componentes 0%, com Testing Library instalado e sem uso.       |
| Design visual               | 3/5   | Coeso, mas vários textos abaixo do contraste mínimo e sem modo escuro.                    |
| UX                          | 2/5   | Botão "Calcular" obrigatório, erro em `Alert`, sem pulo de campo, só km.                  |
| Acessibilidade              | 3/5   | Contraste reprovado em vários pontos; itens do histórico sem rótulos.                     |

## 1. Bugs e problemas concretos

1. **"Hoje/Ontem" do histórico errado**: contava janelas de 24h, não dias do calendário.
   _(corrigido na Fase 0)_
2. **Pace truncado × tempo arredondado**: `calculatePaceValue` usava `Math.floor` (299,9 s →
   "4:59"), enquanto `calculateTime` arredonda. _(corrigido na Fase 0)_
3. **Limites de domínio contraditórios**: 500 km permitidos, mas tempo limitado a menos de 24h.
   _(corrigido na Fase 0: limite de tempo passou para 99:59:59)_
4. **`npm run web` quebrado** (sem `react-dom`/`react-native-web`). _(script removido na Fase 0)_
5. **README cita MIT, mas não havia `LICENSE`.** _(corrigido na Fase 0)_
6. **`coverage/` não era ignorada**: `format:check` falhava depois de `test:coverage`.
   _(corrigido na Fase 0)_
7. **Libs Expo com `^`** e `@types/jest` 30 com `jest` 29. _(corrigido na Fase 0)_
8. **`Dimensions.get` fora do componente** no `Header`. _(corrigido na Fase 0)_
9. **Acessibilidade**: botões do histórico sem rótulo, botão dentro de botão, logo chamado
   "Pace Calculator", emojis lidos em voz alta. _(corrigido na Fase 0)_

## 2. Arquitetura

**Manter:** estado local por aba, lógica em funções puras, UI compartilhada em `ui/`.

**Mudar:** _(Fase 1a entregou: camadas `domain/format/validation`, feedback por nível, códigos de erro, `<TimeInput>`, `<ScreenHeader>`, `useMaskedField` e `Pressable`. A Fase 1b entregou o histórico v2 com Zod e migração automática. A Fase 1c entregou o Expo Router. Fase 1 concluída.)_

- **Regra de negócio conhece cores**: `getPaceFeedback` importa `COLORS`. Deve devolver só um
  nível (`'elite' | 'advanced' | ...`) e a camada visual traduz em cor e texto.
- **`paceHelpers.ts` mistura três assuntos**. Separar em:
  ```
  src/domain/     pace.ts, time.ts, splits.ts, levels.ts   (só números)
  src/format/     masks.ts, formatters.ts                  (string ↔ número)
  src/validation/ rules.ts                                 (códigos de erro; texto na UI)
  ```
- **Histórico guarda texto formatado** (`"0:50:00"`). Guardar dados brutos com versão:
  `{ v: 2, distanceM, durationS, createdAt }`, migrar os antigos e validar com Zod ao ler.
- **Código repetido nas abas**: extrair `<TimeInput>`, `<ScreenHeader>` e `useDistanceField()`.
- **Navegação feita à mão**: migrar para **Expo Router** (voltar do Android, links diretos,
  restore via `router.push('/pace?historyId=...')`).

## 3. Stack

| Hoje                      | Recomendação                                                          |
| ------------------------- | --------------------------------------------------------------------- |
| Abas manuais em `App.tsx` | Expo Router (abas)                                                    |
| `Animated` do RN          | Reanimated                                                            |
| `TouchableOpacity`        | `Pressable`                                                           |
| `Alert.alert` para erros  | Erro no próprio campo                                                 |
| AsyncStorage              | Manter; `expo-sqlite` (+ Drizzle) se virar diário de treinos          |
| Sem estado global         | Zustand + persist quando chegarem Configurações                       |
| `StyleSheet` + tokens     | Manter, com `useTheme()` e tokens semânticos                          |
| Logo PNG                  | SVG (`react-native-svg`)                                              |
| Expo Go                   | `expo-dev-client` + EAS Build                                         |
| Sem monitoramento         | Sentry + expo-updates (OTA)                                           |
| Jest só em `utils`        | RN Testing Library nos componentes + Maestro (E2E)                    |
| CI básico                 | `expo-doctor`, limite de cobertura, `concurrency` _(feito na Fase 0)_ |

## 4. Design — contraste medido (WCAG AA = 4.5:1)

| Combinação                               | Contraste | Resultado                     |
| ---------------------------------------- | --------- | ----------------------------- |
| Branco sobre laranja `#E8662E`           | 3.3:1     | ❌ só passa no número de 46px |
| Laranja como texto ("km", coluna Total)  | 3.3:1     | ❌                            |
| `#999` (abas inativas, "h/min/seg")      | 2.85:1    | ❌                            |
| `#ff6b6b` ("Limpar tudo")                | 2.78:1    | ❌                            |
| `#AAA` (placeholders, data do histórico) | 2.2:1     | ❌                            |

_(Fase 2a: resolvido. Todas as combinações passam no AA nos dois temas, com teste no CI.)_

Soluções: laranja de texto `#BF4B17` (4.96:1), cinzas `#6B6B6B` (5.3:1), vermelho mais escuro.
Também: modo escuro, `maxFontSizeMultiplier` no número grande, vírgula decimal ("5,0"),
ícone do app real. _(Fase 2a: modo escuro. Fase 2b: fonte ampliada, vírgula decimal e splash com o logo. Pendente: ícone do app.)_

## 5. UX

1. Cálculo ao vivo; salvar no histórico vira ação explícita. _(Fase 3a: feito, com erros no próprio campo.)_
2. Distâncias prontas: `5K · 10K · 21,1K · 42,2K`.
3. Campo de tempo com pulo automático de foco.
4. km ↔ milhas e velocidade em km/h.
5. Previsão de prova (fórmula de Riegel).
6. Tabela de parciais com estratégias (constante, negative split) e compartilhamento.
7. Feedback que considera a distância, sem rótulos condescendentes.
8. Histórico: deslizar para apagar, desfazer, agrupar por data, gráfico de evolução.
9. Onboarding de uma tela e tela de Configurações.

## 6. Roadmap

| Fase                   | Foco        | Entregas                                                                                     |
| ---------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| **0: Fundação**        | Base segura | Bugs da seção 1, versões com `~`, `LICENSE`, `expo-doctor` e cobertura no CI                 |
| **1: Reengenharia**    | Arquitetura | `domain/format/validation`, feedback por nível, histórico v2 + Zod, Expo Router, `Pressable` |
| **2: Design system**   | Visual      | Tokens semânticos, modo escuro, contraste AA, fonte ampliada, logo SVG, ícone                |
| **3: UX**              | Experiência | Cálculo ao vivo, erro no campo, distâncias prontas, pulo de foco, pt-BR, km/milhas           |
| **4: Funcionalidades** | Valor novo  | Previsão de prova, estratégias de parcial, compartilhar tabela, estatísticas                 |
| **5: Produção**        | Publicar    | dev-client, EAS Build/Submit, Sentry, OTA, testes de componente e Maestro                    |
