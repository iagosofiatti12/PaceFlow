import React, { useState, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SPACING } from './src/constants/theme';
import Header from './src/components/Header';
import TabBar from './src/components/TabBar';
import PaceCalculator from './src/components/PaceCalculator';
import TimeCalculator from './src/components/TimeCalculator';
import PaceTable from './src/components/PaceTable';
import HistoryTab from './src/components/HistoryTab';
import type { HistoryItem } from './src/utils/storage';
import type { TabKey } from './src/types';

export default function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>('pace');

  // Item do histórico selecionado, usado para preencher a aba Pace ao restaurar.
  // A prop `key` do PaceCalculator muda junto, forçando o React a recriar o
  // componente já preenchido com os novos valores.
  const [restoredItem, setRestoredItem] = useState<HistoryItem | null>(null);

  // Animação de fade entre abas
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleTabChange = (tab: TabKey): void => {
    // Fade out rápido
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);

      // Saiu da aba Pace? O item restaurado não é mais necessário
      if (tab !== 'pace') {
        setRestoredItem(null);
      }

      // Fade in suave
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSelectHistoryItem = (item: HistoryItem): void => {
    setRestoredItem(item);
    handleTabChange('pace');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header />

        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === 'history' ? (
          <Animated.View style={[styles.tabContent, styles.historyContent, { opacity: fadeAnim }]}>
            <HistoryTab onSelectItem={handleSelectHistoryItem} />
          </Animated.View>
        ) : activeTab === 'table' ? (
          <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
            <PaceTable />
          </Animated.View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
                {activeTab === 'pace' && (
                  <PaceCalculator key={restoredItem?.id ?? 'blank'} initialItem={restoredItem} />
                )}

                {activeTab === 'time' && <TimeCalculator />}
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  historyContent: {
    paddingBottom: SPACING.xl + 20,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  tabContent: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
});
