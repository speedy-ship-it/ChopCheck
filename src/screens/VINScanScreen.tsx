/**
 * VINScanScreen — camera-based VIN scanning (barcode) + manual fallback.
 * Barcode scanning is done via expo-barcode-scanner (offline, on-device).
 * On successful decode, navigates directly to VehicleDetailScreen if a
 * single candidate is found, or shows a confirmation/selection step.
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../data/types';
import { decodeVIN, isValidVINLength, vinLooksComplete } from '../utils/vinDecoder';
import type { VINDecodeResult } from '../utils/vinDecoder';
import type { Vehicle } from '../data/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Lazy import the barcode scanner to handle platforms without camera gracefully
let BarCodeScanner: any = null;
try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch {
  BarCodeScanner = null;
}

// ─── Candidate card ───────────────────────────────────────────────────────────

function CandidateCard({
  vehicle,
  year,
  onSelect,
}: {
  vehicle: Vehicle;
  year: number;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity style={styles.candidateCard} onPress={onSelect} activeOpacity={0.75}>
      <View style={styles.candidateInfo}>
        <Text style={styles.candidateName}>
          {year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.candidateProp}>{vehicle.propulsion}</Text>
      </View>
      <Text style={styles.candidateArrow}>›</Text>
    </TouchableOpacity>
  );
}

// ─── Decode result panel ──────────────────────────────────────────────────────

function DecodeResultPanel({
  result,
  onSelectVehicle,
}: {
  result: VINDecodeResult;
  onSelectVehicle: (vehicleId: string, year: number) => void;
}) {
  const year = result.modelYear ?? new Date().getFullYear();

  if (!result.valid) {
    return (
      <View style={styles.resultPanel}>
        <Text style={styles.resultError}>⚠ {result.error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.resultPanel}>
      <View style={styles.resultMeta}>
        <Text style={styles.resultVIN}>{result.vin}</Text>
        {result.manufacturer && (
          <Text style={styles.resultDetail}>
            {result.manufacturer} • {result.country} • {result.modelYear ?? '—'}
          </Text>
        )}
      </View>

      {result.candidates.length === 0 && (
        <Text style={styles.resultNoMatch}>
          No exact database match — use Manual Lookup.
        </Text>
      )}

      {result.candidates.map((v) => (
        <CandidateCard
          key={v.id}
          vehicle={v}
          year={year}
          onSelect={() => onSelectVehicle(v.id, year)}
        />
      ))}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function VINScanScreen() {
  const navigation = useNavigation<Nav>();

  // Camera permission
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Manual / typed VIN
  const [vinText, setVinText] = useState('');
  const [decodeResult, setDecodeResult] = useState<VINDecodeResult | null>(null);

  useEffect(() => {
    if (!BarCodeScanner) return;
    BarCodeScanner.requestPermissionsAsync().then(
      ({ status }: { status: string }) => setHasPermission(status === 'granted'),
    );
  }, []);

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      setScanned(true);
      setCameraMode(false);
      const cleaned = data.trim().toUpperCase();
      setVinText(cleaned);
      setDecodeResult(decodeVIN(cleaned));
    },
    [],
  );

  const handleManualDecode = useCallback(() => {
    const cleaned = vinText.trim().toUpperCase();
    setDecodeResult(decodeVIN(cleaned));
  }, [vinText]);

  const handleVinChange = useCallback((text: string) => {
    const upper = text.toUpperCase();
    if (!isValidVINLength(upper)) return;
    setVinText(upper);
    setDecodeResult(null);
    if (vinLooksComplete(upper)) {
      setDecodeResult(decodeVIN(upper));
    }
  }, []);

  const handleSelectVehicle = useCallback(
    (vehicleId: string, year: number) => {
      navigation.navigate('VehicleDetail', { vehicleId, year });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Camera mode */}
      {cameraMode && BarCodeScanner && (
        <View style={styles.cameraContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code39, BarCodeScanner.Constants.BarCodeType.code128, BarCodeScanner.Constants.BarCodeType.datamatrix]}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Viewfinder overlay */}
          <View style={styles.viewfinderOverlay}>
            <View style={styles.viewfinderBox}>
              <Text style={styles.viewfinderLabel}>Align VIN barcode within frame</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeCameraBtn}
            onPress={() => setCameraMode(false)}
            accessibilityLabel="Close camera"
          >
            <Text style={styles.closeCameraBtnText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {!cameraMode && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>VIN Scan</Text>
          </View>

          {/* Camera scan button */}
          {BarCodeScanner && hasPermission !== false && (
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => { setScanned(false); setCameraMode(true); }}
              accessibilityRole="button"
            >
              <Text style={styles.scanBtnIcon}>📷</Text>
              <Text style={styles.scanBtnText}>Scan VIN Barcode</Text>
            </TouchableOpacity>
          )}

          {hasPermission === false && (
            <Text style={styles.permissionText}>
              Camera access denied — use manual entry below.
            </Text>
          )}

          {!BarCodeScanner && (
            <Text style={styles.permissionText}>
              Camera unavailable on this platform — use manual entry below.
            </Text>
          )}

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or enter manually</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Manual VIN entry */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>VIN (17 characters)</Text>
            <TextInput
              style={styles.vinInput}
              value={vinText}
              onChangeText={handleVinChange}
              placeholder="e.g. 5YJ3E1EB6JF000001"
              placeholderTextColor="#475569"
              maxLength={17}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleManualDecode}
            />
            <Text style={styles.vinCounter}>{vinText.length} / 17</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.decodeBtn,
              vinText.length !== 17 && styles.decodeBtnDisabled,
            ]}
            onPress={handleManualDecode}
            disabled={vinText.length !== 17}
          >
            <Text style={styles.decodeBtnText}>Decode VIN</Text>
          </TouchableOpacity>

          {/* Decode result */}
          {decodeResult && (
            <DecodeResultPanel
              result={decodeResult}
              onSelectVehicle={handleSelectVehicle}
            />
          )}
        </ScrollView>
      )}
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
    gap: 18,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#F97316',
    fontSize: 30,
    fontWeight: '300',
  },
  screenTitle: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '700',
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E4C7A',
    borderRadius: 12,
    paddingVertical: 20,
    gap: 12,
    minHeight: 64,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  scanBtnIcon: {
    fontSize: 24,
  },
  scanBtnText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
  },
  permissionText: {
    color: '#EAB308',
    textAlign: 'center',
    fontSize: 13,
    paddingHorizontal: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },
  dividerText: {
    color: '#475569',
    fontSize: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  vinInput: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#F1F5F9',
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 56,
  },
  vinCounter: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'right',
  },
  decodeBtn: {
    backgroundColor: '#38BDF8',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    minHeight: 58,
    justifyContent: 'center',
  },
  decodeBtnDisabled: {
    opacity: 0.35,
  },
  decodeBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  // Result
  resultPanel: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  resultMeta: {
    gap: 4,
  },
  resultVIN: {
    color: '#F1F5F9',
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  resultDetail: {
    color: '#64748B',
    fontSize: 13,
  },
  resultError: {
    color: '#EF4444',
    fontSize: 14,
    lineHeight: 20,
  },
  resultNoMatch: {
    color: '#94A3B8',
    fontSize: 13,
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 16,
    minHeight: 60,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
  },
  candidateProp: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  candidateArrow: {
    color: '#F97316',
    fontSize: 22,
  },
  // Camera
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewfinderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderBox: {
    width: 300,
    height: 100,
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  viewfinderLabel: {
    color: '#38BDF8',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  closeCameraBtn: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    minHeight: 52,
    justifyContent: 'center',
  },
  closeCameraBtnText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
  },
});
