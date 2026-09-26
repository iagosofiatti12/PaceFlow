# Sistema de Design — PaceFlow

> **Para o agente de código:** este arquivo contém as diretrizes de design do projeto,
> nascidas de uma auditoria completa. Sempre que for mexer em qualquer parte do frontend —
> componentes, estilos, layouts, cores, espaçamentos — leia este arquivo primeiro.
> Ele é a fonte da verdade para decisões visuais do projeto.

> **Status (setembro/2026):** os "ganhos rápidos" 1–4 e os estruturais 5 e 7 já foram
> implementados. A Fase 2 do revamp (`docs/AUDITORIA.md`) trouxe o modo escuro e o sistema de
> cores por papel (seção abaixo). Pendentes: variar o tratamento do resultado por contexto
> (estrutural 6) e desenhar o ícone de app a partir do símbolo do tênis (estrutural 8).

## Cores por papel e modo escuro (vale para todo código novo)

O app segue o tema do celular (claro ou escuro). As cores vivem em `src/constants/theme.ts`,
em duas paletas (`LIGHT_COLORS` e `DARK_COLORS`) com os mesmos nomes. Cada nome descreve o
**papel** da cor, não a aparência: `surface` é "fundo de cartão", branco no claro e
cinza-escuro no escuro. Nos componentes, as cores vêm de `useColors()` ou de
`createThemedStyles()` (`src/hooks/useTheme.ts`), nunca de valores fixos.

**Os dois laranjas da marca:**

| Token          | Claro     | Escuro    | Onde usar                                                             |
| -------------- | --------- | --------- | --------------------------------------------------------------------- |
| `accent`       | `#E8662E` | `#F07A45` | Ícones e detalhes sem texto (bordas, bandeira da tabela)              |
| `accentStrong` | `#BF4B17` | `#BF4B17` | Fundo com texto branco por cima: botão principal, cartão de resultado |
| `accentText`   | `#BF4B17` | `#F07A45` | Texto laranja sobre os fundos do app ("km", coluna Total)             |
| `accentSoft`   | `#FFF5F0` | `#3A2418` | Fundo laranja-claro: aba ativa, linha final da tabela                 |

O `#E8662E` com texto branco tinha contraste 3.3:1 (o mínimo é 4.5:1). Por isso botões e o
cartão de resultado passaram a usar o `#BF4B17`, um tom mais queimado da mesma cor, e o
`#E8662E` ficou para o que não tem texto por cima.

**Contraste é garantido por teste:** `src/constants/__tests__/contrast.test.ts` mede, nos dois
temas, cada combinação de texto e fundo usada no app (mínimo 4.5:1 para texto e 3:1 para
ícones). Uma cor nova que não passa deixa o CI vermelho.

**Selos de nível do pace:** usam a escala `PACE_LEVEL_COLORS`, igual nos dois temas. O selo
"avançado" mudou de `#D9591E` para `#C2521C`: o texto branco sobre o tom antigo tinha 3.89:1.

**Modo escuro:** fundos quase pretos com um toque quente (`#121110`, `#1C1A18`), que combinam
com o laranja, e um laranja mais luminoso para texto e ícones. O cabeçalho da tabela usa
`inverseSurface`, que é escuro no tema claro e claro no escuro.

## Fonte ampliada, números em pt-BR e splash (vale para todo código novo)

**Fonte ampliada (acessibilidade do celular):** texto corrido (títulos, descrições, histórico)
cresce sem limite, porque quebra linha. Elementos de largura fixa recebem um teto com
`maxFontSizeMultiplier`, usando os tokens `FONT_SCALE` do `theme.ts`:

- `FONT_SCALE.display` (1.3): o número grande do resultado. Ele também usa `numberOfLines={1}`
  e `adjustsFontSizeToFit`, para encolher em vez de quebrar.
- `FONT_SCALE.control` (1.4): botões, abas, campos, unidades e células da tabela.

**Distância com vírgula:** o app mostra "10,5 km", como o brasileiro escreve. O campo aceita
vírgula ou ponto e sempre exibe vírgula. Para mostrar uma distância, use `formatKm()`
(`src/format/distance.ts`), nunca `toString()`. Tempo e pace continuam com ":" ("5:30").

**Splash:** o logo sobre o fundo do tema (`#FAF8F5` no claro, `#121110` no escuro), configurada
no plugin `expo-splash-screen` do `app.json`. Ela fica na tela até as fontes carregarem.

## Cálculo ao vivo e erros no campo (vale para todo código novo)

**Sem botão "Calcular":** o resultado aparece e se atualiza enquanto a pessoa digita. A ordem
de cada aba é: campos → cartão de resultado → botões. Na aba Pace, o botão principal é
"Salvar no histórico": fica esmaecido sem resultado e vira "Salvo" (com ✓) depois de salvo,
até o cálculo mudar. Nas abas Tempo e Tabela, o único botão é "Limpar".

**Erros embaixo do campo, nunca em alerta:** borda do campo em `danger` e a mensagem logo
abaixo, no lugar da dica. Campo vazio nunca mostra erro. Erro de limite ("máximo 500 km")
aparece na hora; erro de digitação em andamento ("5:" antes de "5:30") só depois que a pessoa
sai do campo. Assim a tela não fica vermelha enquanto alguém ainda está digitando.

# Auditoria de Design — PaceFlow

Nota geral: 3.3/5. Base de produto madura e com personalidade; maior ganho está em tipografia e consistência de sistema.

## Pontuação por área

- Identidade & marca: 3/5
- Tipografia: 2.5/5
- Cor & contraste: 4/5
- Hierarquia visual: 3.5/5
- Consistência de sistema: 2.5/5
- Acessibilidade: 4.5/5
- Densidade & layout: 3/5

## O que já funciona

- **Restrição de cor**: um único laranja (#E8662E) como acento, usado com disciplina.
- **Card de resultado forte**: bloco laranja com número grande é um ótimo ponto focal.
- **Acessibilidade exemplar**: accessibilityLabel, hint, role em quase tudo, além de SafeAreaView.
- **Haptics + microanimação**: feedback tátil no sucesso/erro e fade entre abas.

## A marca / logo

Logo em handlettering/brush, "Pace" e "Flow" empilhados, cor #E8662E, com um pé/tênis em outline correndo sob a palavra. Expressivo e com movimento — a UI atual (fonte de sistema genérica) não honra essa promessa.
**Oportunidade**: isolar o símbolo do tênis como ícone de app, em vez do placeholder atual.

## Achados (por prioridade)

1. **[Alta] Tipografia genérica engole a marca.** UI usa fonte de sistema em pesos 600–800 quase toda. Recomendação: adotar uma grotesca real (ex. Geist Sans) e reservar peso forte só para números.
2. **[Média] Números não são tabulares.** Recomendação: `font-variant-numeric: tabular-nums` ou fonte mono (Geist Mono) no resultado, tabela e campos de tempo.
3. **[Baixa] TabBar manda três sinais ao mesmo tempo** (fundo branco + cor laranja + barra). Recomendação: escolher um sinal só (ex. pílula laranja-clara + texto laranja).
4. **[Média] Header desperdiça espaço vertical** — logo de 120px sem tagline. Recomendação: compactar para ~36–40px, alinhado à esquerda.
5. **[Baixa] Laranja sólido se repete e satura** (header + totais na Tabela). Recomendação: variar tratamento — header neutro/escuro, laranja só nos números-chave.
6. **[Baixa] Histórico está apertado** (padding vertical mínimo). Recomendação: mais respiro, pace como âncora visual do item.
7. **[Média] Estilos duplicados entre PaceCalculator, TimeCalculator e PaceTable.** Recomendação: extrair `<Input>`, `<PrimaryButton>`, `<ResultCard>` compartilhados.

## Sistema tipográfico proposto

- **Geist Sans** (interface): pesos 400/500/600. Títulos 22px/600, rótulos 15px/500, texto de apoio 13px/400.
- **Geist Mono** (números): sempre com tabular-nums. Resultado de pace em destaque ~46px/500.
- Regra de cor: laranja só para ação e o número que importa.

## Prioridades

**Ganhos rápidos**

1. Trocar fonte de sistema por Geist (Sans + Mono).
2. Aplicar tabular-nums em todos os números.
3. Encolher o header e simplificar a TabBar.
4. Sentence case e calibrar pesos de fonte.

**Estruturais** 5. Extrair componentes compartilhados (Input, Button, ResultCard). 6. Variar tratamento do resultado por contexto (Tabela vs. Pace). 7. Repensar densidade e hierarquia do Histórico. 8. Desenhar ícone de app real a partir do símbolo do tênis do logo.

## Instrução para implementação

Implemente as melhorias na ordem das prioridades acima. Para cada item:

- Crie uma branch separada (ex: `design/typography-geist`, `design/shared-components`)
- Consulte a documentação mais recente da biblioteca no Context7 antes de implementar
- Explique o que está fazendo e por que antes de começar cada mudança
