# Sistema de Design — PaceFlow

> **Para o agente de código:** este arquivo contém as diretrizes de design do projeto,
> nascidas de uma auditoria completa. Sempre que for mexer em qualquer parte do frontend —
> componentes, estilos, layouts, cores, espaçamentos — leia este arquivo primeiro.
> Ele é a fonte da verdade para decisões visuais do projeto.

> **Status (julho/2026):** os "ganhos rápidos" 1–4, os estruturais 5 e 7 e as correções de
> contraste já foram implementados. Pendentes: variar o tratamento do resultado por contexto
> (estrutural 6) e desenhar o ícone de app a partir do símbolo do tênis (estrutural 8).

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
