/**
 * SearchScreen — main entry point.
 * Three identification methods: Manual picker, VIN scan, Photo recognition.
 * Render time target: < 3 s (all data is local; no I/O block).
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VehiclePicker from '../components/VehiclePicker';
import type { RootStackParamList } from '../data/types';
import { findVehicleByMakeModelYear } from '../data/vehicles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Search'>;

function MethodCard({
  icon,
  title,
  subtitle,
  onPress,
  accent,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  accent: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.methodCard, { borderLeftColor: accent }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      activeOpacity={0.75}
    >
      <Text style={styles.methodIcon}>{icon}</Text>
      <View style={styles.methodText}>
        <Text style={styles.methodTitle}>{title}</Text>
        <Text style={styles.methodSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.methodArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();

  const handleManualSelect = useCallback(
    (make: string, model: string, year: number) => {
      const vehicle = findVehicleByMakeModelYear(make, model, year);
      if (vehicle) {
        navigation.navigate('VehicleDetail', { vehicleId: vehicle.id, year });
      }
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>CHOP CHECK</Text>
          <Text style={styles.tagline}>Rescue cutting zones — offline, instant</Text>
        </View>

        {/* Quick-access method cards */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>IDENTIFY VEHICLE</Text>
          <MethodCard
            icon="📷"
            title="Scan VIN"
            subtitle="Point camera at barcode or enter manually"
            accent="#38BDF8"
            onPress={() => navigation.navigate('VINScan')}
          />
          <MethodCard
            icon="🔍"
            title="Photo Recognition"
            subtitle="On-device AI — identify from photo"
            accent="#A78BFA"
            onPress={() => navigation.navigate('PhotoRecognition')}
          />
        </View>

        {/* Manual picker */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>MANUAL LOOKUP</Text>
          <VehiclePicker onSelect={handleManualSelect} />
        </View>

        {/* Offline badge */}
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineDot}>●</Text>
          <Text style={styles.offlineText}>100% offline — no data transmitted</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 28,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  appName: {
    color: '#F97316',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
  },
  tagline: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  sectionGroup: {
    gap: 12,
  },
  sectionLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    borderLeftWidth: 4,
    gap: 14,
    minHeight: 72,
  },
  methodIcon: {
    fontSize: 26,
  },
  methodText: {
    flex: 1,
  },
  methodTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  methodSubtitle: {
    color: '#64748B',
    fontSize: 13,
  },
  methodArrow: {
    color: '#475569',
    fontSize: 22,
    fontWeight: '300',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  offlineDot: {
    color: '#22C55E',
    fontSize: 10,
  },
  offlineText: {
    color: '#475569',
    fontSize: 12,
  },
});
