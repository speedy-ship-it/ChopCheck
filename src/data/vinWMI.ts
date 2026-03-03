/**
 * Offline VIN lookup tables — bundled at install, zero network required.
 *
 * WMI (World Manufacturer Identifier) = first 3 chars of a 17-char VIN.
 * Some manufacturers use 8-char WMIs (chars 1–3 = "000" + chars 4–8).
 */

export interface WMIEntry {
  manufacturer: string;
  country: string;
}

/** WMI → {manufacturer, country} */
export const WMI_TABLE: Record<string, WMIEntry> = {
  // Toyota (US / Japan)
  '1N4': { manufacturer: 'Nissan', country: 'US' },
  '4T1': { manufacturer: 'Toyota', country: 'US' },
  '4T3': { manufacturer: 'Toyota', country: 'US' },
  '5YF': { manufacturer: 'Toyota', country: 'US' },
  JTD: { manufacturer: 'Toyota', country: 'Japan' },
  JTE: { manufacturer: 'Toyota', country: 'Japan' },
  JTM: { manufacturer: 'Toyota', country: 'Japan' },
  // Toyota Prius (US)
  JTG: { manufacturer: 'Toyota', country: 'Japan' },
  // Toyota Canada
  '2T1': { manufacturer: 'Toyota', country: 'Canada' },
  '2T3': { manufacturer: 'Toyota', country: 'Canada' },
  // Tesla
  '5YJ': { manufacturer: 'Tesla', country: 'US' },
  '7SA': { manufacturer: 'Tesla', country: 'US' },
  SFZ: { manufacturer: 'Tesla', country: 'UK' },
  XP0: { manufacturer: 'Tesla', country: 'Netherlands' },
  // Ford
  '1FA': { manufacturer: 'Ford', country: 'US' },
  '1FB': { manufacturer: 'Ford', country: 'US' },
  '1FT': { manufacturer: 'Ford', country: 'US' },
  '2FA': { manufacturer: 'Ford', country: 'Canada' },
  '2FT': { manufacturer: 'Ford', country: 'Canada' },
  '3FA': { manufacturer: 'Ford', country: 'Mexico' },
  '3FT': { manufacturer: 'Ford', country: 'Mexico' },
  WF0: { manufacturer: 'Ford', country: 'Germany' },
  // Honda
  '1HG': { manufacturer: 'Honda', country: 'US' },
  '2HG': { manufacturer: 'Honda', country: 'Canada' },
  '5J6': { manufacturer: 'Honda', country: 'US' },
  '5FN': { manufacturer: 'Honda', country: 'US' },
  JHM: { manufacturer: 'Honda', country: 'Japan' },
  // Chevrolet / GMC
  '1GC': { manufacturer: 'Chevrolet', country: 'US' },
  '1GM': { manufacturer: 'GMC', country: 'US' },
  '2GC': { manufacturer: 'Chevrolet', country: 'Canada' },
  '1G1': { manufacturer: 'Chevrolet', country: 'US' },
  '2G1': { manufacturer: 'Chevrolet', country: 'Canada' },
  KL8: { manufacturer: 'Chevrolet', country: 'South Korea' },
  // BMW
  WBA: { manufacturer: 'BMW', country: 'Germany' },
  WBS: { manufacturer: 'BMW M', country: 'Germany' },
  '5UM': { manufacturer: 'BMW', country: 'US' },
  // Mercedes-Benz
  WDB: { manufacturer: 'Mercedes-Benz', country: 'Germany' },
  WDD: { manufacturer: 'Mercedes-Benz', country: 'Germany' },
  '4JG': { manufacturer: 'Mercedes-Benz', country: 'US' },
  // Nissan
  JN1: { manufacturer: 'Nissan', country: 'Japan' },
  JN8: { manufacturer: 'Nissan', country: 'Japan' },
  '5N1': { manufacturer: 'Nissan', country: 'US' },
  '3N1': { manufacturer: 'Nissan', country: 'Mexico' },
  // Hyundai / Kia
  KMH: { manufacturer: 'Hyundai', country: 'South Korea' },
  '5NP': { manufacturer: 'Hyundai', country: 'US' },
  KNA: { manufacturer: 'Kia', country: 'South Korea' },
  '5XX': { manufacturer: 'Kia', country: 'US' },
  // Subaru
  JF1: { manufacturer: 'Subaru', country: 'Japan' },
  JF2: { manufacturer: 'Subaru', country: 'Japan' },
  '4S3': { manufacturer: 'Subaru', country: 'US' },
  // Mazda
  JM1: { manufacturer: 'Mazda', country: 'Japan' },
  JM3: { manufacturer: 'Mazda', country: 'Japan' },
  // Volkswagen
  '1VW': { manufacturer: 'Volkswagen', country: 'US' },
  WVW: { manufacturer: 'Volkswagen', country: 'Germany' },
  '3VW': { manufacturer: 'Volkswagen', country: 'Mexico' },
  // Audi
  WAU: { manufacturer: 'Audi', country: 'Germany' },
  TRU: { manufacturer: 'Audi', country: 'Hungary' },
  // Dodge / Chrysler / RAM
  '1C3': { manufacturer: 'Chrysler', country: 'US' },
  '1C4': { manufacturer: 'Chrysler', country: 'US' },
  '2C3': { manufacturer: 'Chrysler', country: 'Canada' },
  '3C6': { manufacturer: 'RAM', country: 'Mexico' },
  // Jeep
  '1J4': { manufacturer: 'Jeep', country: 'US' },
  '1C6': { manufacturer: 'RAM', country: 'US' },
  // Volvo
  YV1: { manufacturer: 'Volvo', country: 'Sweden' },
  YV4: { manufacturer: 'Volvo', country: 'Sweden' },
  // Lexus
  JTH: { manufacturer: 'Lexus', country: 'Japan' },
  JTJ: { manufacturer: 'Lexus', country: 'Japan' },
  '2T2': { manufacturer: 'Lexus', country: 'Canada' },
};

/**
 * VIN position 10 encodes the model year.
 * Letters I, O, Q, U, Z and digit 0 are never used.
 */
export const VIN_YEAR_MAP: Record<string, number> = {
  A: 1980, B: 1981, C: 1982, D: 1983, E: 1984, F: 1985,
  G: 1986, H: 1987, J: 1988, K: 1989, L: 1990, M: 1991,
  N: 1992, P: 1993, R: 1994, S: 1995, T: 1996, V: 1997,
  W: 1998, X: 1999, Y: 2000,
  '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
  '6': 2006, '7': 2007, '8': 2008, '9': 2009,
  // Second cycle (2010+)
  a: 2010, // uppercase in VINs — kept for safety
  // Uppercase cycle 2010+
  // The VIN standard resumes the letter cycle from A=2010
};

// VIN year map for 2010–2039 (same letters cycle again)
const YEAR_LETTERS_2010 = 'ABCDEFGHJKLMNPRSTUVWXY123456789';
for (let i = 0; i < YEAR_LETTERS_2010.length; i++) {
  VIN_YEAR_MAP[YEAR_LETTERS_2010[i]] = VIN_YEAR_MAP[YEAR_LETTERS_2010[i]] ?? (2010 + i);
}
// Override: the cycle restarts at A=2010
const YEAR_LETTERS = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y',
                      '1','2','3','4','5','6','7','8','9'];
YEAR_LETTERS.forEach((ch, idx) => {
  // 1980-based (first full cycle)
  VIN_YEAR_MAP[ch] = 1980 + idx;
});
// The same letters start again at 2010 — so we track which cycle applies by the decade.
// decodeVinYear() handles dual-cycle disambiguation.
export const VIN_YEAR_2010: Record<string, number> = {};
YEAR_LETTERS.forEach((ch, idx) => {
  VIN_YEAR_2010[ch] = 2010 + idx;
});
