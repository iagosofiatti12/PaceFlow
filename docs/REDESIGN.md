# Redesign 2026 — PaceFlow moderno

Plano do redesign visual e de movimento do app, com as bibliotecas estudadas e o que já foi feito.
As regras visuais que valem para todo código novo ficam no `DESIGN.md` (seção "Redesign 2026").

## Por que redesenhar

O app funcionava bem, mas parecia um formulário: abas em cima com rótulo cortado ("Históri…"),
botão "Salvar n…" cortado, logo minúsculo, tudo dentro de um cartão só e nenhuma resposta
visual além de "ficar transparente" ao tocar. Apps de corrida atuais (Strava, Nike Run Club,
Runna) e os próprios sistemas (iOS 18, Android 15 / Material 3) seguem outro padrão:

- navegação **embaixo**, onde o polegar alcança;
- **título grande** por tela e conteúdo em cartões separados;
- **botões em pílula** e áreas de toque grandes;
- **movimento físico** (molas) que mostra de onde as coisas vêm e para onde vão;
- **vibração leve** ao escolher uma opção.

## Bibliotecas estudadas

Todas compatíveis com o Expo SDK 54 (versões do `bundledNativeModules.json` do próprio Expo) e
disponíveis no Expo Go.

| Biblioteca                                 | Para quê                                                    | Decisão                                                           |
| ------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| **react-native-reanimated 4** (+ worklets) | Animações na thread de UI: molas, entrada/saída, listas     | **Usada (Fase A).** Padrão do mercado e do Expo                   |
| **expo-linear-gradient**                   | Degradê nativo                                              | **Usada (Fase A)** no cartão de resultado                         |
| **expo-haptics** (já tínhamos)             | Vibração                                                    | **Ampliada:** toque leve ao escolher aba, atalho ou modo          |
| react-native-gesture-handler               | Gestos: arrastar para excluir, puxar painéis                | Fase B                                                            |
| @gorhom/bottom-sheet                       | Painel que sobe de baixo (ex: detalhes de um cálculo)       | Fase B (depende do gesture-handler)                               |
| @shopify/react-native-skia                 | Desenho em GPU: gráficos, brilho, imagens geradas           | Fase C (gráfico das parciais) e base das imagens para o Instagram |
| lottie-react-native                        | Animações prontas feitas no After Effects (ex: comemoração) | Fase D, se houver uma animação de marca                           |
| Moti                                       | Atalho declarativo em cima do Reanimated                    | Não: mais uma camada, e o Reanimated 4 já faz o mesmo direto      |
| expo-blur                                  | Fundo "vidro fosco" na barra de abas                        | Não por enquanto: no Android o desfoque ainda é experimental      |

## Fase A — feita (este redesign)

**Correções que o redesign resolveu**

- Botão "Salvar no histórico" cortado ("Salvar n…"): agora ocupa a largura toda e, com fonte
  ampliada, encolhe em vez de cortar.
- Aba "Histórico" cortada ("Históri…"): rótulos menores na barra de baixo, que encolhem se
  preciso.
- Logo minúsculo no topo: o `logo.png` tinha margem transparente enorme; o cabeçalho usa um
  recorte (`assets/logo-header.png`).
- Unidade do campo ("km", "/km") podia ser empurrada para fora do cartão: o campo agora encolhe
  (`minWidth: 0`).
- Histórico vazio dizia que os cálculos apareciam "automaticamente", mas hoje é preciso tocar em
  "Salvar no histórico": texto corrigido.
- Barra de abas ocupando espaço com o teclado aberto no Android: agora ela some enquanto se digita.

**Novo visual**

- Barra de abas flutuante embaixo, com pílula que desliza até a aba ativa e ícone preenchido.
- Título grande em cada aba, com "Limpar" como pílula discreta ao lado (só aparece com algo
  digitado).
- Cartões separados: campos, resultado, previsão de prova e ritmos de treino.
- Cartão de resultado em degradê, número maior e selo de nível que "pula".
- Campo em foco com borda laranja.
- `SegmentedControl` com pílula deslizante.
- Histórico com um cartão por cálculo, entrada em sequência e saída deslizando ao excluir.

**Movimento:** ver a tabela "Movimento" no `DESIGN.md`. Tudo com mola, curto, e respeitando o
"reduzir movimento" do celular.

## Próximas fases

**Fase B — gestos**

- Arrastar um cálculo do histórico para a esquerda para excluir (com "desfazer").
- Painel de baixo (bottom sheet) com os detalhes de um cálculo salvo.
- Puxar para baixo com animação própria no histórico.

**Fase C — dados visuais (Skia)**

- Gráfico das parciais na aba Tabela (barras km a km, destacando o negative split).
- Medidor de pace em arco no cartão de resultado, preenchendo até o nível.

**Fase D — compartilhar**

- Imagem do treino ou do plano de prova para os stories do Instagram, desenhada com Skia
  (ideia anotada desde a análise de mercado).
- Comemoração (Lottie ou Skia) ao salvar um recorde pessoal.

## Como testar o movimento

As animações rodam no celular (Expo Go ou build de preview). Para ver o app sem movimento, ligue
"Remover animações" nas opções de acessibilidade do Android: o app deve funcionar igual, só que
sem as transições.
