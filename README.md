# PaceFlow - Calculadora de Pace para Corredores

Aplicativo React Native para calcular o pace (ritmo) de corridas.

## 📱 Sobre o Projeto

PaceFlow é uma ferramenta simples e intuitiva para corredores calcularem seu pace médio durante treinos e provas. Basta inserir a distância percorrida e o tempo total para obter seu ritmo em minutos por quilômetro.

## 🏗️ Estrutura do Projeto

```
Paceflow/
├── src/
│   ├── components/       # Componentes React reutilizáveis
│   │   ├── Header.js
│   │   ├── TabBar.js
│   │   ├── PaceCalculator.js
│   │   └── ComingSoonTab.js
│   ├── constants/        # Constantes e tokens de design
│   │   └── theme.js
│   ├── screens/          # Telas do aplicativo (futuro)
│   └── utils/            # Funções auxiliares e helpers
│       └── paceHelpers.js
├── assets/               # Imagens e recursos
├── App.js                # Componente principal
├── index.js              # Ponto de entrada
└── package.json          # Dependências do projeto
```

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **TypeScript** - Superset JavaScript com tipagem estática
- **Expo** - Plataforma para facilitar o desenvolvimento
- **ESLint** - Ferramenta para análise de código e boas práticas
- **Prettier** - Formatador automático de código
- **Jest** - Framework de testes
- **Husky** - Git Hooks para manter qualidade do código

## 🚀 Como Executar

### Pré-requisitos

- Node.js instalado
- npm ou yarn
- Expo Go no celular (Android/iOS) ou emulador configurado

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

## 📝 Scripts Disponíveis

### Desenvolvimento e Execução

| Comando           | O que faz               | Quando usar                                                    |
| ----------------- | ----------------------- | -------------------------------------------------------------- |
| `npm start`       | Inicia o servidor Expo  | Toda vez que for desenvolver/testar o app                      |
| `npm run android` | Abre o app no Android   | Quando quiser testar no emulador/celular Android               |
| `npm run ios`     | Abre o app no iOS       | Quando quiser testar no emulador/iPhone (só Mac)               |
| `npm run web`     | Abre o app no navegador | Para testes rápidos no navegador (precisa dependências extras) |

### Testes

| Comando                 | O que faz                              | Quando usar                                              |
| ----------------------- | -------------------------------------- | -------------------------------------------------------- |
| `npm test`              | Roda todos os testes                   | Antes de fazer commit ou para verificar se tudo funciona |
| `npm run test:watch`    | Roda testes automaticamente ao salvar  | Durante desenvolvimento, para feedback imediato          |
| `npm run test:coverage` | Mostra cobertura de testes (% testado) | Para saber quanto do código está coberto por testes      |

### Qualidade de Código

| Comando                | O que faz                           | Quando usar                                                |
| ---------------------- | ----------------------------------- | ---------------------------------------------------------- |
| `npm run lint`         | Verifica erros no código            | Antes de fazer commit, para encontrar problemas            |
| `npm run lint:fix`     | Corrige erros automaticamente       | Quando o lint encontrar problemas que podem ser corrigidos |
| `npm run format`       | Formata todo o código               | Para deixar o código bonito e padronizado                  |
| `npm run format:check` | Só verifica formatação, sem alterar | Em CI/CD ou para verificar se está tudo formatado          |

### Fluxo de Trabalho Recomendado

```bash
# 1. Começar a desenvolver
npm start

# 2. Fazer mudanças no código...

# 3. Antes de commitar, verificar qualidade
npm run lint        # Ver se tem erros
npm test            # Ver se testes passam

# 4. Se quiser corrigir automaticamente
npm run lint:fix    # Corrige erros de código
npm run format      # Formata tudo

# 5. Fazer commit (Husky vai verificar automaticamente!)
git add .
git commit -m "sua mensagem"
# → Git Hooks rodam automático: lint + format nos arquivos modificados
```

### Nota Importante: Git Hooks Automático 🪝

**Você não precisa rodar lint/format manualmente antes de commit!**

O Husky configurado faz isso automaticamente:

- Ao fazer `git commit`, ele roda ESLint e Prettier nos arquivos modificados
- Se tiver erro → commit é bloqueado (você corrige e tenta novamente)
- Se tudo ok → commit é feito ✅

Isso garante que **nunca vai ter código mal formatado ou com erros** no repositório!

## ✨ Funcionalidades

- ✅ Cálculo de pace (min/km)
- ✅ Validação de entradas
- ✅ Feedback baseado no ritmo (elite, avançado, intermediário, iniciante)
- ✅ Interface responsiva e acessível
- 🔜 Cálculo de tempo estimado
- 🔜 Tabela de ritmos por distância

## 🏗️ Arquitetura e Boas Práticas

### Organização de Código

- **Componentização**: Código dividido em componentes pequenos e reutilizáveis
- **Separação de Responsabilidades**: Lógica de negócio separada da apresentação
- **Design Tokens**: Cores e espaçamentos centralizados no arquivo `theme.js`
- **Helpers Utilitários**: Funções auxiliares isoladas em `utils/`

### Segurança e Validação

- Validação rigorosa de entradas do usuário
- Limites de distância (0.1 a 500 km)
- Limites de tempo (até 24 horas)
- Tratamento de valores inválidos ou vazios
- Sanitização de entrada numérica

### Qualidade de Código

- **ESLint** configurado para detectar problemas e más práticas
- **Prettier** para formatação consistente
- Código formatado automaticamente
- Análise estática de código
- Nomenclatura clara e descritiva

### Acessibilidade

- Labels descritivas para leitores de tela
- Hints contextuais para campos
- Roles adequados para elementos interativos
- Áreas seguras respeitadas (SafeAreaView)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.
