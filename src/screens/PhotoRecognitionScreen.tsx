/**
 * PhotoRecognitionScreen — on-device vehicle identification from photo.
 *
 * v1 STUB: The ML model integration is a spike item (see SPIKE.md).
 * This screen ships the complete UX flow — confidence display, fallback
 * to manual — so it is ready to wire up whichever on-device framework
 * (Core ML, TensorFlow Lite, ONNX Runtime) wins the spike evaluation.
 *
 * The model interface is isolated behind VehicleClassifier so the rest of
 * the screen does not change when the spike is resolved.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../data/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── ML model interface (to be implemented post-spike) ─────────────────────────

export interface ClassificationResult {
  make: string;
  model: string;
  yearMin: number;
  yearMax: number;
  confidence: number; // 0–1
  vehicleId?: string;
}

/**
 * VehicleClassifier — thin wrapper around the on-device ML model.
 * Replace the stub implementation below with real inference once the
 * spike selects a framework.
 *
 * @param imageUri  Local file URI from camera roll / camera capture
 * @returns         Array of top-k predictions, sorted by confidence desc
 */
async function runVehicleClassifier(
  _imageUri: string,
): Promise<ClassificationResult[]> {
  // SPIKE STUB: simulates a ~800 ms model inference delay.
  // Replace with: CoreML inference (iOS) / TFLite (Android) / ONNX Runtime (both).
  await new Promise((r) => setTimeout(r, 850));

  // Return a stub result so the UX can be reviewed without a real model.
  return [
    {
      make: 'Toyota',
      model: 'Camry',
      yearMin: 2018,
      yearMax: 2023,
      confidence: 0.78,
      vehicleId: 'toyota-camry-2018-2023',
    },
    {
      make: 'Honda',
      model: 'Accord',
      yearMin: 2018,
      yearMax: 2022,
      confidence: 0.14,
    },
  ];
}

// ─── Confidence indicator ─────────────────────────────────────────────────────

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? '#22C55E' : pct >= 40 ? '#EAB308' : '#EF4444';
  return (
    <View style={styles.confRow}>
      <View style={styles.confTrack}>
        <View style={[styles.confFill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[styles.confPct, { color }]}>{pct}%</Text>
    </View>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({
  result,
  onConfirm,
  isTop,
}: {
  result: ClassificationResult;
  onConfirm: () => void;
  isTop: boolean;
}) {
  return (
    <View style={[styles.resultCard, isTop && styles.resultCardTop]}>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>
          {result.yearMin}–{result.yearMax} {result.make} {result.model}
        </Text>
        <ConfidenceBar value={result.confidence} />
      </View>
      {result.vehicleId ? (
        <TouchableOpacity
          style={[styles.confirmBtn, isTop && styles.confirmBtnPrimary]}
          onPress={onConfirm}
          accessibilityRole="button"
          accessibilityLabel={`Confirm ${result.make} ${result.model}`}
        >
          <Text style={[styles.confirmBtnText, isTop && styles.confirmBtnTextPrimary]}>
            {isTop ? 'Confirm' : 'Select'}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noDbText}>Not in DB</Text>
      )}
    </View>
  );
}

// ─── Image picker helper ──────────────────────────────────────────────────────

let ImagePicker: any = null;
try {
  ImagePicker = require('expo-image-picker');
} catch {
  ImagePicker = null;
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function PhotoRecognitionScreen() {
  const navigation = useNavigation<Nav>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClassificationResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = useCallback(async (fromCamera: boolean) => {
    if (!ImagePicker) {
      setError('Image picker not available on this platform.');
      return;
    }

    try {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (perm.status !== 'granted') {
        setError('Permission denied.');
        return;
      }

      const picked = fromCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: false })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.85 });

      if (picked.canceled || !picked.assets?.[0]) return;

      const uri = picked.assets[0].uri;
      setImageUri(uri);
      setResults(null);
      setError(null);
      setLoading(true);

      const preds = await runVehicleClassifier(uri);
      setResults(preds);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error during classification.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConfirm = useCallback(
    (result: ClassificationResult) => {
      if (!result.vehicleId) return;
      navigation.navigate('VehicleDetail', {
        vehicleId: result.vehicleId,
        year: result.yearMax,
      });
    },
    [navigation],
  );

  const handleFallback = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Photo Recognition</Text>
        </View>

        {/* Spike notice */}
        <View style={styles.spikeNotice}>
          <Text style={styles.spikeIcon}>🔬</Text>
          <Text style={styles.spikeText}>
            On-device AI — model framework TBD (spike in progress).
            Results below use a stub classifier for UX validation.
          </Text>
        </View>

        {/* Image preview */}
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}>🚗</Text>
            <Text style={styles.imagePlaceholderText}>No photo selected</Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnCamera]}
            onPress={() => pickImage(true)}
            accessibilityRole="button"
          >
            <Text style={styles.actionBtnIcon}>📷</Text>
            <Text style={styles.actionBtnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnLibrary]}
            onPress={() => pickImage(false)}
            accessibilityRole="button"
          >
            <Text style={styles.actionBtnIcon}>🖼</Text>
            <Text style={styles.actionBtnText}>Photo Library</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#A78BFA" size="large" />
            <Text style={styles.loadingText}>Running on-device classifier…</Text>
          </View>
        )}

        {/* Error */}
        {error && <Text style={styles.errorText}>⚠ {error}</Text>}

        {/* Results */}
        {results && results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsLabel}>CLASSIFICATION RESULTS</Text>
            {results.map((r, i) => (
              <ResultCard
                key={i}
                result={r}
                isTop={i === 0}
                onConfirm={() => handleConfirm(r)}
              />
            ))}

            {/* Confidence warning */}
            {results[0].confidence < 0.6 && (
              <View style={styles.lowConfWarning}>
                <Text style={styles.lowConfText}>
                  ⚠ Low confidence — verify with Manual Lookup before proceeding.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Fallback to manual */}
        <TouchableOpacity
          style={styles.fallbackBtn}
          onPress={handleFallback}
          accessibilityRole="button"
        >
          <Text style={styles.fallbackBtnText}>Switch to Manual Lookup</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scroll: { flex: 1 },
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
  spikeNotice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#1E1B4B',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#A78BFA',
    alignItems: 'flex-start',
  },
  spikeIcon: { fontSize: 18 },
  spikeText: {
    flex: 1,
    color: '#C4B5FD',
    fontSize: 13,
    lineHeight: 18,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#1E293B',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  imagePlaceholderIcon: { fontSize: 40 },
  imagePlaceholderText: { color: '#475569', fontSize: 14 },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 6,
    minHeight: 72,
    justifyContent: 'center',
  },
  actionBtnCamera: {
    backgroundColor: '#2D1B69',
    borderWidth: 1,
    borderColor: '#A78BFA',
  },
  actionBtnLibrary: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtnIcon: { fontSize: 22 },
  actionBtnText: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  loadingText: { color: '#A78BFA', fontSize: 14 },
  errorText: { color: '#EF4444', fontSize: 14 },
  resultsSection: { gap: 10 },
  resultsLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    gap: 12,
    minHeight: 64,
  },
  resultCardTop: {
    borderWidth: 1,
    borderColor: '#A78BFA',
  },
  resultInfo: { flex: 1, gap: 6 },
  resultName: { color: '#F1F5F9', fontSize: 15, fontWeight: '600' },
  confRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confFill: {
    height: '100%',
    borderRadius: 3,
  },
  confPct: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
  confirmBtn: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 70,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  confirmBtnPrimary: {
    backgroundColor: '#A78BFA',
  },
  confirmBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  confirmBtnTextPrimary: {
    color: '#0F172A',
  },
  noDbText: { color: '#475569', fontSize: 12 },
  lowConfWarning: {
    backgroundColor: '#431407',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  lowConfText: { color: '#FCA5A5', fontSize: 13, lineHeight: 18 },
  fallbackBtn: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 54,
    justifyContent: 'center',
  },
  fallbackBtnText: { color: '#94A3B8', fontSize: 15 },
});
