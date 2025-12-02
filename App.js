import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Image,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';

// Design Tokens
const COLORS = {
  primary: '#E8662E',
  background: '#FAF8F5',
  white: '#FFFFFF',
  text: {
    primary: '#2C2C2C',
    secondary: '#777',
    tertiary: '#999',
    light: '#AAA',
  },
  border: '#E8E8E8',
  input: '#F9F7F4',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const RADIUS = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const FONT_SIZES = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 56,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Função auxiliar para feedback de pace
const getPaceFeedback = (paceInSeconds) => {
  const totalMinutes = paceInSeconds / 60;
  
  if (totalMinutes < 4) return { text: 'Pace de elite! 🏆', color: '#A73E12' };
  if (totalMinutes < 5) return { text: 'Pace avançado! 💪', color: '#D9591E' };
  if (totalMinutes < 6) return { text: 'Pace intermediário! 👏', color: '#EC7A42' };
  if (totalMinutes < 8) return { text: 'Pace iniciante! 🎯', color: '#F29A6A' };
  return { text: 'Continue treinando! 🚀', color: '#f2aa3d3d' };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('pace');
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const formatTimeInput = (value, maxValue) => {
    const num = value.replace(/[^0-9]/g, '');
    if (num === '') return '';
    const numValue = parseInt(num, 10);
    return numValue > maxValue ? maxValue.toString() : num;
  };

  const handleDistanceChange = (value) => {
    // Aceita vírgula e ponto
    const formatted = value.replace(',', '.');
    if (formatted === '' || /^\d*\.?\d*$/.test(formatted)) {
      setDistance(formatted);
    }
  };

  const calculatePace = () => {
    const dist = parseFloat(distance);
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    
    // Validações aprimoradas
    if (!distance || isNaN(dist)) {
      Alert.alert('Atenção', 'Por favor, insira uma distância válida');
      return;
    }
    
    if (dist <= 0 || dist > 500) {
      Alert.alert('Atenção', 'A distância deve estar entre 0.1 e 500 km');
      return;
    }
    
    if (totalSeconds <= 0) {
      Alert.alert('Atenção', 'Por favor, insira um tempo válido');
      return;
    }

    if (totalSeconds > 86400) { // Mais de 24 horas
      Alert.alert('Atenção', 'O tempo deve ser menor que 24 horas');
      return;
    }

    const paceInSeconds = totalSeconds / dist;
    const paceMinutes = Math.floor(paceInSeconds / 60);
    const paceSeconds = Math.floor(paceInSeconds % 60);
    
    setResult(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`);
    setFeedback(getPaceFeedback(paceInSeconds));
  };

  const clearInputs = () => {
    setDistance('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setResult(null);
    setFeedback(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearInputs();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com Logo */}
      <View style={styles.header}>
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logo do aplicativo Pace Calculator"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pace' && styles.tabActive]}
          onPress={() => handleTabChange('pace')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'pace' }}
          accessibilityLabel="Aba Calcular Pace"
        >
          <Text style={[styles.tabText, activeTab === 'pace' && styles.tabTextActive]}>
            Pace
          </Text>
          {activeTab === 'pace' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'time' && styles.tabActive]}
          onPress={() => handleTabChange('time')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'time' }}
          accessibilityLabel="Aba Calcular Tempo"
        >
          <Text style={[styles.tabText, activeTab === 'time' && styles.tabTextActive]}>
            Tempo
          </Text>
          {activeTab === 'time' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'table' && styles.tabActive]}
          onPress={() => handleTabChange('table')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'table' }}
          accessibilityLabel="Aba Tabela de Ritmo"
        >
          <Text style={[styles.tabText, activeTab === 'table' && styles.tabTextActive]}>
            Tabela
          </Text>
          {activeTab === 'table' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'pace' && (
            <View style={styles.calculator}>
              <Text style={styles.sectionTitle}>Calcular Pace</Text>
              <Text style={styles.sectionDescription}>
                Insira a distância e o tempo para descobrir seu ritmo médio
              </Text>

              {/* Distance Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Distância</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={distance}
                    onChangeText={handleDistanceChange}
                    keyboardType="decimal-pad"
                    placeholder="5.0"
                    placeholderTextColor={COLORS.text.light}
                    accessibilityLabel="Campo de distância em quilômetros"
                    accessibilityHint="Digite a distância percorrida"
                  />
                  <Text style={styles.inputUnit}>km</Text>
                </View>
              </View>

              {/* Time Inputs */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tempo Total</Text>
                <View style={styles.timeRow}>
                  <View style={styles.timeBlock}>
                    <TextInput
                      style={styles.timeInput}
                      value={hours}
                      onChangeText={(val) => setHours(formatTimeInput(val, 23))}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={COLORS.text.light}
                      maxLength={2}
                      accessibilityLabel="Horas"
                      accessibilityHint="Digite as horas"
                    />
                    <Text style={styles.timeUnit}>h</Text>
                  </View>
                  
                  <Text style={styles.timeSeparator}>:</Text>
                  
                  <View style={styles.timeBlock}>
                    <TextInput
                      style={styles.timeInput}
                      value={minutes}
                      onChangeText={(val) => setMinutes(formatTimeInput(val, 59))}
                      keyboardType="number-pad"
                      placeholder="00"
                      placeholderTextColor={COLORS.text.light}
                      maxLength={2}
                      accessibilityLabel="Minutos"
                      accessibilityHint="Digite os minutos"
                    />
                    <Text style={styles.timeUnit}>min</Text>
                  </View>
                  
                  <Text style={styles.timeSeparator}>:</Text>
                  
                  <View style={styles.timeBlock}>
                    <TextInput
                      style={styles.timeInput}
                      value={seconds}
                      onChangeText={(val) => setSeconds(formatTimeInput(val, 59))}
                      keyboardType="number-pad"
                      placeholder="00"
                      placeholderTextColor={COLORS.text.light}
                      maxLength={2}
                      accessibilityLabel="Segundos"
                      accessibilityHint="Digite os segundos"
                    />
                    <Text style={styles.timeUnit}>seg</Text>
                  </View>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={calculatePace}
                  accessibilityRole="button"
                  accessibilityLabel="Calcular pace"
                  accessibilityHint="Toque para calcular o pace médio"
                >
                  <Text style={styles.primaryButtonText}>Calcular</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={clearInputs}
                  accessibilityRole="button"
                  accessibilityLabel="Limpar campos"
                  accessibilityHint="Toque para limpar todos os campos"
                >
                  <Text style={styles.secondaryButtonText}>Limpar</Text>
                </TouchableOpacity>
              </View>

              {/* Result */}
              {result && (
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Seu pace médio</Text>
                  <View style={styles.resultValueContainer}>
                    <Text style={styles.resultValue}>{result}</Text>
                    <Text style={styles.resultUnit}>/km</Text>
                  </View>
                  <Text style={styles.resultSubtext}>min por quilômetro</Text>
                  
                  {feedback && (
                    <View style={[styles.feedbackBadge, { backgroundColor: feedback.color }]}>
                      <Text style={styles.feedbackText}>{feedback.text}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {activeTab === 'time' && (
            <View style={styles.calculator}>
              <Text style={styles.sectionTitle}>Calcular Tempo</Text>
              <Text style={styles.sectionDescription}>
                Em breve você poderá calcular o tempo da sua prova 🚀
              </Text>
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonEmoji}>⏱️</Text>
                <Text style={styles.comingSoonText}>Próxima feature</Text>
              </View>
            </View>
          )}

          {activeTab === 'table' && (
            <View style={styles.calculator}>
              <Text style={styles.sectionTitle}>Tabela de Ritmo</Text>
              <Text style={styles.sectionDescription}>
                Em breve a planilha km a km com estratégias de prova 🚀
              </Text>
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonEmoji}>📋</Text>
                <Text style={styles.comingSoonText}>Próxima feature</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 0,
    backgroundColor: COLORS.background,
  },
  logo: {
    width: SCREEN_WIDTH * 0.35, // 35% da largura da tela (responsivo)
    height: 120,
    maxWidth: 140,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: 0,
    borderRadius: RADIUS.lg,
    padding: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.tertiary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: SPACING.xs,
    width: 32,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  calculator: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#444',
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingRight: SPACING.md,
  },
  input: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  inputUnit: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: COLORS.input,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.md,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    width: '100%',
  },
  timeUnit: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.text.tertiary,
    marginTop: 6,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DDD',
    marginHorizontal: SPACING.sm,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  resultLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    opacity: 0.95,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.sm,
  },
  resultValue: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    letterSpacing: -1,
  },
  resultUnit: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg + 7,
    fontWeight: '700',
    marginLeft: SPACING.xs,
    opacity: 0.9,
  },
  resultSubtext: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    opacity: 0.85,
    marginTop: SPACING.xs,
  },
  feedbackBadge: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
  },
  feedbackText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl + SPACING.lg,
  },
  comingSoonEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  comingSoonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.tertiary,
    fontWeight: '600',
  },
});