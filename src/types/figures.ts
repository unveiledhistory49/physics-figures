export type VectorNotation = 'none' | 'arrow' | 'bold';

export type LabelMode = 'text' | 'blank' | 'none';

export interface FormattedLabel {
  mode: LabelMode;
  text: string;
}

export type BodyType = 'dot' | 'block' | 'ball' | 'cart';

export interface ForceItem {
  id: string;
  name: string;
  direction: number; // in degrees: 0=right, 90=up, 180=left, 270=down
  length: number; // 0.25 to 2.0 multiplier
  label: FormattedLabel;
  showAngle?: boolean;
  angleFrom?: 'horizontal' | 'vertical';
  angleLabel?: FormattedLabel;
  showComponents?: boolean;
  xLabel?: FormattedLabel;
  yLabel?: FormattedLabel;
}

export interface FreeBodyDiagramState {
  body: BodyType;
  bodySize: number; // 0.5 to 2.0
  forces: ForceItem[];
  vectorNotation: VectorNotation;
  showVelocity: boolean;
  velocityAngle: number;
  velocityLabel: FormattedLabel;
  showAcceleration: boolean;
  accelerationAngle: number;
  accelerationLabel: FormattedLabel;
  mirror: boolean;
  color: boolean;
}

export interface GridVector {
  id: string;
  name: string;
  dx: number;
  dy: number;
  label: FormattedLabel;
  color?: string;
}

export interface VectorDiagramState {
  gridSize: number; // number of cells
  showGrid: boolean;
  vectors: GridVector[];
  showResultant: boolean;
  resultantLabel: FormattedLabel;
  vectorNotation: VectorNotation;
  mirror: boolean;
  color: boolean;
}

export interface InclinedPlaneState {
  angle: number; // 10 to 60 degrees
  body: BodyType;
  bodySize: number;
  showNormalForce: boolean;
  showGravityForce: boolean;
  showFrictionForce: boolean;
  showAppliedForce: boolean;
  appliedDirection: 'up' | 'down';
  showComponents: boolean;
  labelMass: FormattedLabel;
  labelAngle: FormattedLabel;
  mirror: boolean;
  color: boolean;
}

export interface PulleyState {
  type: 'single' | 'atwood' | 'table';
  pulleyRadius: number;
  mass1: number; // relative size
  mass2: number;
  mass1Label: FormattedLabel;
  mass2Label: FormattedLabel;
  mass1Height: number; // vertical offset
  mass2Height: number;
  showForces: boolean;
  mirror: boolean;
  color: boolean;
}

export interface ProjectileMotionState {
  launchType: 'ground' | 'cliff';
  cliffHeight: number;
  angle: number; // degrees
  initialSpeed: number;
  showVelocityVector: boolean;
  showComponents: boolean;
  showPeak: boolean;
  showRange: boolean;
  showTrajectory: boolean;
  labelAngle: FormattedLabel;
  labelSpeed: FormattedLabel;
  mirror: boolean;
  color: boolean;
}

export interface MotionSegment {
  id: string;
  duration: number; // seconds
  startValue: number;
  endValue: number;
  type: 'linear' | 'parabolic-accelerating' | 'parabolic-decelerating' | 'constant';
}

export interface MotionGraphsState {
  graphType: 'position' | 'velocity' | 'acceleration';
  timeMax: number;
  valueMin: number;
  valueMax: number;
  segments: MotionSegment[];
  showGrid: boolean;
  timeUnit: string;
  valueUnit: string;
  mirror: boolean;
  color: boolean;
}

export interface SpringScaleState {
  capacity: 5 | 10 | 20 | 50; // Newtons
  reading: number; // Newtons
  showReadingValue: boolean;
  showDampedPointer: boolean;
  hangingMassLabel: FormattedLabel;
  color: boolean;
}

export interface CircuitElement {
  id: string;
  type: 'resistor' | 'battery' | 'switch' | 'bulb' | 'ammeter' | 'voltmeter';
  value: string;
  position: 'top' | 'right' | 'bottom' | 'left' | 'middle';
  isOpen?: boolean;
}

export interface CircuitDiagramState {
  layout: 'series' | 'parallel';
  elements: CircuitElement[];
  batteryVoltage: string;
  mirror: boolean;
  color: boolean;
}

export interface WaveDiagramState {
  type: 'transverse' | 'longitudinal';
  wavelengthCount: number;
  amplitude: number;
  wavelengthPixels: number;
  showNodes: boolean;
  showAntinodes: boolean;
  showWavelengthMarker: boolean;
  showAmplitudeMarker: boolean;
  wavelengthLabel: FormattedLabel;
  amplitudeLabel: FormattedLabel;
  mirror: boolean;
  color: boolean;
}

export type GeneratorKind =
  | 'free-body-diagram'
  | 'vector-diagram'
  | 'inclined-plane'
  | 'pulley'
  | 'projectile-motion'
  | 'motion-graphs'
  | 'spring-scale'
  | 'circuit-diagram'
  | 'waves';

export interface GeneratorMetadata {
  id: GeneratorKind;
  title: string;
  description: string;
  tags: string[];
}
