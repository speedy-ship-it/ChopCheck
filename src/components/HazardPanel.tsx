import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { HazardInfo } from '../data/types';

interface Props {
  hazards: HazardInfo;
  isElectrified: boolean;
}

interface SectionProps {
  title: string;
  accentColor: string;
  children: React.ReactNode;
}

function Section({ title, accentColor, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionBar, { backgroundColor: accentColor }]} />
      <View style={styles.sectionContent}>
        <Text style={[styles.sectionTitle, { color: accentColor }]}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

export default function HazardPanel({ hazards, isElectrified: electrified }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header / toggle */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Collapse hazard panel' : 'Expand hazard panel'}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.headerIcon}>⚠️</Text>
        <Text style={styles.headerTitle}>HAZARD WARNINGS</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* HV alert banner — always visible when electrified */}
      {electrified && (
        <View style={styles.hvBanner}>
          <Text style={styles.hvBannerText}>
            ⚡ HIGH VOLTAGE VEHICLE — De-energise before cutting near orange cables
          </Text>
        </View>
      )}

      {expanded && (
        <ScrollView style={styles.body} scrollEnabled={false}>
          {/* Airbags */}
          {hazards.airbags.length > 0 && (
            <Section title="AIRBAG LOCATIONS" accentColor="#EAB308">
              {hazards.airbags.map((a, i) => (
                <BulletItem
                  key={i}
                  text={`${a.type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}: ${a.location}`}
                />
              ))}
            </Section>
          )}

          {/* HV Cables */}
          {hazards.hvCables && hazards.hvCables.length > 0 && (
            <Section title="HIGH-VOLTAGE CABLES" accentColor="#EF4444">
              {hazards.hvCables.map((hv, i) => (
                <View key={i} style={styles.hvEntry}>
                  <Text style={styles.hvRoute}>Route: {hv.route}</Text>
                  <Text style={styles.hvVoltage}>{hv.voltage} V nominal</Text>
                  <Text style={styles.hvWarning}>{hv.warning}</Text>
                </View>
              ))}
            </Section>
          )}

          {/* Fuel Lines */}
          {hazards.fuelLines.length > 0 && (
            <Section title="FUEL LINE LOCATIONS" accentColor="#F97316">
              {hazards.fuelLines.map((fl, i) => (
                <BulletItem key={i} text={fl} />
              ))}
            </Section>
          )}

          {/* Boron / UHSS */}
          {hazards.boronZones.length > 0 && (
            <Section title="BORON / UHSS STEEL ZONES" accentColor="#A78BFA">
              {hazards.boronZones.map((b, i) => (
                <BulletItem key={i} text={b} />
              ))}
            </Section>
          )}

          {/* Pressurized */}
          {hazards.pressurized.length > 0 && (
            <Section title="PRESSURIZED COMPONENTS" accentColor="#38BDF8">
              {hazards.pressurized.map((p, i) => (
                <BulletItem key={i} text={p} />
              ))}
            </Section>
          )}

          {/* Notes */}
          {hazards.notes && hazards.notes.length > 0 && (
            <Section title="ADDITIONAL NOTES" accentColor="#94A3B8">
              {hazards.notes.map((n, i) => (
                <BulletItem key={i} text={n} />
              ))}
            </Section>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    borderTopWidth: 2,
    borderTopColor: '#EF4444',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    minHeight: 52,
  },
  headerIcon: {
    fontSize: 18,
  },
  headerTitle: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  chevron: {
    color: '#94A3B8',
    fontSize: 12,
  },
  hvBanner: {
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EF4444',
  },
  hvBannerText: {
    color: '#FEE2E2',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    maxHeight: 420,
  },
  section: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  sectionBar: {
    width: 4,
  },
  sectionContent: {
    flex: 1,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 5,
  },
  bullet: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
  hvEntry: {
    marginBottom: 10,
    backgroundColor: '#1C1917',
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  hvRoute: {
    color: '#F1F5F9',
    fontSize: 12,
    marginBottom: 2,
  },
  hvVoltage: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  hvWarning: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 17,
  },
});
