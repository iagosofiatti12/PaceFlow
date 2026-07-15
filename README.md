# PaceFlow - Calculadora de Pace para Corredores

Aplicativo React Native para calcular o pace (ritmo) de corridas.

## 📱 Sobre o Projeto

PaceFlow é uma ferramenta simples e intuitiva para corredores calcularem seu pace médio durante treinos e provas. Basta inserir a distância percorrida e o tempo total para obter seu ritmo em minutos por quilômetro. Também calcula o tempo estimado de prova a partir de um pace, gera tabelas km a km e guarda o histórico dos últimos cálculos.

## 🏗️ Estrutura do Projeto

```
Paceflow/
├── src/
│   ├── components/          # Componentes das abas do app
│   │   ├── Header.tsx
│   │   ├── TabBar.tsx
│   │   ├── PaceCalculator.tsx
│   │   ├── TimeCalculator.tsx
│   │   ├── PaceTable.tsx
│   │   ├── HistoryTab.tsx
│   │   └── ui/              # Componentes de UI reutilizáveis
│   │       ├── Button.tsx
│   │       ├── ButtonRow.tsx
│   │       ├── Card.tsx
│   │       ├── InputField.tsx
│   │       └── ResultCard.tsx
│   ├── constants/           # Tokens de design (cores, espaçamentos, fontes)
│   │   └── theme.ts
│   ├── types.ts             # Tipos compartilhados
│   └── utils/               # Lógica de negócio, storage e feedback
│       ├── paceHelpers.ts
│       ├── storage.ts
│       ├── feedback.ts
│       └── __tests__/
│           ├── paceHelpers.test.ts
│           └── storage.test.ts
├── assets/                  # Imagens e recursos
├── .github/workflows/ci.yml # CI: lint + tipos + formatação + testes
├── App.tsx                  # Componente raiz (abas e navegação)
├── index.js                 # Ponto de entrada
├── app.json                 # Configuração do Expo
├── tsconfig.json            # Configuração do TypeScript
├── jest.config.js           # Configuração dos testes (preset jest-expo)
├── eslint.config.js         # Configuração do ESLint (flat config)
├── .prettierrc              # Configuração do Prettier
├── .husky/pre-commit        # Git hook (roda lint-staged antes do commit)
└── package.json             # Dependências e scripts do projeto
```

## 🛠️ Tecnologias Utilizadas

- **React Native + Expo (SDK 54)** - Framework para desenvolvimento mobile
- **TypeScript** - Superset JavaScript com tipagem estática
- **AsyncStorage** - Persistência local do histórico
- **Geist Sans / Geist Mono** - Tipografia da interface e dos números
- **ESLint (eslint-config-expo)** - Análise de código e boas práticas
- **Prettier** - Formatador automático de código
- **Jest (jest-expo)** - Framework de testes
- **Husky + lint-staged** - Git hooks para manter qualidade do código
- **GitHub Actions** - CI rodando em todo push e pull request

## 🚀 Como Executar

### Pré-requisitos

- Node.js instalado
- npm ou yarn
- Expo Go no celular (Android/iOS) ou emulador configurado (Android Studio)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start

# Para Android (emulador ou dispositivo conectado)
npm run android

# Para iOS (só Mac)
npm run ios
```

## 📝 Scripts Disponíveis

### Desenvolvimento e Execução

| Comando           | O que faz               | Quando usar                                      |
| ----------------- | ----------------------- | ------------------------------------------------ |
| `npm start`       | Inicia o servidor Expo  | Toda vez que for desenvolver/testar o app        |
| `npm run android` | Abre o app no Android   | Quando quiser testar no emulador/celular Android |
| `npm run ios`     | Abre o app no iOS       | Quando quiser testar no emulador/iPhone (só Mac) |
| `npm run web`     | Abre o app no navegador | Para testes rápidos no navegador                 |

### Testes e Verificações

| Comando                 | O que faz                              | Quando usar                                     |
| ----------------------- | -------------------------------------- | ----------------------------------------------- |
| `npm test`              | Roda todos os testes                   | Antes de commitar ou para verificar se tudo ok  |
| `npm run test:watch`    | Roda testes automaticamente ao salvar  | Durante desenvolvimento, para feedback imediato |
| `npm run test:coverage` | Mostra cobertura de testes (% testado) | Para saber quanto do código tem testes          |
| `npm run typecheck`     | Verifica os tipos do TypeScript        | Para achar erros de tipo sem rodar o app        |

### Qualidade de Código

| Comando                | O que faz                           | Quando usar                                      |
| ---------------------- | ----------------------------------- | ------------------------------------------------ |
| `npm run lint`         | Verifica erros no código            | Antes de commitar, para encontrar problemas      |
| `npm run lint:fix`     | Corrige erros automaticamente       | Quando o lint encontrar problemas corrigíveis    |
| `npm run format`       | Formata todo o código               | Para deixar o código padronizado                 |
| `npm run format:check` | Só verifica formatação, sem alterar | Em CI/CD ou para conferir se está tudo formatado |

### Nota Importante: Git Hooks Automático 🪝

**Você não precisa rodar lint/format manualmente antes de commit!**

O Husky configurado faz isso automaticamente:

- Ao fazer `git commit`, ele roda ESLint e Prettier nos arquivos modificados
- Se tiver erro → commit é bloqueado (você corrige e tenta novamente)
- Se tudo ok → commit é feito ✅

> `npm run prepare` (script do Husky) não precisa ser chamado manualmente — ele roda sozinho toda vez que você faz `npm install`, configurando o Git hook acima.

Além disso, o **CI no GitHub** (`.github/workflows/ci.yml`) roda lint, verificação de tipos, formatação e testes em todo push na `main` e em todo pull request — mesmo que alguém pule o hook local, nada entra sem passar por essas verificações.

## ✨ Funcionalidades

- ✅ Cálculo de pace (min/km) com feedback baseado no ritmo
- ✅ Cálculo de tempo estimado a partir de distância e pace
- ✅ Tabela de ritmo km a km com tempos parciais e acumulados
- ✅ Histórico dos últimos 10 cálculos (persistido no aparelho)
- ✅ Validação de entradas com feedback tátil (vibração)
- ✅ Interface responsiva e acessível

## 🏗️ Arquitetura e Boas Práticas

### Organização de Código

- **Componentização**: cada aba é um componente que gerencia o próprio estado
- **UI compartilhada**: inputs, botões e cartões vivem em `src/components/ui/`
- **Design Tokens**: cores, espaçamentos e fontes centralizados em `src/constants/theme.ts`
- **Lógica isolada**: cálculos e validações em `src/utils/paceHelpers.ts`, persistência em `src/utils/storage.ts`

### Design

As decisões visuais do projeto (tipografia Geist, uso do laranja, densidade, contraste) estão documentadas no arquivo `DESIGN.md` na raiz — leia antes de mexer em qualquer estilo.

### Acessibilidade

- Labels e hints descritivos para leitores de tela
- Roles adequados para elementos interativos
- Contraste de cores verificado (WCAG)
- Áreas seguras respeitadas (react-native-safe-area-context)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests. Nunca commite direto na `main` — crie uma branch descritiva (ex: `fix/nome-do-bug`) e abra um PR.

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.
