/**
 * Shared SVG diagram profiles by body-style category.
 * Vehicles reference a profile; zone colours are adjusted at render time
 * based on the vehicle's propulsion type (ICE vs electrified).
 *
 * Coordinate system — Side view  : 400×220, front of car = RIGHT
 *                    Top view   : 360×500, front of car = TOP
 *                    Front view : 320×240, driver-left = LEFT in image
 */

import type { VehicleDiagram } from './types';

// ─── Sedan ────────────────────────────────────────────────────────────────────

export const SEDAN_SIDE: VehicleDiagram = {
  view: 'side',
  viewBox: '0 0 400 220',
  // Clockwise from bottom-left; front of car = right
  bodyOutline:
    '45,165 355,165 355,125 330,95 300,58 282,50 128,50 100,58 70,95 50,125 45,165',
  wheels: [
    { cx: 100, cy: 175, r: 22 },
    { cx: 300, cy: 175, r: 22 },
  ],
  zones: [
    {
      id: 'hood',
      label: 'Hood',
      status: 'safe',
      points: '310,95 355,125 355,165 295,165 295,115',
      description: 'Engine bay — no structural reinforcement; safe entry point.',
    },
    {
      id: 'a-pillar',
      label: 'A-Pillar',
      status: 'caution',
      points: '282,50 302,50 328,95 305,95',
      description:
        'Side-curtain airbag channel runs in A-pillar. Cut carefully; avoid interior surface.',
    },
    {
      id: 'b-pillar',
      label: 'B-Pillar',
      status: 'avoid',
      rect: [185, 50, 18, 115],
      description:
        'Highest reinforcement zone — boron/UHSS steel. Avoid cutting; use door-hinge method instead.',
    },
    {
      id: 'c-pillar',
      label: 'C-Pillar',
      status: 'caution',
      points: '100,58 128,50 108,50 78,95 100,95',
      description:
        'Rear curtain airbag channel. Moderate reinforcement — cut with care.',
    },
    {
      id: 'roof-rail',
      label: 'Roof Rail',
      status: 'caution',
      rect: [128, 50, 154, 14],
      description:
        'Side-curtain airbag inflator and tether route. Do not cut until airbag has deployed.',
    },
    {
      id: 'rocker-panel',
      label: 'Rocker / Sill',
      status: 'caution',
      rect: [148, 155, 108, 10],
      description:
        'Door-sill reinforcement. On hybrids/EVs this zone is AVOID — HV battery floor below.',
    },
    {
      id: 'trunk',
      label: 'Trunk Lid',
      status: 'safe',
      points: '45,125 70,95 100,95 100,165 45,165',
      description: 'Trunk lid area — generally safe; watch for rear-curtain airbag inflators.',
    },
  ],
};

export const SEDAN_TOP: VehicleDiagram = {
  view: 'top',
  viewBox: '0 0 360 500',
  // Front of car = top; clockwise from front-left corner
  bodyOutline:
    '90,40 270,40 290,65 300,130 300,370 290,435 270,460 90,460 70,435 60,370 60,130 70,65 90,40',
  zones: [
    {
      id: 'hood-top',
      label: 'Hood',
      status: 'safe',
      rect: [100, 25, 160, 80],
      description: 'Engine hood — safe cutting zone.',
    },
    {
      id: 'a-pillar-left',
      label: 'A-Pillar L',
      status: 'caution',
      points: '70,65 90,40 115,40 95,90 65,100',
      description: 'Left A-pillar — curtain airbag channel.',
    },
    {
      id: 'a-pillar-right',
      label: 'A-Pillar R',
      status: 'caution',
      points: '290,65 270,40 245,40 265,90 295,100',
      description: 'Right A-pillar — curtain airbag channel.',
    },
    {
      id: 'b-pillar-left',
      label: 'B-Pillar L',
      status: 'avoid',
      rect: [55, 205, 40, 90],
      description: 'Left B-pillar — UHSS steel. Avoid.',
    },
    {
      id: 'b-pillar-right',
      label: 'B-Pillar R',
      status: 'avoid',
      rect: [265, 205, 40, 90],
      description: 'Right B-pillar — UHSS steel. Avoid.',
    },
    {
      id: 'c-pillar-left',
      label: 'C-Pillar L',
      status: 'caution',
      points: '60,370 80,350 100,380 80,420 60,400',
      description: 'Left C-pillar — rear curtain airbag.',
    },
    {
      id: 'c-pillar-right',
      label: 'C-Pillar R',
      status: 'caution',
      points: '300,370 280,350 260,380 280,420 300,400',
      description: 'Right C-pillar — rear curtain airbag.',
    },
    {
      id: 'roof-center',
      label: 'Roof',
      status: 'safe',
      rect: [100, 100, 160, 300],
      description: 'Roof center panel — generally safe. Watch for sunroof reinforcement ring.',
    },
    {
      id: 'trunk-top',
      label: 'Trunk',
      status: 'safe',
      rect: [100, 395, 160, 75],
      description: 'Trunk lid — safe.',
    },
  ],
};

// ─── SUV ──────────────────────────────────────────────────────────────────────

export const SUV_SIDE: VehicleDiagram = {
  view: 'side',
  viewBox: '0 0 400 230',
  // Taller body, boxier profile; front = right
  bodyOutline:
    '42,170 358,170 358,110 330,80 300,50 105,50 75,80 50,110 42,170',
  wheels: [
    { cx: 98, cy: 182, r: 25 },
    { cx: 302, cy: 182, r: 25 },
  ],
  zones: [
    {
      id: 'hood',
      label: 'Hood',
      status: 'safe',
      points: '300,50 330,80 358,110 358,170 290,170 290,90',
      description: 'Engine hood — safe entry point.',
    },
    {
      id: 'a-pillar',
      label: 'A-Pillar',
      status: 'caution',
      points: '300,50 318,50 345,82 322,82',
      description: 'Side-curtain airbag in A-pillar channel. Cut carefully.',
    },
    {
      id: 'b-pillar',
      label: 'B-Pillar',
      status: 'avoid',
      rect: [183, 50, 20, 120],
      description: 'Boron/UHSS reinforcement. Do NOT cut.',
    },
    {
      id: 'c-pillar',
      label: 'C-Pillar',
      status: 'caution',
      points: '105,50 125,50 105,82 82,82',
      description: 'Rear curtain channel. Cut with care.',
    },
    {
      id: 'd-pillar',
      label: 'D-Pillar',
      status: 'caution',
      points: '70,80 95,50 115,50 90,82',
      description: 'Rearmost pillar on 4-door SUV. Curtain airbag extends here.',
    },
    {
      id: 'roof-rail',
      label: 'Roof Rail',
      status: 'caution',
      rect: [125, 50, 175, 13],
      description: 'Curtain airbag rail — do not cut until deployed.',
    },
    {
      id: 'rocker-panel',
      label: 'Rocker / Sill',
      status: 'caution',
      rect: [135, 158, 130, 12],
      description: 'Door-sill plate. May be AVOID on electrified models.',
    },
  ],
};

export const SUV_TOP: VehicleDiagram = {
  view: 'top',
  viewBox: '0 0 380 540',
  bodyOutline:
    '85,35 295,35 315,60 320,140 320,400 315,460 295,500 85,500 65,460 60,400 60,140 65,60 85,35',
  zones: [
    {
      id: 'hood-top',
      label: 'Hood',
      status: 'safe',
      rect: [95, 20, 190, 90],
      description: 'Engine hood — safe.',
    },
    {
      id: 'a-pillar-left',
      label: 'A-Pillar L',
      status: 'caution',
      points: '65,60 85,35 110,35 90,95 62,105',
      description: 'Left A-pillar — curtain airbag.',
    },
    {
      id: 'a-pillar-right',
      label: 'A-Pillar R',
      status: 'caution',
      points: '315,60 295,35 270,35 290,95 318,105',
      description: 'Right A-pillar — curtain airbag.',
    },
    {
      id: 'b-pillar-left',
      label: 'B-Pillar L',
      status: 'avoid',
      rect: [48, 195, 45, 95],
      description: 'Left B-pillar — UHSS. Avoid.',
    },
    {
      id: 'b-pillar-right',
      label: 'B-Pillar R',
      status: 'avoid',
      rect: [287, 195, 45, 95],
      description: 'Right B-pillar — UHSS. Avoid.',
    },
    {
      id: 'c-pillar-left',
      label: 'C-Pillar L',
      status: 'caution',
      rect: [48, 330, 40, 70],
      description: 'Left C-pillar — rear curtain.',
    },
    {
      id: 'c-pillar-right',
      label: 'C-Pillar R',
      status: 'caution',
      rect: [292, 330, 40, 70],
      description: 'Right C-pillar — rear curtain.',
    },
    {
      id: 'roof-center',
      label: 'Roof',
      status: 'safe',
      rect: [100, 110, 180, 320],
      description: 'Roof center — safe.',
    },
    {
      id: 'cargo-top',
      label: 'Cargo Area',
      status: 'safe',
      rect: [95, 420, 190, 90],
      description: 'Rear cargo lid — safe.',
    },
  ],
};

// ─── Truck ────────────────────────────────────────────────────────────────────

export const TRUCK_SIDE: VehicleDiagram = {
  view: 'side',
  viewBox: '0 0 440 230',
  // Longer wheelbase; cab + bed; front = right
  bodyOutline:
    '40,175 400,175 400,115 370,80 340,52 200,52 175,80 155,115 155,175 40,175',
  wheels: [
    { cx: 100, cy: 187, r: 26 },
    { cx: 320, cy: 187, r: 26 },
  ],
  zones: [
    {
      id: 'truck-bed',
      label: 'Truck Bed',
      status: 'safe',
      rect: [40, 55, 115, 120],
      description: 'Pickup bed — no passengers; safe working area.',
    },
    {
      id: 'hood',
      label: 'Hood',
      status: 'safe',
      points: '340,52 370,80 400,115 400,175 335,175 335,90',
      description: 'Engine hood — safe approach zone.',
    },
    {
      id: 'a-pillar',
      label: 'A-Pillar',
      status: 'caution',
      points: '340,52 355,52 380,82 358,82',
      description: 'Side-curtain airbag in A-pillar. Cut carefully.',
    },
    {
      id: 'b-pillar',
      label: 'B-Pillar',
      status: 'avoid',
      rect: [242, 52, 20, 123],
      description: 'High-strength steel B-pillar. Do NOT cut.',
    },
    {
      id: 'c-pillar',
      label: 'C-Pillar',
      status: 'caution',
      points: '200,52 218,52 200,82 178,82',
      description: 'Rear cab pillar — curtain airbag. Caution.',
    },
    {
      id: 'roof-rail',
      label: 'Roof Rail',
      status: 'caution',
      rect: [218, 52, 122, 13],
      description: 'Curtain airbag rail inside roof edge.',
    },
    {
      id: 'rocker-panel',
      label: 'Rocker / Sill',
      status: 'caution',
      rect: [185, 163, 135, 12],
      description: 'Cab sill. Check for frame and fuel lines below.',
    },
    {
      id: 'frame-rail',
      label: 'Frame Rail',
      status: 'avoid',
      rect: [40, 168, 400, 7],
      description: 'Ladder frame — hardened steel. Avoid cutting.',
    },
  ],
};

// ─── Van ──────────────────────────────────────────────────────────────────────

export const VAN_SIDE: VehicleDiagram = {
  view: 'side',
  viewBox: '0 0 420 230',
  // Box-van profile; higher roof; front = right
  bodyOutline:
    '42,170 378,170 378,60 355,45 100,45 70,65 42,110 42,170',
  wheels: [
    { cx: 100, cy: 183, r: 24 },
    { cx: 320, cy: 183, r: 24 },
  ],
  zones: [
    {
      id: 'hood',
      label: 'Hood',
      status: 'safe',
      points: '340,45 378,60 378,170 320,170 320,90',
      description: 'Engine hood — safe entry zone.',
    },
    {
      id: 'a-pillar',
      label: 'A-Pillar',
      status: 'caution',
      points: '355,45 372,45 378,62 360,75',
      description: 'Curtain airbag channel. Cut carefully.',
    },
    {
      id: 'b-pillar',
      label: 'B-Pillar',
      status: 'avoid',
      rect: [212, 45, 20, 125],
      description: 'UHSS reinforced. Do NOT cut.',
    },
    {
      id: 'c-pillar',
      label: 'C-Pillar',
      status: 'caution',
      points: '100,45 118,45 118,75 100,80',
      description: 'Rear curtain channel.',
    },
    {
      id: 'roof-rail',
      label: 'Roof Rail',
      status: 'caution',
      rect: [118, 45, 237, 12],
      description: 'Long curtain airbag rail — seat count dependent.',
    },
    {
      id: 'rocker-panel',
      label: 'Rocker / Sill',
      status: 'caution',
      rect: [145, 158, 150, 12],
      description: 'Sill reinforcement plus fuel line routing.',
    },
    {
      id: 'sliding-door-rail',
      label: 'Sliding Door Rail',
      status: 'safe',
      rect: [130, 75, 80, 83],
      description: 'Sliding door rail area — can be cut to release jammed door.',
    },
  ],
};
