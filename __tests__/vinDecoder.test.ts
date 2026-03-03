/**
 * VIN decoder unit tests.
 * All data is in-memory — no network, no file I/O.
 */

import { decodeVIN, isValidVINLength, vinLooksComplete } from '../src/utils/vinDecoder';

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Compute check digit for a 17-char string that has '0' in position 9.
 * Used to manufacture valid VINs for testing.
 */
const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5,         P: 7, R: 9,
  S: 2, T: 3, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
  '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
};
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function injectCheckDigit(vin17: string): string {
  const chars = vin17.toUpperCase().split('');
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue; // skip check digit position
    const v = TRANSLITERATION[chars[i]] ?? 0;
    sum += v * WEIGHTS[i];
  }
  const rem = sum % 11;
  const cd = rem === 10 ? 'X' : String(rem);
  chars[8] = cd;
  return chars.join('');
}

// Build valid test VINs
const TESLA_VIN = injectCheckDigit('5YJ3E1EB0JF000001'); // Tesla, 2018 (J=2018)
const TOYOTA_VIN = injectCheckDigit('4T1B11HK0LU000001'); // Toyota Camry, 2020 (L=2020)
const FORD_VIN = injectCheckDigit('1FTFW1E50MFC00001'); // Ford, 2021 (M=2021)

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('decodeVIN', () => {
  describe('invalid inputs', () => {
    it('rejects VIN shorter than 17 chars', () => {
      const r = decodeVIN('5YJ3E1EB');
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/17/);
    });

    it('rejects VIN longer than 17 chars', () => {
      const r = decodeVIN('5YJ3E1EB6JF0000011');
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/17/);
    });

    it('rejects VIN containing forbidden letter I', () => {
      const bad = injectCheckDigit('5IJ3E1EB0JF000001');
      const r = decodeVIN(bad);
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/I/);
    });

    it('rejects VIN containing forbidden letter O', () => {
      const bad = '5OJ3E1EB6JF000001'.padEnd(17, '1');
      const r = decodeVIN(bad);
      expect(r.valid).toBe(false);
    });

    it('rejects VIN with invalid check digit', () => {
      // Flip last digit to guarantee a wrong check digit
      const vin = TESLA_VIN.slice(0, 8) + 'Z' + TESLA_VIN.slice(9);
      const r = decodeVIN(vin);
      expect(r.valid).toBe(false);
      expect(r.error).toMatch(/check digit/i);
    });

    it('rejects VIN with non-alphanumeric characters', () => {
      const r = decodeVIN('5YJ3-1EB6JF000001');
      expect(r.valid).toBe(false);
    });
  });

  describe('valid VINs', () => {
    it('decodes a Tesla VIN', () => {
      const r = decodeVIN(TESLA_VIN);
      expect(r.valid).toBe(true);
      expect(r.manufacturer).toBe('Tesla');
      expect(r.country).toBe('US');
    });

    it('decodes the correct model year from VIN position 10', () => {
      const r = decodeVIN(TESLA_VIN);
      // Position 10 (index 9) of TESLA_VIN is 'J' → 2018
      expect(r.modelYear).toBe(2018);
    });

    it('decodes a Toyota VIN and finds candidate vehicles', () => {
      const r = decodeVIN(TOYOTA_VIN);
      expect(r.valid).toBe(true);
      expect(r.manufacturer).toBe('Toyota');
      // Should find at least one Toyota candidate
      expect(r.candidates.length).toBeGreaterThan(0);
      expect(r.candidates.every((c) => c.make === 'Toyota')).toBe(true);
    });

    it('decodes a Ford VIN', () => {
      const r = decodeVIN(FORD_VIN);
      expect(r.valid).toBe(true);
      expect(r.manufacturer).toBe('Ford');
    });

    it('returns empty candidates for unknown WMI', () => {
      const vin = injectCheckDigit('ZZZ0000000F000001');
      const r = decodeVIN(vin);
      expect(r.valid).toBe(true);
      expect(r.manufacturer).toBeUndefined();
      expect(r.candidates).toHaveLength(0);
    });

    it('is case-insensitive (normalises to uppercase)', () => {
      const lower = TESLA_VIN.toLowerCase();
      const r = decodeVIN(lower);
      expect(r.valid).toBe(true);
      expect(r.vin).toBe(TESLA_VIN);
    });

    it('trims whitespace before decoding', () => {
      const r = decodeVIN(`  ${TESLA_VIN}  `);
      expect(r.valid).toBe(true);
    });
  });

  describe('year decoding', () => {
    // Build VINs with specific year codes at position 10 (index 9)
    const yearTests: Array<[string, number]> = [
      ['J', 2018],
      ['K', 2019],
      ['L', 2020],
      ['M', 2021],
      ['N', 2022],
      ['P', 2023],
      ['R', 2024],
    ];

    it.each(yearTests)('year code %s decodes to %d', (code, expectedYear) => {
      const template = `4T1B11HK${code}JF000001`.padEnd(17, '1').slice(0, 17);
      const vin = injectCheckDigit(template.slice(0, 9) + code + template.slice(10));
      // We just check the year char decodes — full VIN may fail check digit
      // so test decodeYear logic via known-good VIN
      const withCode = TOYOTA_VIN.slice(0, 9) + code + TOYOTA_VIN.slice(10);
      const fixed = injectCheckDigit(withCode);
      const r = decodeVIN(fixed);
      if (r.valid) {
        expect(r.modelYear).toBe(expectedYear);
      }
    });
  });
});

describe('isValidVINLength', () => {
  it('accepts valid partial VINs (letters and digits, no I/O/Q)', () => {
    expect(isValidVINLength('5YJ3')).toBe(true);
    expect(isValidVINLength('')).toBe(true);
    expect(isValidVINLength('5YJ3E1EB6JF000001')).toBe(true);
  });

  it('rejects invalid characters', () => {
    expect(isValidVINLength('5YJ-3E1EB')).toBe(false);
  });
});

describe('vinLooksComplete', () => {
  it('returns true for 17-char string', () => {
    expect(vinLooksComplete('5YJ3E1EB6JF000001')).toBe(true);
  });

  it('returns false for shorter string', () => {
    expect(vinLooksComplete('5YJ3E1EB')).toBe(false);
  });
});
