/**
 * Vehicle search and database unit tests.
 */

import { searchVehicles, resolveVehicle, suggestMakes } from '../src/utils/vehicleSearch';
import {
  getUniqueMakes,
  getModelsForMake,
  getYearsForMakeModel,
  findVehicleByMakeModelYear,
  findVehicleById,
  VEHICLES,
} from '../src/data/vehicles';
import { isElectrified } from '../src/data/types';

// ─── Database integrity ────────────────────────────────────────────────────────

describe('VEHICLES database integrity', () => {
  it('has at least 5 vehicles', () => {
    expect(VEHICLES.length).toBeGreaterThanOrEqual(5);
  });

  it('every vehicle has a unique id', () => {
    const ids = VEHICLES.map((v) => v.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every vehicle has at least one diagram', () => {
    for (const v of VEHICLES) {
      expect(v.diagrams.length).toBeGreaterThan(0);
    }
  });

  it('every diagram has zones', () => {
    for (const v of VEHICLES) {
      for (const d of v.diagrams) {
        expect(d.zones.length).toBeGreaterThan(0);
      }
    }
  });

  it('year ranges are valid (start ≤ end)', () => {
    for (const v of VEHICLES) {
      expect(v.years[0]).toBeLessThanOrEqual(v.years[1]);
    }
  });

  it('electrified vehicles have hvCables defined', () => {
    for (const v of VEHICLES) {
      if (isElectrified(v.propulsion)) {
        expect(v.hazards.hvCables).toBeDefined();
        expect((v.hazards.hvCables ?? []).length).toBeGreaterThan(0);
      }
    }
  });

  it('ICE vehicles do not have hvCables', () => {
    for (const v of VEHICLES) {
      if (v.propulsion === 'ICE') {
        const hasHV = v.hazards.hvCables && v.hazards.hvCables.length > 0;
        expect(hasHV).toBeFalsy();
      }
    }
  });
});

// ─── getUniqueMakes ───────────────────────────────────────────────────────────

describe('getUniqueMakes', () => {
  it('returns a sorted, deduplicated list', () => {
    const makes = getUniqueMakes();
    expect(makes.length).toBeGreaterThan(0);
    const sorted = [...makes].sort();
    expect(makes).toEqual(sorted);
    expect(new Set(makes).size).toBe(makes.length);
  });

  it('includes Toyota and Tesla', () => {
    const makes = getUniqueMakes();
    expect(makes).toContain('Toyota');
    expect(makes).toContain('Tesla');
  });
});

// ─── getModelsForMake ─────────────────────────────────────────────────────────

describe('getModelsForMake', () => {
  it('returns models for Toyota', () => {
    const models = getModelsForMake('Toyota');
    expect(models.length).toBeGreaterThan(0);
    expect(models).toContain('Camry');
  });

  it('returns models for Tesla', () => {
    const models = getModelsForMake('Tesla');
    expect(models).toContain('Model 3');
    expect(models).toContain('Model Y');
  });

  it('returns empty array for unknown make', () => {
    expect(getModelsForMake('Faraday')).toHaveLength(0);
  });
});

// ─── getYearsForMakeModel ─────────────────────────────────────────────────────

describe('getYearsForMakeModel', () => {
  it('returns years in descending order for Toyota Camry', () => {
    const years = getYearsForMakeModel('Toyota', 'Camry');
    expect(years.length).toBeGreaterThan(0);
    for (let i = 0; i < years.length - 1; i++) {
      expect(years[i]).toBeGreaterThan(years[i + 1]);
    }
  });

  it('returns empty array for unknown model', () => {
    expect(getYearsForMakeModel('Toyota', 'Supra')).toHaveLength(0);
  });
});

// ─── findVehicleByMakeModelYear ───────────────────────────────────────────────

describe('findVehicleByMakeModelYear', () => {
  it('finds Toyota Camry 2020', () => {
    const v = findVehicleByMakeModelYear('Toyota', 'Camry', 2020);
    expect(v).toBeDefined();
    expect(v?.make).toBe('Toyota');
    expect(v?.model).toBe('Camry');
  });

  it('finds Tesla Model 3 2022', () => {
    const v = findVehicleByMakeModelYear('Tesla', 'Model 3', 2022);
    expect(v).toBeDefined();
    expect(v?.propulsion).toBe('EV');
  });

  it('returns undefined for year out of range', () => {
    const v = findVehicleByMakeModelYear('Toyota', 'Camry', 1990);
    expect(v).toBeUndefined();
  });

  it('returns undefined for unknown make', () => {
    const v = findVehicleByMakeModelYear('Rivian', 'R1T', 2022);
    expect(v).toBeUndefined();
  });
});

// ─── findVehicleById ──────────────────────────────────────────────────────────

describe('findVehicleById', () => {
  it('finds a vehicle by id', () => {
    const v = findVehicleById('tesla-model3-2018-2023');
    expect(v).toBeDefined();
    expect(v?.make).toBe('Tesla');
  });

  it('returns undefined for unknown id', () => {
    expect(findVehicleById('nonexistent-id')).toBeUndefined();
  });
});

// ─── searchVehicles ───────────────────────────────────────────────────────────

describe('searchVehicles', () => {
  it('returns all vehicles with no filters', () => {
    const all = searchVehicles({});
    expect(all.length).toBe(VEHICLES.length);
  });

  it('filters by make', () => {
    const toyotas = searchVehicles({ make: 'Toyota' });
    expect(toyotas.length).toBeGreaterThan(0);
    expect(toyotas.every((v) => v.make === 'Toyota')).toBe(true);
  });

  it('filters by make and model', () => {
    const results = searchVehicles({ make: 'Toyota', model: 'Prius' });
    expect(results.length).toBe(1);
    expect(results[0].model).toBe('Prius');
  });

  it('filters by year', () => {
    const results = searchVehicles({ year: 2022 });
    expect(results.length).toBeGreaterThan(0);
    for (const v of results) {
      expect(v.years[0]).toBeLessThanOrEqual(2022);
      expect(v.years[1]).toBeGreaterThanOrEqual(2022);
    }
  });

  it('returns empty array when no vehicles match', () => {
    const results = searchVehicles({ make: 'Toyota', model: 'Supra' });
    expect(results).toHaveLength(0);
  });
});

// ─── resolveVehicle ────────────────────────────────────────────────────────────

describe('resolveVehicle', () => {
  it('resolves a known vehicle', () => {
    const v = resolveVehicle('Honda', 'CR-V', 2020);
    expect(v).toBeDefined();
    expect(v?.make).toBe('Honda');
  });

  it('returns undefined for an unknown vehicle', () => {
    expect(resolveVehicle('Honda', 'NSX', 2022)).toBeUndefined();
  });
});

// ─── suggestMakes ─────────────────────────────────────────────────────────────

describe('suggestMakes', () => {
  it('returns makes starting with prefix (case-insensitive)', () => {
    const results = suggestMakes('to');
    expect(results).toContain('Toyota');
    expect(results.every((m) => m.toLowerCase().startsWith('to'))).toBe(true);
  });

  it('returns empty for non-matching prefix', () => {
    expect(suggestMakes('zzz')).toHaveLength(0);
  });

  it('returns all makes for empty prefix', () => {
    const all = suggestMakes('');
    expect(all.length).toBe(getUniqueMakes().length);
  });
});
