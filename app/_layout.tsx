import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
import { createThemedStyles } from '../src/hooks/useTheme';

// Layout raiz do Expo Router: tudo o que aparece em TODAS as telas mora aqui
// (fontes, área segura, logo e barra de abas). Cada aba é um arquivo desta pasta:
// index.tsx (Pace), time.tsx, table.tsx e history.tsx.
export default function RootLayout(): React.ReactElement | null {
  // Estilos do tema atual (claro ou escuro, segue o celular)
  const styles = useStyles();

  // Carrega as fontes Geist antes de mostrar a interface
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
  });

  // Enquanto as fontes carregam (fração de segundo), a splash continua na tela
  if (!fontsLoaded) {
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
            // Barra de abas em cima, logo abaixo do logo (como no design atual)
            tabBarPosition: 'top',
            headerShown: false,
            // Transição suave entre abas (antes era uma animação feita à mão)
            animation: 'fade',
            sceneStyle: styles.scene,
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Pace' }} />
          <Tabs.Screen name="time" options={{ title: 'Tempo' }} />
          <Tabs.Screen name="table" options={{ title: 'Tabela' }} />
          <Tabs.Screen name="history" options={{ title: 'Histórico' }} />
        </Tabs>
      </SafeAreaView>
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
