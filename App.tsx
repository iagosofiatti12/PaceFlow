import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';

// Importar os tokens de design do arquivo separado
import { COLORS, SPACING } from './src/constants/theme';

// Importar componentes separados
import Header from './src/components/Header';
import TabBar from './src/components/TabBar';
import PaceCalculator from './src/components/PaceCalculator';
import TimeCalculator from './src/components/TimeCalculator';
import PaceTable from './src/components/PaceTable';
import HistoryTab from './src/components/HistoryTab';

// Importar helpers
import { getPaceFeedback, paceToSeconds, PaceTableRow } from './src/utils/paceHelpers';
import { saveCalculation, type HistoryItem } from './src/utils/storage';
import type { TabKey, PaceFeedback } from './src/types';

export default function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>('pace');

  // Estados do PaceCalculator
  const [distance, setDistance] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<PaceFeedback | null>(null);

  // Estados do TimeCalculator
  const [timeDistance, setTimeDistance] = useState<string>('');
  const [timePace, setTimePace] = useState<string>('');
  const [timeResult, setTimeResult] = useState<string | null>(null);

  // Estados do PaceTable
  const [tableDistance, setTableDistance] = useState<string>('');
  const [tablePace, setTablePace] = useState<string>('');
  const [paceTable, setPaceTable] = useState<PaceTableRow[] | null>(null);

  // Animação
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const calculatePace = async (paceInSeconds: number, formattedResult: string): Promise<void> => {
    setResult(formattedResult);
    setFeedback(getPaceFeedback(paceInSeconds));

    // Salvar no histórico
    await saveCalculation(distance, hours, minutes, seconds, formattedResult);
  };

  const clearInputs = (): void => {
    // Limpar PaceCalculator
    setDistance('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setResult(null);
    setFeedback(null);

    // Limpar TimeCalculator
    setTimeDistance('');
    setTimePace('');
    setTimeResult(null);

    // Limpar PaceTable
    setTableDistance('');
    setTablePace('');
    setPaceTable(null);
  };

  const handleTabChange = (tab: TabKey, shouldClearInputs: boolean = true): void => {
    // Fade out rápido
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      if (shouldClearInputs) {
        clearInputs();
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
    // Extrair tempo do formato HH:MM:SS
    const [h, m, s] = item.time.split(':');

    setDistance(item.distance);
    setHours(h === '0' ? '' : h);
    setMinutes(m);
    setSeconds(s);
    setResult(item.pace);
    setFeedback(getPaceFeedback(paceToSeconds(item.pace)));

    // Mudar para aba pace sem limpar os campos restaurados
    handleTabChange('pace', false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'history' ? (
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            backgroundColor: COLORS.background,
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.xl + 20,
          }}
        >
          <HistoryTab onSelectItem={handleSelectHistoryItem} />
        </Animated.View>
      ) : activeTab === 'table' ? (
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            backgroundColor: COLORS.background,
          }}
        >
          <PaceTable
            distance={tableDistance}
            setDistance={setTableDistance}
            pace={tablePace}
            setPace={setTablePace}
            table={paceTable}
            onGenerate={setPaceTable}
            onClear={clearInputs}
          />
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
            scrollEnabled={true}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                flex: 1,
                backgroundColor: COLORS.background,
              }}
            >
              {activeTab === 'pace' && (
                <PaceCalculator
                  distance={distance}
                  setDistance={setDistance}
                  hours={hours}
                  setHours={setHours}
                  minutes={minutes}
                  setMinutes={setMinutes}
                  seconds={seconds}
                  setSeconds={setSeconds}
                  result={result}
                  feedback={feedback}
                  onCalculate={calculatePace}
                  onClear={clearInputs}
                />
              )}

              {activeTab === 'time' && (
                <TimeCalculator
                  distance={timeDistance}
                  setDistance={setTimeDistance}
                  pace={timePace}
                  setPace={setTimePace}
                  result={timeResult}
                  onCalculate={setTimeResult}
                  onClear={clearInputs}
                />
              )}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
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
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});
