/**
 * In-memory vehicle search — all data is bundled; zero network required.
 */

import { VEHICLES, findVehicleByMakeModelYear } from '../data/vehicles';
import type { Vehicle } from '../data/types';

export interface SearchFilters {
  make?: string;
  model?: string;
  year?: number;
}

/**
 * Returns vehicles matching all supplied filters.
 * Partial matches allowed: passing only make returns all models for that make.
 */
export function searchVehicles(filters: SearchFilters): Vehicle[] {
  return VEHICLES.filter((v) => {
    if (filters.make && v.make !== filters.make) return false;
    if (filters.model && v.model !== filters.model) return false;
    if (filters.year !== undefined) {
      if (filters.year < v.years[0] || filters.year > v.years[1]) return false;
    }
    return true;
  });
}

/**
 * Resolve a unique vehicle from make + model + year.
 * Returns undefined if no match.
 */
export function resolveVehicle(
  make: string,
  model: string,
  year: number,
): Vehicle | undefined {
  return findVehicleByMakeModelYear(make, model, year);
}

/**
 * Fuzzy-ish make search (case-insensitive prefix match).
 * Used for typeahead in the manual picker.
 */
export function suggestMakes(prefix: string): string[] {
  const lower = prefix.toLowerCase();
  const makes = [...new Set(VEHICLES.map((v) => v.make))];
  return makes.filter((m) => m.toLowerCase().startsWith(lower)).sort();
}
