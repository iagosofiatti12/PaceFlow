# Como gerar o app para instalar (EAS Build)

O Expo Go é ótimo para desenvolver, mas mostra o ícone e a splash **dele**, não os do PaceFlow.
Para ver o app de verdade (ícone, splash, nome), é preciso gerar um **build**: o arquivo de
instalação do app. Quem monta esse arquivo é o **EAS Build**, um serviço da Expo que compila o app
nos servidores deles. Assim ninguém precisa instalar Android Studio ou Xcode só para isso.

> Analogia: o código é a receita; o build é o bolo pronto. O EAS é a padaria que assa para você.

## Perfis de build (`eas.json`)

| Perfil       | Gera                   | Para quê                                                               |
| ------------ | ---------------------- | ---------------------------------------------------------------------- |
| `preview`    | `.apk` (Android)       | Instalar direto no celular ou no emulador, sem loja                    |
| `production` | `.aab` (Android) / iOS | Enviar para a Play Store / App Store (o número da versão sobe sozinho) |

## Primeira vez (uns 10 minutos)

1. **Crie uma conta gratuita** em [expo.dev](https://expo.dev/signup).
2. **Instale a ferramenta de linha de comando do EAS** (uma vez só no computador):
   ```bash
   npm install -g eas-cli
   ```
3. **Entre na sua conta** (pede usuário e senha no próprio terminal):
   ```bash
   eas login
   ```
4. **Ligue o projeto à sua conta** (cria o projeto no expo.dev e grava o `projectId` no `app.json`;
   commite essa mudança numa branch, como sempre):
   ```bash
   eas init
   ```

## Gerar o APK de teste

```bash
npm run build:preview
```

- Na primeira vez, o EAS pergunta se pode **criar a chave de assinatura do Android** (keystore).
  Responda **sim**: ela fica guardada com segurança na sua conta Expo. É essa chave que prova
  que as próximas versões do app são suas; não apague.
- O build roda nos servidores da Expo e leva uns 10 a 20 minutos (no plano gratuito pode ter
  fila). Dá para acompanhar pelo link que aparece no terminal.
- No fim, aparece um **link e um QR code** para baixar o `.apk`.

## Instalar

- **Celular Android:** abra o link (ou leia o QR code) no celular, baixe o `.apk` e toque nele.
  O Android vai pedir para "permitir instalar apps desta fonte": permita só para o navegador.
- **Emulador do Android Studio:** baixe o `.apk` no computador e arraste o arquivo para a janela
  do emulador.

## Bom saber

- O id do app é `com.iagosofiatti.paceflow` (no `app.json`). Depois de publicar na Play Store,
  ele **não pode mais mudar**.
- iPhone: build para instalar exige conta de desenvolvedor da Apple (paga). Por isso o comando
  acima gera só Android.
- Mudou só código JavaScript? Não precisa de build novo para testar: o Expo Go continua valendo.
  Build novo só para ver ícone/splash ou depois de adicionar biblioteca com código nativo.
