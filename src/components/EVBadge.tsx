import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Propulsion } from '../data/types';
import { isElectrified } from '../data/types';

interface Props {
  propulsion: Propulsion;
}

const LABEL: Record<string, string> = {
  EV: 'EV',
  HEV: 'HYBRID',
  PHEV: 'PHEV',
  FCEV: 'FCEV',
};

const COLOR: Record<string, string> = {
  EV: '#22C55E',
  HEV: '#3B82F6',
  PHEV: '#8B5CF6',
  FCEV: '#06B6D4',
};

export default function EVBadge({ propulsion }: Props) {
  if (!isElectrified(propulsion)) return null;

  return (
    <View style={[styles.badge, { borderColor: COLOR[propulsion] }]}>
      <Text style={[styles.text, { color: COLOR[propulsion] }]}>
        ⚡ {LABEL[propulsion]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
