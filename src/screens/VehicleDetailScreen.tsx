/**
 * VehicleDetailScreen — core rescue information screen.
 * Shows: EV badge, SVG cutting-zone diagram (side/top/front/rear tabs),
 * hazard panel, and zone legend.
 * Diagram render target: < 2 s (SVG is in-memory; no file I/O).
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../data/types';
import { isElectrified } from '../data/types';
import type { DiagramView, VehicleDiagram } from '../data/types';
import { findVehicleById } from '../data/vehicles';
import CuttingZoneDiagram from '../components/CuttingZoneDiagram';
import HazardPanel from '../components/HazardPanel';
import ZoneLegend from '../components/ZoneLegend';
import EVBadge from '../components/EVBadge';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const VIEW_ORDER: DiagramView[] = ['side', 'top', 'front', 'rear'];
const VIEW_LABEL: Record<DiagramView, string> = {
  side: 'Side',
  top: 'Top',
  front: 'Front',
  rear: 'Rear',
};

export default function VehicleDetailScreen() {
  const route = useRoute<Props['route']>();
  const navigation = useNavigation<Nav>();
  const { vehicleId, year } = route.params;

  const vehicle = findVehicleById(vehicleId);
  const [activeView, setActiveView] = useState<DiagramView>('side');

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Vehicle not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const availableViews = vehicle.diagrams.map((d) => d.view);
  const diagram: VehicleDiagram | undefined = vehicle.diagrams.find(
    (d) => d.view === activeView,
  ) ?? vehicle.diagrams[0];

  const electrified = isElectrified(vehicle.propulsion);

  const handleViewSelect = useCallback((view: DiagramView) => {
    setActiveView(view);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
        {/* Sticky header */}
        <View style={styles.stickyHeader}>
          {/* Back button + vehicle name */}
          <View style={styles.titleRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backIconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <View style={styles.titleBlock}>
              <Text style={styles.vehicleName} numberOfLines={1}>
                {year} {vehicle.make} {vehicle.model}
              </Text>
              <EVBadge propulsion={vehicle.propulsion} />
            </View>
          </View>

          {/* View tabs */}
          {availableViews.length > 1 && (
            <View style={styles.tabRow}>
              {VIEW_ORDER.filter((v) => availableViews.includes(v)).map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.tab, activeView === v && styles.tabActive]}
                  onPress={() => handleViewSelect(v)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activeView === v }}
                >
                  <Text style={[styles.tabText, activeView === v && styles.tabTextActive]}>
                    {VIEW_LABEL[v]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Cutting zone diagram */}
        {diagram && (
          <CuttingZoneDiagram
            diagram={diagram}
            propulsion={vehicle.propulsion}
          />
        )}

        {/* Legend */}
        <ZoneLegend />

        {/* Hazard panel */}
        <HazardPanel hazards={vehicle.hazards} isElectrified={electrified} />

        <View style={styles.footer} />
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
  stickyHeader: {
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  backIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#F97316',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  vehicleName: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    minWidth: 60,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#F97316',
  },
  tabText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
  },
  footer: {
    height: 40,
  },
  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    color: '#94A3B8',
    fontSize: 16,
  },
  backBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
  },
});
