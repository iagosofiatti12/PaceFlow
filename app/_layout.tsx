import React, { useCallback, useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
} from '@expo-google-fonts/geist';
import { GeistMono_500Medium, GeistMono_600SemiBold } from '@expo-google-fonts/geist-mono';

import Header from '../src/components/Header';
import TabBar from '../src/components/TabBar';
import IntroAnimation from '../src/components/IntroAnimation';
import { createThemedStyles } from '../src/hooks/useTheme';
import { applyThemePreference, loadThemePreference } from '../src/utils/themePreference';

// Mantém a splash (logo sobre o fundo do tema) na tela até as fontes carregarem,
// em vez de mostrar um instante de tela vazia. Ela some com um fade curto.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

// Layout raiz do Expo Router: tudo o que aparece em TODAS as telas mora aqui
// (fontes, área segura, logo e barra de abas). Cada aba é um arquivo desta pasta:
// index.tsx (Pace), time.tsx, table.tsx, treadmill.tsx e history.tsx.
export default function RootLayout(): React.ReactElement | null {
  // Estilos do tema atual (claro ou escuro, segue o celular)
  const styles = useStyles();

  // Animação de abertura (logo pulsando e saindo correndo), por cima do app
  const [showIntro, setShowIntro] = useState(true);
  const hideIntro = useCallback(() => setShowIntro(false), []);

  // Carrega as fontes Geist antes de mostrar a interface
  const [fontsLoaded, fontError] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
  });

  // Tema escolhido no app (claro, escuro ou automático): aplicado antes de a
  // splash sair, para a tela não piscar no tema errado ao abrir
  const [themeReady, setThemeReady] = useState(false);
  useEffect(() => {
    loadThemePreference()
      .then(applyThemePreference)
      .finally(() => setThemeReady(true));
  }, []);

  // Fontes prontas (ou falharam: nesse caso o app abre com a fonte do sistema,
  // em vez de ficar preso na splash para sempre)
  const ready = (fontsLoaded || fontError !== null) && themeReady;

  useEffect(() => {
    if (ready) {
      SplashScreen.hide();
    }
  }, [ready]);

  // Enquanto as fontes carregam (fração de segundo), a splash continua na tela
  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* "auto": ícones da barra de status escuros no tema claro e claros no escuro */}
        <StatusBar style="auto" />
        <Header />
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{
            // Barra de abas embaixo, onde o polegar alcança (padrão dos apps atuais)
            tabBarPosition: 'bottom',
            headerShown: false,
            // Troca de aba com um leve deslize + fade (em vez de só fade)
            animation: 'shift',
            sceneStyle: styles.scene,
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Pace' }} />
          <Tabs.Screen name="time" options={{ title: 'Tempo' }} />
          <Tabs.Screen name="table" options={{ title: 'Tabela' }} />
          <Tabs.Screen name="treadmill" options={{ title: 'Esteira' }} />
          <Tabs.Screen name="history" options={{ title: 'Histórico' }} />
          {/* "Você" não aparece na barra: abre pelo botão de perfil do cabeçalho */}
          <Tabs.Screen name="you" options={{ title: 'Você' }} />
        </Tabs>
      </SafeAreaView>
      {showIntro && <IntroAnimation onFinish={hideIntro} />}
    </SafeAreaProvider>
  );
}

const useStyles = createThemedStyles((colors) => ({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scene: {
    backgroundColor: colors.background,
  },
}));
