/**
 * SVG cutting-zone diagram viewer.
 * Renders vehicle body outline + colour-coded zone overlays.
 * Supports zoom-in / zoom-out via +/– buttons (glove-friendly).
 * EV/HV vehicles have rocker-panel and sill zones upgraded to 'avoid'.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import Svg, { Polygon, Rect, Circle, G, Text as SvgText } from 'react-native-svg';
import type { VehicleDiagram, DiagramZone, ZoneStatus } from '../data/types';
import { isElectrified } from '../data/types';
import type { Propulsion } from '../data/types';

// ─── Colour palette ───────────────────────────────────────────────────────────

const STATUS_FILL: Record<ZoneStatus, string> = {
  safe: '#22C55E',
  caution: '#EAB308',
  avoid: '#EF4444',
};
const FILL_OPACITY = 0.55;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function effectiveStatus(zone: DiagramZone, propulsion: Propulsion): ZoneStatus {
  // Rocker/sill zones become 'avoid' on electrified vehicles
  if (
    isElectrified(propulsion) &&
    (zone.id === 'rocker-panel' || zone.id === 'rocker-left' || zone.id === 'rocker-right')
  ) {
    return 'avoid';
  }
  return zone.status;
}

// ─── Zone tooltip modal ───────────────────────────────────────────────────────

interface ZoneModalProps {
  zone: DiagramZone | null;
  status: ZoneStatus | null;
  onClose: () => void;
}

function ZoneModal({ zone, status, onClose }: ZoneModalProps) {
  if (!zone || !status) return null;

  const color = STATUS_FILL[status];
  const label = status === 'safe' ? 'SAFE' : status === 'caution' ? 'CAUTION' : 'AVOID';

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.modalCard, { borderTopColor: color }]}>
          <View style={[styles.modalBadge, { backgroundColor: color }]}>
            <Text style={styles.modalBadgeText}>{label}</Text>
          </View>
          <Text style={styles.modalTitle}>{zone.label}</Text>
          <Text style={styles.modalDesc}>{zone.description}</Text>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

// ─── Zone shape ───────────────────────────────────────────────────────────────

interface ZoneShapeProps {
  zone: DiagramZone;
  status: ZoneStatus;
  onPress: () => void;
}

function ZoneShape({ zone, status, onPress }: ZoneShapeProps) {
  const fill = STATUS_FILL[status];

  if (zone.points) {
    return (
      <Polygon
        points={zone.points}
        fill={fill}
        fillOpacity={FILL_OPACITY}
        stroke={fill}
        strokeWidth={2}
        onPress={onPress}
      />
    );
  }

  if (zone.rect) {
    const [x, y, w, h] = zone.rect;
    return (
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        fillOpacity={FILL_OPACITY}
        stroke={fill}
        strokeWidth={2}
        onPress={onPress}
      />
    );
  }

  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  diagram: VehicleDiagram;
  propulsion: Propulsion;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;

export default function CuttingZoneDiagram({ diagram, propulsion }: Props) {
  const [scale, setScale] = useState(1);
  const [selectedZone, setSelectedZone] = useState<DiagramZone | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ZoneStatus | null>(null);

  const viewBoxParts = diagram.viewBox.split(' ').map(Number);
  const vbWidth = viewBoxParts[2];
  const vbHeight = viewBoxParts[3];

  const baseWidth = SCREEN_WIDTH - 32;
  const aspectRatio = vbHeight / vbWidth;
  const baseHeight = baseWidth * aspectRatio;

  const handleZonePress = useCallback(
    (zone: DiagramZone) => {
      const status = effectiveStatus(zone, propulsion);
      setSelectedZone(zone);
      setSelectedStatus(status);
    },
    [propulsion],
  );

  const zoomIn = () => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE));
  const zoomOut = () => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE));
  const resetZoom = () => setScale(1);

  const svgWidth = baseWidth * scale;
  const svgHeight = baseHeight * scale;

  return (
    <View style={styles.container}>
      {/* Zoom controls */}
      <View style={styles.zoomBar}>
        <TouchableOpacity
          style={[styles.zoomBtn, scale <= MIN_SCALE && styles.zoomBtnDisabled]}
          onPress={zoomOut}
          disabled={scale <= MIN_SCALE}
          accessibilityLabel="Zoom out"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.zoomBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetZoom} style={styles.zoomReset}>
          <Text style={styles.zoomLabel}>{Math.round(scale * 100)}%</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.zoomBtn, scale >= MAX_SCALE && styles.zoomBtnDisabled]}
          onPress={zoomIn}
          disabled={scale >= MAX_SCALE}
          accessibilityLabel="Zoom in"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.zoomBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable diagram area */}
      <ScrollView
        horizontal
        contentContainerStyle={{ minWidth: svgWidth }}
        style={{ maxHeight: svgHeight + 16 }}
      >
        <ScrollView contentContainerStyle={{ minHeight: svgHeight }}>
          <Svg
            width={svgWidth}
            height={svgHeight}
            viewBox={diagram.viewBox}
            style={styles.svg}
          >
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={vbWidth}
              height={vbHeight}
              fill="#0F172A"
            />

            {/* Vehicle body outline */}
            <Polygon
              points={diagram.bodyOutline}
              fill="#1E293B"
              stroke="#475569"
              strokeWidth={2}
            />

            {/* Wheels */}
            {diagram.wheels?.map((w, i) => (
              <G key={i}>
                <Circle cx={w.cx} cy={w.cy} r={w.r} fill="#334155" stroke="#475569" strokeWidth={2} />
                <Circle cx={w.cx} cy={w.cy} r={w.r * 0.45} fill="#1E293B" stroke="#475569" strokeWidth={1} />
              </G>
            ))}

            {/* Zone overlays */}
            {diagram.zones.map((zone) => {
              const status = effectiveStatus(zone, propulsion);
              return (
                <ZoneShape
                  key={zone.id}
                  zone={zone}
                  status={status}
                  onPress={() => handleZonePress(zone)}
                />
              );
            })}

            {/* Zone labels */}
            {diagram.zones.map((zone) => {
              const status = effectiveStatus(zone, propulsion);
              const color = STATUS_FILL[status];
              // Compute label position from centroid
              let cx = 0;
              let cy = 0;
              if (zone.rect) {
                const [x, y, w, h] = zone.rect;
                cx = x + w / 2;
                cy = y + h / 2;
              } else if (zone.points) {
                const pairs = zone.points.trim().split(/\s+/).map((p) => p.split(',').map(Number));
                cx = pairs.reduce((s, [x]) => s + x, 0) / pairs.length;
                cy = pairs.reduce((s, [, y]) => s + y, 0) / pairs.length;
              }
              return (
                <SvgText
                  key={`lbl-${zone.id}`}
                  x={cx}
                  y={cy + 4}
                  fontSize={9}
                  fontWeight="bold"
                  fill={color}
                  textAnchor="middle"
                  opacity={0.9}
                >
                  {zone.label}
                </SvgText>
              );
            })}
          </Svg>
        </ScrollView>
      </ScrollView>

      {/* Tap hint */}
      <Text style={styles.tapHint}>Tap a zone for details</Text>

      {/* Zone detail modal */}
      <ZoneModal
        zone={selectedZone}
        status={selectedStatus}
        onClose={() => { setSelectedZone(null); setSelectedStatus(null); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
  },
  zoomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  zoomBtnDisabled: {
    opacity: 0.35,
  },
  zoomBtnText: {
    color: '#F1F5F9',
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 24,
  },
  zoomReset: {
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  zoomLabel: {
    color: '#94A3B8',
    fontSize: 13,
    minWidth: 40,
    textAlign: 'center',
  },
  svg: {
    alignSelf: 'center',
    margin: 8,
  },
  tapHint: {
    color: '#475569',
    fontSize: 11,
    textAlign: 'center',
    paddingBottom: 6,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderTopWidth: 4,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  modalBadgeText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  modalTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalDesc: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalClose: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  modalCloseText: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
  },
});
