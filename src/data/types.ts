// ─── Propulsion / Vehicle classification ─────────────────────────────────────

export type Propulsion = 'ICE' | 'HEV' | 'PHEV' | 'EV' | 'FCEV';
export type BodyStyle = 'sedan' | 'suv' | 'truck' | 'van' | 'hatchback' | 'coupe' | 'convertible';

/** Fuel/energy system variant used to drive zone-colour decisions */
export const isElectrified = (p: Propulsion): boolean =>
  p === 'EV' || p === 'HEV' || p === 'PHEV' || p === 'FCEV';

// ─── Hazard data ─────────────────────────────────────────────────────────────

export type AirbagType =
  | 'driver-frontal'
  | 'passenger-frontal'
  | 'side-thorax'
  | 'curtain-side'
  | 'knee'
  | 'rear-curtain'
  | 'center';

export interface AirbagEntry {
  type: AirbagType;
  location: string; // human-readable, e.g. "A-pillar channel, both sides"
}

export interface HVCableRoute {
  route: string; // e.g. "B-pillar interior → rocker panel → battery"
  voltage: number; // nominal volts, e.g. 400
  warning: string;
}

export interface HazardInfo {
  airbags: AirbagEntry[];
  /** Only present on electrified vehicles */
  hvCables?: HVCableRoute[];
  fuelLines: string[]; // descriptive locations
  boronZones: string[]; // UHSS / boron steel locations
  pressurized: string[]; // struts, accumulators, etc.
  notes?: string[]; // free-form warnings
}

// ─── SVG diagram zones ────────────────────────────────────────────────────────

export type ZoneStatus = 'safe' | 'caution' | 'avoid';

export interface DiagramZone {
  id: string;
  label: string;
  status: ZoneStatus;
  /** SVG polygon 'points' attribute, space-separated "x,y" pairs */
  points?: string;
  /** SVG rect: [x, y, width, height] */
  rect?: [number, number, number, number];
  description: string;
}

export type DiagramView = 'side' | 'top' | 'front' | 'rear';

export interface VehicleDiagram {
  view: DiagramView;
  /** SVG viewBox string, e.g. "0 0 400 220" */
  viewBox: string;
  /** Polygon points for the outer vehicle body silhouette */
  bodyOutline: string;
  /** Circles for wheels (side/front/rear views) */
  wheels?: Array<{ cx: number; cy: number; r: number }>;
  zones: DiagramZone[];
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  /** Inclusive year range, e.g. [2019, 2023] */
  years: [number, number];
  bodyStyle: BodyStyle;
  propulsion: Propulsion;
  hazards: HazardInfo;
  diagrams: VehicleDiagram[];
  /** VIN WMI prefixes that map to this vehicle model */
  vinPrefixes?: string[];
  /** Character 4 of VIN (first VDS byte) patterns for model disambiguation */
  vinVdsHints?: string[];
}

// ─── Search / navigation params ───────────────────────────────────────────────

export interface SearchParams {
  make?: string;
  model?: string;
  year?: number;
  vinText?: string;
}

export type RootStackParamList = {
  Search: undefined;
  VehicleDetail: { vehicleId: string; year: number };
  VINScan: undefined;
  PhotoRecognition: undefined;
};
