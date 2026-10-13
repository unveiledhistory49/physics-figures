import React, { useRef } from 'react';
import type { ProjectileMotionState } from '../types/figures';
import { MathText } from '../components/MathText';
import { computeArrow, describeArc, degToRad } from '../engine/math';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { Checkbox } from '../components/Controls/Checkbox';

interface ProjectileMotionProps {
  state: ProjectileMotionState;
  onChange: (newState: ProjectileMotionState) => void;
}

export const defaultProjectileMotionState: ProjectileMotionState = {
  launchType: 'ground',
  cliffHeight: 80,
  angle: 45,
  initialSpeed: 85,
  showVelocityVector: true,
  showComponents: true,
  showPeak: true,
  showRange: true,
  showTrajectory: true,
  labelAngle: { mode: 'text', text: 'θ' },
  labelSpeed: { mode: 'text', text: 'v_0' },
  mirror: false,
  color: true,
};

export const ProjectileMotion: React.FC<ProjectileMotionProps> = ({
  state,
  onChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 580;
  const height = 380;
  const groundY = 310;
  const launchX = state.launchType === 'cliff' ? 120 : 60;
  const launchY = state.launchType === 'cliff' ? groundY - state.cliffHeight : groundY;

  const rad = degToRad(state.angle);
  const v0 = state.initialSpeed;
  const v0x = v0 * Math.cos(rad);
  const v0y = v0 * Math.sin(rad);

  // Parabola physics simulation points
  // y_phys(t) = v0y * t - 0.5 * g * t^2
  // We scale time such that apex and range fit visually in canvas
  const g = 9.8;

  // Total flight time until hitting groundY
  // 0.5*g*t^2 - v0y*t - cliffHeight = 0
  const h0 = state.launchType === 'cliff' ? state.cliffHeight / 2 : 0;
  const discriminant = v0y * v0y + 2 * g * h0;
  const totalTime = (v0y + Math.sqrt(discriminant)) / g;

  // Sample parabola points
  const steps = 30;
  const points: { x: number; y: number }[] = [];
  let maxApexY = launchY;
  let apexPoint = { x: launchX, y: launchY };

  for (let i = 0; i <= steps; i++) {
    const t = (totalTime * i) / steps;
    const x = launchX + v0x * t * (280 / (v0x * (totalTime || 1)));
    const yPhys = v0y * t - 0.5 * g * t * t;
    const y = launchY - yPhys * 1.6;

    points.push({ x, y });
    if (y < maxApexY) {
      maxApexY = y;
      apexPoint = { x, y };
    }
  }

  const landingX = points[points.length - 1]?.x || launchX + 300;

  // Path data
  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `${acc} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');

  // Initial velocity arrow
  const velArrow = computeArrow(launchX, launchY, state.angle, v0, 13, 9);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Canvas */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <CanvasToolbar svgRef={svgRef} filename="projectile-motion" />

        <div className="p-6 flex items-center justify-center bg-slate-50/50 min-h-[460px] figure-canvas-container overflow-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            className={`max-w-full h-auto select-none bg-white shadow-sm border border-slate-200 rounded-lg ${
              state.mirror ? 'scale-x-[-1]' : ''
            }`}
          >
            <rect width={width} height={height} fill="#ffffff" />

            {/* Ground Line */}
            <line x1={30} y1={groundY} x2={550} y2={groundY} stroke="#111827" strokeWidth={2.4} />

            {/* Cliff if enabled */}
            {state.launchType === 'cliff' && (
              <g>
                <path
                  d={`M 30 ${groundY} L ${launchX} ${groundY} L ${launchX} ${launchY} L 30 ${launchY} Z`}
                  fill="#f1f5f9"
                  stroke="#111827"
                  strokeWidth={2.4}
                />
                {/* Cliff height dimension marker */}
                <line x1={50} y1={launchY} x2={50} y2={groundY} stroke="#4b5563" strokeDasharray="3 3" />
                <MathText x={35} y={(launchY + groundY) / 2} label={{ mode: 'text', text: 'h' }} fontSize={18} />
              </g>
            )}

            {/* Trajectory Parabola (Dashed) */}
            {state.showTrajectory && (
              <path
                d={pathD}
                fill="none"
                stroke={state.color ? '#2563eb' : '#111827'}
                strokeWidth={2.2}
                strokeDasharray="6 4"
              />
            )}

            {/* Projectile at launch point */}
            <circle
              cx={launchX}
              cy={launchY}
              r={7}
              fill={state.color ? '#3b82f6' : '#111827'}
              stroke="#111827"
              strokeWidth={1.5}
            />

            {/* Launch Angle Arc */}
            {state.angle > 0 && (
              <g>
                <path
                  d={describeArc(launchX, launchY, 36, 0, state.angle)}
                  fill="none"
                  stroke="#111827"
                  strokeWidth={1.6}
                />
                <MathText
                  x={launchX + 48 * Math.cos(rad / 2)}
                  y={launchY - 48 * Math.sin(rad / 2)}
                  label={state.labelAngle}
                  fontSize={18}
                />
              </g>
            )}

            {/* Velocity Vector (v_0) */}
            {state.showVelocityVector && (
              <g>
                <line
                  x1={velArrow.startX}
                  y1={velArrow.startY}
                  x2={velArrow.endX}
                  y2={velArrow.endY}
                  stroke="#111827"
                  strokeWidth={2.8}
                />
                <polygon points={velArrow.headPoints} fill="#111827" />
                <MathText
                  x={velArrow.tipX + 16 * Math.cos(rad)}
                  y={velArrow.tipY - 16 * Math.sin(rad)}
                  label={state.labelSpeed}
                  fontSize={20}
                  vectorNotation="arrow"
                />

                {/* Velocity Components */}
                {state.showComponents && state.angle > 0 && (
                  <g strokeDasharray="4 3" stroke="#6b7280" strokeWidth={1.5}>
                    <line x1={launchX} y1={launchY} x2={velArrow.endX} y2={launchY} />
                    <line x1={velArrow.endX} y1={launchY} x2={velArrow.endX} y2={velArrow.endY} />
                    <MathText
                      x={(launchX + velArrow.endX) / 2}
                      y={launchY + 16}
                      label={{ mode: 'text', text: 'v_{0x}' }}
                      fontSize={16}
                      fill="#6b7280"
                    />
                    <MathText
                      x={velArrow.endX + 22}
                      y={(launchY + velArrow.endY) / 2}
                      label={{ mode: 'text', text: 'v_{0y}' }}
                      fontSize={16}
                      fill="#6b7280"
                    />
                  </g>
                )}
              </g>
            )}

            {/* Apex Callout */}
            {state.showPeak && state.angle > 10 && (
              <g stroke="#94a3b8" strokeDasharray="3 3">
                <line x1={apexPoint.x} y1={apexPoint.y} x2={apexPoint.x} y2={groundY} />
                <circle cx={apexPoint.x} cy={apexPoint.y} r={4} fill="#111827" stroke="none" />
                <MathText
                  x={apexPoint.x}
                  y={apexPoint.y - 18}
                  label={{ mode: 'text', text: 'H_{max}' }}
                  fontSize={17}
                  fill="#475569"
                />
              </g>
            )}

            {/* Range Dimension Line */}
            {state.showRange && (
              <g>
                <line
                  x1={launchX}
                  y1={groundY + 24}
                  x2={landingX}
                  y2={groundY + 24}
                  stroke="#4b5563"
                  strokeWidth={1.5}
                />
                {/* Range endpoints */}
                <line x1={launchX} y1={groundY + 18} x2={launchX} y2={groundY + 30} stroke="#4b5563" strokeWidth={1.5} />
                <line x1={landingX} y1={groundY + 18} x2={landingX} y2={groundY + 30} stroke="#4b5563" strokeWidth={1.5} />
                <MathText
                  x={(launchX + landingX) / 2}
                  y={groundY + 40}
                  label={{ mode: 'text', text: 'R' }}
                  fontSize={19}
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Settings Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Launch Conditions
          </h3>
          <SegmentedControl<'ground' | 'cliff'>
            label="Elevation setup"
            value={state.launchType}
            options={[
              { value: 'ground', label: 'Ground-to-ground' },
              { value: 'cliff', label: 'Elevated Cliff' },
            ]}
            onChange={(launchType) => onChange({ ...state, launchType })}
          />

          {state.launchType === 'cliff' && (
            <Slider
              label="Cliff height (h)"
              value={state.cliffHeight}
              min={40}
              max={140}
              step={10}
              unit=" px"
              onChange={(cliffHeight) => onChange({ ...state, cliffHeight })}
            />
          )}

          <Slider
            label="Launch Angle (θ)"
            value={state.angle}
            min={0}
            max={85}
            step={5}
            unit="°"
            onChange={(angle) => onChange({ ...state, angle })}
          />

          <Slider
            label="Initial Speed (v₀)"
            value={state.initialSpeed}
            min={50}
            max={120}
            step={5}
            onChange={(initialSpeed) => onChange({ ...state, initialSpeed })}
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Diagram Annotations
          </h3>
          <Checkbox
            label="Initial velocity vector (v₀⃗)"
            checked={state.showVelocityVector}
            onChange={(showVelocityVector) => onChange({ ...state, showVelocityVector })}
          />
          <Checkbox
            label="Velocity components (v_0x, v_0y)"
            checked={state.showComponents}
            onChange={(showComponents) => onChange({ ...state, showComponents })}
          />
          <Checkbox
            label="Show maximum height (H_max)"
            checked={state.showPeak}
            onChange={(showPeak) => onChange({ ...state, showPeak })}
          />
          <Checkbox
            label="Show horizontal range (R)"
            checked={state.showRange}
            onChange={(showRange) => onChange({ ...state, showRange })}
          />
          <Checkbox
            label="Show trajectory arc"
            checked={state.showTrajectory}
            onChange={(showTrajectory) => onChange({ ...state, showTrajectory })}
          />
          <Checkbox
            label="Color highlights"
            checked={state.color}
            onChange={(color) => onChange({ ...state, color })}
          />
          <Checkbox
            label="Mirror (flip left to right)"
            checked={state.mirror}
            onChange={(mirror) => onChange({ ...state, mirror })}
          />
        </div>
      </div>
    </div>
  );
};
