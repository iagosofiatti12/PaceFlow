import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

type TabKey = 'pace' | 'time' | 'table' | 'history';

interface Tab {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface TabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { key: 'pace', label: 'Pace', icon: 'speedometer-outline' },
    { key: 'time', label: 'Tempo', icon: 'time-outline' },
    { key: 'table', label: 'Tabela', icon: 'list-outline' },
    { key: 'history', label: 'Histórico', icon: 'archive-outline' },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          onPress={() => onTabChange(tab.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.key }}
          accessibilityLabel={`Aba ${tab.label}`}
        >
          <Ionicons
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? COLORS.primary : COLORS.text.light}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
            {tab.label}
          </Text>
          {activeTab === tab.key && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    flex: 1,
    paddingVertical: SPACING.xs,
    position: 'relative',
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    elevation: 4,
    flexDirection: 'row',
    marginBottom: 0,
    marginHorizontal: SPACING.lg,
    padding: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabIndicator: {
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    bottom: SPACING.xs,
    height: 3,
    position: 'absolute',
    width: 32,
  },
  tabText: {
    color: COLORS.text.tertiary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
});

export default TabBar;
