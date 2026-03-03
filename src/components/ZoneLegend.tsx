import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ITEMS = [
  { status: 'safe', label: 'Safe to cut', color: '#22C55E' },
  { status: 'caution', label: 'Caution — verify first', color: '#EAB308' },
  { status: 'avoid', label: 'Avoid / Do not cut', color: '#EF4444' },
] as const;

export default function ZoneLegend() {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => (
        <View key={item.status} style={styles.row}>
          <View style={[styles.swatch, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 12,
  },
});
