/**
 * Cascading vehicle picker: Make → Model → Year.
 * Fully offline — reads from the bundled vehicle database.
 * Large tap targets for gloved-hand use.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { getUniqueMakes, getModelsForMake, getYearsForMakeModel } from '../data/vehicles';

interface Props {
  onSelect: (make: string, model: string, year: number) => void;
}

type Step = 'make' | 'model' | 'year';

interface OptionSheetProps {
  title: string;
  options: string[];
  onSelect: (val: string) => void;
  onClose: () => void;
  filterEnabled?: boolean;
}

function OptionSheet({ title, options, onSelect, onClose, filterEnabled }: OptionSheetProps) {
  const [filter, setFilter] = useState('');
  const filtered = filterEnabled
    ? options.filter((o) => o.toLowerCase().includes(filter.toLowerCase()))
    : options;

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetOverlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.sheetCloseBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.sheetCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {filterEnabled && (
            <TextInput
              style={styles.sheetFilter}
              placeholder="Search…"
              placeholderTextColor="#475569"
              value={filter}
              onChangeText={setFilter}
              autoFocus
            />
          )}

          <ScrollView>
            {filtered.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.sheetItem}
                onPress={() => { onSelect(opt); onClose(); }}
                accessibilityRole="button"
              >
                <Text style={styles.sheetItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            {filtered.length === 0 && (
              <Text style={styles.emptyText}>No results</Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function VehiclePicker({ onSelect }: Props) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [openSheet, setOpenSheet] = useState<Step | null>(null);

  const makes = getUniqueMakes();
  const models = make ? getModelsForMake(make) : [];
  const years = make && model ? getYearsForMakeModel(make, model).map(String) : [];

  const handleMakeSelect = useCallback((val: string) => {
    setMake(val);
    setModel('');
    setYear(null);
  }, []);

  const handleModelSelect = useCallback((val: string) => {
    setModel(val);
    setYear(null);
  }, []);

  const handleYearSelect = useCallback((val: string) => {
    setYear(Number(val));
  }, []);

  const handleLookup = useCallback(() => {
    if (make && model && year) onSelect(make, model, year);
  }, [make, model, year, onSelect]);

  const ready = Boolean(make && model && year);

  return (
    <View style={styles.container}>
      {/* Make */}
      <TouchableOpacity
        style={styles.dropdownBtn}
        onPress={() => setOpenSheet('make')}
        accessibilityRole="button"
        accessibilityLabel="Select make"
      >
        <Text style={make ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {make || 'Select Make'}
        </Text>
        <Text style={styles.dropdownChevron}>▼</Text>
      </TouchableOpacity>

      {/* Model */}
      <TouchableOpacity
        style={[styles.dropdownBtn, !make && styles.dropdownBtnDisabled]}
        onPress={() => make && setOpenSheet('model')}
        disabled={!make}
        accessibilityRole="button"
        accessibilityLabel="Select model"
      >
        <Text style={model ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {model || 'Select Model'}
        </Text>
        <Text style={styles.dropdownChevron}>▼</Text>
      </TouchableOpacity>

      {/* Year */}
      <TouchableOpacity
        style={[styles.dropdownBtn, !model && styles.dropdownBtnDisabled]}
        onPress={() => model && setOpenSheet('year')}
        disabled={!model}
        accessibilityRole="button"
        accessibilityLabel="Select year"
      >
        <Text style={year ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {year ? String(year) : 'Select Year'}
        </Text>
        <Text style={styles.dropdownChevron}>▼</Text>
      </TouchableOpacity>

      {/* Lookup button */}
      <TouchableOpacity
        style={[styles.lookupBtn, !ready && styles.lookupBtnDisabled]}
        onPress={handleLookup}
        disabled={!ready}
        accessibilityRole="button"
        accessibilityLabel="Look up vehicle"
      >
        <Text style={styles.lookupBtnText}>Look Up Vehicle</Text>
      </TouchableOpacity>

      {/* Option sheets */}
      {openSheet === 'make' && (
        <OptionSheet
          title="Select Make"
          options={makes}
          onSelect={handleMakeSelect}
          onClose={() => setOpenSheet(null)}
          filterEnabled
        />
      )}
      {openSheet === 'model' && (
        <OptionSheet
          title="Select Model"
          options={models}
          onSelect={handleModelSelect}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'year' && (
        <OptionSheet
          title="Select Year"
          options={years}
          onSelect={handleYearSelect}
          onClose={() => setOpenSheet(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 56,
  },
  dropdownBtnDisabled: {
    opacity: 0.4,
  },
  dropdownValue: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    color: '#64748B',
    fontSize: 16,
  },
  dropdownChevron: {
    color: '#64748B',
    fontSize: 12,
  },
  lookupBtn: {
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
    marginTop: 4,
  },
  lookupBtnDisabled: {
    backgroundColor: '#431407',
    opacity: 0.5,
  },
  lookupBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '75%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sheetTitle: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 17,
    fontWeight: '700',
  },
  sheetCloseBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseText: {
    color: '#94A3B8',
    fontSize: 18,
  },
  sheetFilter: {
    backgroundColor: '#0F172A',
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F1F5F9',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sheetItem: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    minHeight: 56,
    justifyContent: 'center',
  },
  sheetItemText: {
    color: '#F1F5F9',
    fontSize: 16,
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
    padding: 24,
  },
});
