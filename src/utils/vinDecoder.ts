/**
 * Offline VIN decoder.
 * Decodes a 17-character VIN without any network call.
 * Returns manufacturer, model year, and candidate vehicle matches.
 */

import { WMI_TABLE, VIN_YEAR_MAP, VIN_YEAR_2010, type WMIEntry } from '../data/vinWMI';
import { VEHICLES } from '../data/vehicles';
import type { Vehicle } from '../data/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VINDecodeResult {
  vin: string;
  valid: boolean;
  /** Reason string if invalid */
  error?: string;
  wmi: string;
  manufacturer?: string;
  country?: string;
  /** Decoded model year — may be current or past cycle */
  modelYear?: number;
  /** Candidate vehicles from the bundled database */
  candidates: Vehicle[];
}

// ─── VIN check digit ──────────────────────────────────────────────────────────

const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5,         P: 7, R: 9,
  S: 2, T: 3, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
  '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
};

const POSITION_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function computeCheckDigit(vin: string): string {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i].toUpperCase();
    const val = TRANSLITERATION[char];
    if (val === undefined) return '?';
    sum += val * POSITION_WEIGHTS[i];
  }
  const rem = sum % 11;
  return rem === 10 ? 'X' : String(rem);
}

// ─── Year disambiguation ──────────────────────────────────────────────────────

/**
 * VIN year codes repeat every 30 years.
 * We pick whichever cycle is ≤ current year and most recent.
 */
function decodeYear(yearChar: string): number | undefined {
  const upper = yearChar.toUpperCase();
  const y1980 = VIN_YEAR_MAP[upper];
  const y2010 = VIN_YEAR_2010[upper];

  if (y1980 === undefined) return undefined;

  const currentYear = new Date().getFullYear();

  // Prefer 2010-cycle year if it hasn't exceeded current year + 1
  if (y2010 !== undefined && y2010 <= currentYear + 1) {
    return y2010;
  }
  // Fall back to 1980-cycle
  return y1980 <= currentYear + 1 ? y1980 : undefined;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function decodeVIN(rawVin: string): VINDecodeResult {
  const vin = rawVin.trim().toUpperCase();

  const base: Pick<VINDecodeResult, 'vin' | 'wmi' | 'candidates'> = {
    vin,
    wmi: vin.slice(0, 3),
    candidates: [],
  };

  // Basic format check
  if (vin.length !== 17) {
    return { ...base, valid: false, error: `VIN must be 17 characters (got ${vin.length}).` };
  }
  if (/[IOQ]/.test(vin)) {
    return { ...base, valid: false, error: 'VIN contains invalid characters: I, O, or Q are never used.' };
  }
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return { ...base, valid: false, error: 'VIN contains invalid characters.' };
  }

  // Check digit validation (position 9)
  const expected = computeCheckDigit(vin);
  const actual = vin[8];
  if (actual !== expected && expected !== '?') {
    return {
      ...base,
      valid: false,
      error: `Check digit mismatch (position 9): expected '${expected}', got '${actual}'.`,
    };
  }

  // WMI lookup
  const wmiEntry: WMIEntry | undefined = WMI_TABLE[vin.slice(0, 3)];

  // Model year (position 10, index 9)
  const modelYear = decodeYear(vin[9]);

  // Find candidate vehicles by WMI prefix match
  const candidates = VEHICLES.filter((v) => {
    if (!v.vinPrefixes) return false;
    return v.vinPrefixes.some((pfx) => vin.startsWith(pfx));
  });

  return {
    vin,
    valid: true,
    wmi: vin.slice(0, 3),
    manufacturer: wmiEntry?.manufacturer,
    country: wmiEntry?.country,
    modelYear,
    candidates,
  };
}

/**
 * Quick validity check — useful for real-time UI feedback as user types.
 */
export function isValidVINLength(partial: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{0,17}$/i.test(partial.trim());
}

export function vinLooksComplete(partial: string): boolean {
  return partial.trim().length === 17;
}
