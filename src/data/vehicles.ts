/**
 * Bundled offline vehicle database.
 * Extend by adding entries to VEHICLES array.
 * Diagrams reference shared profiles from diagramProfiles.ts; EV-specific
 * zone overrides (rocker = avoid, sill = avoid) are applied at render time
 * in CuttingZoneDiagram based on the vehicle's propulsion type.
 */

import { SEDAN_SIDE, SEDAN_TOP, SUV_SIDE, SUV_TOP, TRUCK_SIDE, VAN_SIDE } from './diagramProfiles';
import type { Vehicle } from './types';

export const VEHICLES: Vehicle[] = [
  // ─── Toyota Camry (ICE sedan) ───────────────────────────────────────────────
  {
    id: 'toyota-camry-2018-2023',
    make: 'Toyota',
    model: 'Camry',
    years: [2018, 2023],
    bodyStyle: 'sedan',
    propulsion: 'ICE',
    vinPrefixes: ['4T1', 'JTD'],
    vinVdsHints: ['B', 'G'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash, passenger side' },
        { type: 'side-thorax', location: 'Front seat outboard bolsters — both sides' },
        { type: 'curtain-side', location: 'A-pillar channel → C-pillar, both sides' },
        { type: 'knee', location: 'Under dash — driver side' },
      ],
      fuelLines: [
        'Right rocker panel underside (supply)',
        'Left rocker panel underside (return)',
        'Rear subframe toward fuel tank',
      ],
      boronZones: [
        'B-pillar full height — boron/UHSS laminate',
        'Roof bow cross members',
        'Door intrusion beams (all four doors)',
      ],
      pressurized: [
        'Front struts (McPherson)',
        'Rear shocks',
        'AC compressor and lines — engine bay left side',
      ],
    },
    diagrams: [SEDAN_SIDE, SEDAN_TOP],
  },

  // ─── Toyota Prius (HEV sedan) ───────────────────────────────────────────────
  {
    id: 'toyota-prius-2016-2022',
    make: 'Toyota',
    model: 'Prius',
    years: [2016, 2022],
    bodyStyle: 'sedan',
    propulsion: 'HEV',
    vinPrefixes: ['JTDKARFU', 'JTDKBRFU'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash, passenger side' },
        { type: 'side-thorax', location: 'Front seat outboard bolsters — both sides' },
        { type: 'curtain-side', location: 'A-pillar → C-pillar channels, both sides' },
        { type: 'knee', location: 'Driver knee bolster' },
      ],
      hvCables: [
        {
          route: 'Battery (under rear seat) → inverter (engine bay) via B-pillar base and rocker',
          voltage: 201,
          warning: 'ORANGE cables — do NOT cut. HV system must be disabled first (blue service plug under rear seat).',
        },
      ],
      fuelLines: [
        'Left sill underside (fuel supply)',
        'Right sill underside (fuel return)',
      ],
      boronZones: [
        'B-pillar — UHSS reinforcement',
        'Roof side rails',
        'Door intrusion beams',
      ],
      pressurized: ['Front struts', 'Rear torsion beam'],
      notes: [
        'HV SYSTEM: Disable before cutting — blue service plug under rear seat carpet.',
        'Battery NiMH pack is beneath rear seat — 201.6 V nominal.',
        'Wait 5 minutes after ignition off before cutting near HV cable routes.',
      ],
    },
    diagrams: [SEDAN_SIDE, SEDAN_TOP],
  },

  // ─── Tesla Model 3 (EV sedan) ───────────────────────────────────────────────
  {
    id: 'tesla-model3-2018-2023',
    make: 'Tesla',
    model: 'Model 3',
    years: [2018, 2023],
    bodyStyle: 'sedan',
    propulsion: 'EV',
    vinPrefixes: ['5YJ3'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering yoke / wheel hub' },
        { type: 'passenger-frontal', location: 'Dash top surface (no glove box)' },
        { type: 'side-thorax', location: 'Front seat outboard — both sides' },
        { type: 'curtain-side', location: 'A-pillar → C-pillar, both sides' },
        { type: 'center', location: 'Between front seats (driver-side airbag bag)' },
        { type: 'knee', location: 'Driver knee — under dash' },
      ],
      hvCables: [
        {
          route: 'Front motor → battery pack (floor) via left rocker',
          voltage: 350,
          warning: 'ORANGE cables at 350 V nominal (up to 400 V). FATAL if cut under load. De-energise via crash disconnect (automatic on major impact).',
        },
        {
          route: 'Rear motor → battery pack via right rocker',
          voltage: 350,
          warning: 'Same 350 V system. Confirm no arc/hum before approach.',
        },
      ],
      fuelLines: [],
      boronZones: [
        'B-pillar — ultra-high-strength aluminium inner + steel',
        'Roof rails — formed UHSS',
        'Battery enclosure structural frame',
      ],
      pressurized: [
        'Front struts (no engine mass to manage)',
        'Rear air springs (Performance/Long Range trim)',
        'AC/heat-pump refrigerant lines (engine bay front)',
      ],
      notes: [
        'EV — NO fuel. Battery pack spans entire floor at ~7 cm ground clearance.',
        'HV DISCONNECT: Automatic on crash. Manual — remove 12 V plug (frunk right side) then wait 60 s.',
        'Do NOT cut rocker panels or floor — 350 V pack directly below.',
        'Glass roof (if fitted) can be broken for roof access — tempered, not laminated.',
        'No engine noise is NOT confirmation HV is de-energised — check with meter.',
      ],
    },
    diagrams: [SEDAN_SIDE, SEDAN_TOP],
  },

  // ─── Tesla Model Y (EV SUV) ─────────────────────────────────────────────────
  {
    id: 'tesla-modely-2020-2023',
    make: 'Tesla',
    model: 'Model Y',
    years: [2020, 2023],
    bodyStyle: 'suv',
    propulsion: 'EV',
    vinPrefixes: ['5YJY', '7SAYGDEE'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash — passenger side' },
        { type: 'side-thorax', location: 'Front seat outboard bolsters' },
        { type: 'curtain-side', location: 'A-pillar → D-pillar, both sides (full-length)' },
        { type: 'center', location: 'Between front seats' },
        { type: 'rear-curtain', location: 'C/D-pillar — rear row protection' },
      ],
      hvCables: [
        {
          route: 'Front motor → battery (floor centre) via left rocker panel',
          voltage: 350,
          warning: 'ORANGE insulated. 350 V — do NOT cut. Use non-contact tester first.',
        },
        {
          route: 'Rear motor → battery (floor centre) via right rocker panel',
          voltage: 350,
          warning: 'Same HV system.',
        },
      ],
      fuelLines: [],
      boronZones: [
        'B-pillar — aluminium/UHSS composite',
        'Side roof rails — roll-formed UHSS',
        'Battery enclosure perimeter',
      ],
      pressurized: ['Front struts', 'Rear air suspension (optional)', 'AC refrigerant lines'],
      notes: [
        'EV — full-floor battery at ~8 cm ground clearance.',
        'HV DISCONNECT: automatic on crash. Manual — frunk 12 V cable removal, then 60 s wait.',
        'Rocker panels AVOID — HV cable routes confirmed.',
        'Rear hatch glass is laminated — use window punch at corner.',
      ],
    },
    diagrams: [SUV_SIDE, SUV_TOP],
  },

  // ─── Toyota RAV4 Hybrid (HEV SUV) ──────────────────────────────────────────
  {
    id: 'toyota-rav4hybrid-2019-2023',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    years: [2019, 2023],
    bodyStyle: 'suv',
    propulsion: 'HEV',
    vinPrefixes: ['4T3RWRFV', 'JTMRWRFV'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash — passenger side' },
        { type: 'side-thorax', location: 'Front seat outboard, both sides' },
        { type: 'curtain-side', location: 'A-pillar → C/D-pillar, both sides' },
        { type: 'knee', location: 'Driver knee bolster' },
      ],
      hvCables: [
        {
          route: 'Battery pack (under rear seat) → transaxle/inverter via left rocker',
          voltage: 244,
          warning: 'ORANGE sheathed. 244 V. Disable: orange service plug under rear cargo floor on left.',
        },
        {
          route: 'Rear motor controller (AWD models) via chassis tunnel',
          voltage: 244,
          warning: 'Same 244 V system — chassis tunnel routing.',
        },
      ],
      fuelLines: ['Left sill underside', 'Rear subframe area toward tank'],
      boronZones: [
        'B-pillar',
        'Door intrusion beams (all four)',
        'Roof side rails',
      ],
      pressurized: ['Front struts', 'Rear independent shocks', 'AC refrigerant'],
      notes: [
        'HV battery NiMH / Li-ion under rear seat. Service plug on rear cargo floor — LEFT side.',
        'Wait 5 minutes after deactivation before work near HV zones.',
      ],
    },
    diagrams: [SUV_SIDE, SUV_TOP],
  },

  // ─── Ford F-150 (ICE truck, 13th/14th gen) ─────────────────────────────────
  {
    id: 'ford-f150-2019-2023',
    make: 'Ford',
    model: 'F-150',
    years: [2019, 2023],
    bodyStyle: 'truck',
    propulsion: 'ICE',
    vinPrefixes: ['1FTFW', '1FTEX', '1FTRE', '1FT8W'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash — passenger side' },
        { type: 'side-thorax', location: 'Seat outboard bolsters, both sides' },
        { type: 'curtain-side', location: 'A-pillar → C-pillar (SuperCrew: to D-pillar)' },
        { type: 'knee', location: 'Driver and passenger knee bolsters' },
      ],
      fuelLines: [
        'Right frame rail underside (supply line)',
        'Left frame rail underside (return line)',
        'Firewall crossover near cab floor',
      ],
      boronZones: [
        'B-pillar — UHSS reinforced (SuperCrew has additional cross bracing)',
        'Cab corners at A and C pillars',
        'Door intrusion beams (all cab doors)',
        'Frame rails — high-strength steel (NOT boron, but thick)',
      ],
      pressurized: [
        'Front coil springs / shock absorbers',
        'Rear leaf springs (passive — not pressurized)',
        'AC refrigerant lines — engine bay right',
      ],
      notes: [
        'Aluminium body panels — do NOT use UHSS cutting guidelines for body; aluminium shears more easily.',
        'Frame is high-strength steel — do not attempt to cut frame rails.',
        'Cab configurations: Regular, SuperCab, SuperCrew. SuperCrew has rear doors and longer curtain airbag.',
      ],
    },
    diagrams: [TRUCK_SIDE],
  },

  // ─── Ford F-150 Lightning (EV truck) ───────────────────────────────────────
  {
    id: 'ford-f150lightning-2022-2023',
    make: 'Ford',
    model: 'F-150 Lightning',
    years: [2022, 2023],
    bodyStyle: 'truck',
    propulsion: 'EV',
    vinPrefixes: ['1FTFW1E'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash — passenger side' },
        { type: 'side-thorax', location: 'Seat outboard bolsters' },
        { type: 'curtain-side', location: 'A-pillar → D-pillar (SuperCrew only)' },
        { type: 'knee', location: 'Driver and passenger knee bolsters' },
      ],
      hvCables: [
        {
          route: 'Front motor → battery (floor) via left rocker/sill',
          voltage: 400,
          warning: 'ORANGE cables — 400 V. Automatic crash disconnect, but confirm with tester.',
        },
        {
          route: 'Rear motor → battery (floor) via right sill',
          voltage: 400,
          warning: 'Same 400 V system.',
        },
      ],
      fuelLines: [],
      boronZones: [
        'B-pillar — UHSS reinforced',
        'Cab corners',
        'Frame side rails — high-strength steel (not cuttable)',
      ],
      pressurized: ['Front coil springs', 'AC/heat pump refrigerant'],
      notes: [
        'EV — 400 V battery spans cab floor and front trunk (frunk).',
        'frunk (front trunk) contains 12 V jump terminals — NOT HV access point.',
        'HV DISCONNECT: automatic on crash. Manual — service disconnect under frunk floor mat.',
        'ROCKER PANELS and CAB FLOOR — AVOID. HV pack directly below.',
      ],
    },
    diagrams: [TRUCK_SIDE],
  },

  // ─── Honda CR-V (ICE SUV) ───────────────────────────────────────────────────
  {
    id: 'honda-crv-2017-2022',
    make: 'Honda',
    model: 'CR-V',
    years: [2017, 2022],
    bodyStyle: 'suv',
    propulsion: 'ICE',
    vinPrefixes: ['5J6RW', '2HK'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash top' },
        { type: 'side-thorax', location: 'Front seat outboard bolsters' },
        { type: 'curtain-side', location: 'A-pillar → C/D-pillar, both sides' },
      ],
      fuelLines: ['Right sill underside', 'Rear longitudinal toward fuel tank (right side)'],
      boronZones: [
        'B-pillar — boron steel reinforcement',
        'Door impact beams (all four)',
        'Front bumper crash box',
      ],
      pressurized: ['Front MacPherson struts', 'Rear multi-link shocks', 'AC refrigerant'],
    },
    diagrams: [SUV_SIDE, SUV_TOP],
  },

  // ─── Chevrolet Silverado (ICE truck) ────────────────────────────────────────
  {
    id: 'chevrolet-silverado-2019-2023',
    make: 'Chevrolet',
    model: 'Silverado',
    years: [2019, 2023],
    bodyStyle: 'truck',
    propulsion: 'ICE',
    vinPrefixes: ['1GC'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash — passenger side' },
        { type: 'side-thorax', location: 'Front seat outboard bolsters' },
        { type: 'curtain-side', location: 'A-pillar → C/D-pillar (crew cab)' },
        { type: 'knee', location: 'Driver knee bolster' },
      ],
      fuelLines: [
        'Left frame rail underside',
        'Right frame rail underside (return)',
        'Rear toward fuel tank under bed',
      ],
      boronZones: [
        'B-pillar — mixed high-strength steel',
        'Door intrusion beams',
        'Cab corner reinforcements',
      ],
      pressurized: [
        'Front torsion bars or coil springs (depending on trim)',
        'Rear leaf springs',
        'AC refrigerant — engine bay right side',
      ],
      notes: [
        'Steel body panels (unlike F-150) — standard UHSS cutting approach applies.',
        'Frame rails are thick high-strength steel — do NOT cut.',
        'Crew Cab has extended curtain airbag to D-pillar.',
      ],
    },
    diagrams: [TRUCK_SIDE],
  },

  // ─── Honda Odyssey (ICE minivan) ────────────────────────────────────────────
  {
    id: 'honda-odyssey-2018-2023',
    make: 'Honda',
    model: 'Odyssey',
    years: [2018, 2023],
    bodyStyle: 'van',
    propulsion: 'ICE',
    vinPrefixes: ['5FNRL'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash — passenger side' },
        { type: 'side-thorax', location: 'Front seat outboard bolsters' },
        { type: 'curtain-side', location: 'A-pillar → D-pillar — full length (3-row coverage)' },
        { type: 'knee', location: 'Driver knee bolster' },
      ],
      fuelLines: [
        'Right sill exterior (supply)',
        'Rear underfloor toward fuel tank (centre-rear)',
      ],
      boronZones: [
        'B-pillar — reinforced UHSS',
        'Sliding door guide-rail reinforcement',
        'All four door intrusion beams',
      ],
      pressurized: ['Front MacPherson struts', 'Rear independent shocks'],
      notes: [
        'Long curtain airbag covers all three rows — confirm deployment before roof work.',
        'Sliding door rail cut: safe zone if need to release jammed side door.',
        'Third row: Magic Seat folds into floor — watch for seat mechanism under carpet.',
      ],
    },
    diagrams: [VAN_SIDE],
  },

  // ─── BMW 3 Series (ICE sedan) ───────────────────────────────────────────────
  {
    id: 'bmw-3series-2019-2023',
    make: 'BMW',
    model: '3 Series',
    years: [2019, 2023],
    bodyStyle: 'sedan',
    propulsion: 'ICE',
    vinPrefixes: ['WBA'],
    hazards: {
      airbags: [
        { type: 'driver-frontal', location: 'Steering wheel hub' },
        { type: 'passenger-frontal', location: 'Dash — passenger side' },
        { type: 'side-thorax', location: 'Front seat outboard bolsters (active head restraints)' },
        { type: 'curtain-side', location: 'A-pillar → C-pillar, both sides' },
        { type: 'knee', location: 'Driver knee bolster (under dash trim)' },
      ],
      fuelLines: [
        'Right underbody longitudinal (supply, high pressure)',
        'Rear toward tank (right underbody)',
      ],
      boronZones: [
        'B-pillar — press-hardened boron steel (PHS)',
        'Roof side rails — roll-formed UHSS',
        'Door intrusion beams (ultra high-strength)',
        'A-pillar — reinforced inner',
      ],
      pressurized: [
        'Front struts (M-Sport: adaptive dampers)',
        'Rear multi-link shocks',
        'AC refrigerant lines',
      ],
      notes: [
        'BMW uses press-hardened boron (PHS) extensively — standard reciprocating saw blades will fail on B-pillar.',
        'Requires carbide or plasma cutter on B-pillar zone.',
        'Active head restraints pop forward on rear impact — can surprise rescuers.',
      ],
    },
    diagrams: [SEDAN_SIDE, SEDAN_TOP],
  },
];

// ─── Lookup helpers ────────────────────────────────────────────────────────────

export function getUniqueMakes(): string[] {
  return [...new Set(VEHICLES.map((v) => v.make))].sort();
}

export function getModelsForMake(make: string): string[] {
  return [...new Set(VEHICLES.filter((v) => v.make === make).map((v) => v.model))].sort();
}

export function getYearsForMakeModel(make: string, model: string): number[] {
  const vehicle = VEHICLES.find((v) => v.make === make && v.model === model);
  if (!vehicle) return [];
  const [start, end] = vehicle.years;
  const years: number[] = [];
  for (let y = end; y >= start; y--) years.push(y);
  return years;
}

export function findVehicleByMakeModelYear(
  make: string,
  model: string,
  year: number,
): Vehicle | undefined {
  return VEHICLES.find(
    (v) => v.make === make && v.model === model && year >= v.years[0] && year <= v.years[1],
  );
}

export function findVehicleById(id: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}
