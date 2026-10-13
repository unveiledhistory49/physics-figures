import React, { useRef } from 'react';
import type { PulleyState } from '../types/figures';
import { MathText } from '../components/MathText';
import { computeArrow } from '../engine/math';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { LabelInput } from '../components/Controls/LabelInput';
import { Checkbox } from '../components/Controls/Checkbox';

interface PulleyProps {
  state: PulleyState;
  onChange: (newState: PulleyState) => void;
}

export const defaultPulleyState: PulleyState = {
  type: 'atwood',
  pulleyRadius: 36,
  mass1: 1.0,
  mass2: 1.4,
  mass1Label: { mode: 'text', text: 'm_1' },
  mass2Label: { mode: 'text', text: 'm_2' },
  mass1Height: 180,
  mass2Height: 250,
  showForces: true,
  mirror: false,
  color: true,
};

export const Pulley: React.FC<PulleyProps> = ({ state, onChange }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 480;
  const height = 440;

  const pulleyCx = 240;
  const pulleyCy = 110;
  const r = state.pulleyRadius;

  const stringLeftX = pulleyCx - r;
  const stringRightX = pulleyCx + r;

  const mass1Y = pulleyCy + state.mass1Height;
  const mass2Y = pulleyCy + state.mass2Height;

  const m1Width = 44 * Math.sqrt(state.mass1);
  const m1Height = 44 * Math.sqrt(state.mass1);

  const m2Width = 44 * Math.sqrt(state.mass2);
  const m2Height = 44 * Math.sqrt(state.mass2);

  // Force arrows
  const t1Arrow = computeArrow(stringLeftX, mass1Y, 90, 50, 11, 8);
  const g1Arrow = computeArrow(stringLeftX, mass1Y + m1Height, 270, 50 * state.mass1, 11, 8);

  const t2Arrow = computeArrow(stringRightX, mass2Y, 90, 50, 11, 8);
  const g2Arrow = computeArrow(stringRightX, mass2Y + m2Height, 270, 50 * state.mass2, 11, 8);

  const forceColor = state.color ? '#2563eb' : '#111827';

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Canvas */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <CanvasToolbar svgRef={svgRef} filename="pulley-system" />

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

            {/* Ceiling Support */}
            <g stroke="#111827">
              <line x1={pulleyCx - 90} y1={35} x2={pulleyCx + 90} y2={35} strokeWidth={2.5} />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1={pulleyCx - 80 + i * 15}
                  y1={35}
                  x2={pulleyCx - 88 + i * 15}
                  y2={25}
                  strokeWidth={1.4}
                />
              ))}
              {/* Central Pulley Mount bracket */}
              <line x1={pulleyCx} y1={35} x2={pulleyCx} y2={pulleyCy} strokeWidth={3} />
            </g>

            {/* Pulley Wheel */}
            <g>
              {/* Outer wheel */}
              <circle
                cx={pulleyCx}
                cy={pulleyCy}
                r={r}
                fill="#f1f5f9"
                stroke="#111827"
                strokeWidth={2.5}
              />
              {/* Inner hub */}
              <circle
                cx={pulleyCx}
                cy={pulleyCy}
                r={r * 0.35}
                fill="#e2e8f0"
                stroke="#111827"
                strokeWidth={1.5}
              />
              {/* Center axle pin */}
              <circle cx={pulleyCx} cy={pulleyCy} r={3.5} fill="#111827" />
            </g>

            {/* String over pulley */}
            <g stroke="#111827" strokeWidth={2.2} fill="none">
              {/* Arc over pulley top */}
              <path
                d={`M ${stringLeftX} ${pulleyCy} A ${r} ${r} 0 0 1 ${stringRightX} ${pulleyCy}`}
              />
              {/* Left hanging string */}
              <line x1={stringLeftX} y1={pulleyCy} x2={stringLeftX} y2={mass1Y} />
              {/* Right hanging string */}
              <line x1={stringRightX} y1={pulleyCy} x2={stringRightX} y2={mass2Y} />
            </g>

            {/* Mass 1 (Left) */}
            <g>
              <rect
                x={stringLeftX - m1Width / 2}
                y={mass1Y}
                width={m1Width}
                height={m1Height}
                rx={2}
                fill="#e2e8f0"
                stroke="#111827"
                strokeWidth={2.5}
              />
              <MathText
                x={stringLeftX}
                y={mass1Y + m1Height / 2}
                label={state.mass1Label}
                fontSize={19}
              />
            </g>

            {/* Mass 2 (Right) */}
            <g>
              <rect
                x={stringRightX - m2Width / 2}
                y={mass2Y}
                width={m2Width}
                height={m2Height}
                rx={2}
                fill="#e2e8f0"
                stroke="#111827"
                strokeWidth={2.5}
              />
              <MathText
                x={stringRightX}
                y={mass2Y + m2Height / 2}
                label={state.mass2Label}
                fontSize={19}
              />
            </g>

            {/* Optional Force Vectors */}
            {state.showForces && (
              <g>
                {/* Tension Left */}
                <line
                  x1={t1Arrow.startX}
                  y1={t1Arrow.startY}
                  x2={t1Arrow.endX}
                  y2={t1Arrow.endY}
                  stroke={forceColor}
                  strokeWidth={2.5}
                />
                <polygon points={t1Arrow.headPoints} fill={forceColor} />
                <MathText x={stringLeftX - 18} y={mass1Y - 25} label={{ mode: 'text', text: 'T' }} fontSize={17} fill={forceColor} />

                {/* Gravity Left */}
                <line
                  x1={g1Arrow.startX}
                  y1={g1Arrow.startY}
                  x2={g1Arrow.endX}
                  y2={g1Arrow.endY}
                  stroke={forceColor}
                  strokeWidth={2.5}
                />
                <polygon points={g1Arrow.headPoints} fill={forceColor} />
                <MathText x={stringLeftX - 24} y={mass1Y + m1Height + 35} label={{ mode: 'text', text: 'm_1g' }} fontSize={17} fill={forceColor} />

                {/* Tension Right */}
                <line
                  x1={t2Arrow.startX}
                  y1={t2Arrow.startY}
                  x2={t2Arrow.endX}
                  y2={t2Arrow.endY}
                  stroke={forceColor}
                  strokeWidth={2.5}
                />
                <polygon points={t2Arrow.headPoints} fill={forceColor} />
                <MathText x={stringRightX + 18} y={mass2Y - 25} label={{ mode: 'text', text: 'T' }} fontSize={17} fill={forceColor} />

                {/* Gravity Right */}
                <line
                  x1={g2Arrow.startX}
                  y1={g2Arrow.startY}
                  x2={g2Arrow.endX}
                  y2={g2Arrow.endY}
                  stroke={forceColor}
                  strokeWidth={2.5}
                />
                <polygon points={g2Arrow.headPoints} fill={forceColor} />
                <MathText x={stringRightX + 24} y={mass2Y + m2Height + 35} label={{ mode: 'text', text: 'm_2g' }} fontSize={17} fill={forceColor} />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Settings */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Pulley & Masses
          </h3>
          <Slider
            label="Pulley Radius"
            value={state.pulleyRadius}
            min={24}
            max={50}
            step={2}
            unit=" px"
            onChange={(pulleyRadius) => onChange({ ...state, pulleyRadius })}
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Slider
              label="Mass 1 (left)"
              value={state.mass1}
              min={0.5}
              max={2.5}
              step={0.1}
              unit=" kg"
              onChange={(mass1) => onChange({ ...state, mass1 })}
            />
            <Slider
              label="Height 1"
              value={state.mass1Height}
              min={100}
              max={260}
              step={10}
              onChange={(mass1Height) => onChange({ ...state, mass1Height })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Mass 2 (right)"
              value={state.mass2}
              min={0.5}
              max={2.5}
              step={0.1}
              unit=" kg"
              onChange={(mass2) => onChange({ ...state, mass2 })}
            />
            <Slider
              label="Height 2"
              value={state.mass2Height}
              min={100}
              max={260}
              step={10}
              onChange={(mass2Height) => onChange({ ...state, mass2Height })}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Labels & Vectors
          </h3>
          <LabelInput
            label="Mass 1 Label"
            value={state.mass1Label}
            onChange={(mass1Label) => onChange({ ...state, mass1Label })}
          />
          <LabelInput
            label="Mass 2 Label"
            value={state.mass2Label}
            onChange={(mass2Label) => onChange({ ...state, mass2Label })}
          />
          <Checkbox
            label="Show force vectors (Tension & Gravity)"
            checked={state.showForces}
            onChange={(showForces) => onChange({ ...state, showForces })}
          />
          <Checkbox
            label="Color vectors"
            checked={state.color}
            onChange={(color) => onChange({ ...state, color })}
          />
          <Checkbox
            label="Mirror"
            checked={state.mirror}
            onChange={(mirror) => onChange({ ...state, mirror })}
          />
        </div>
      </div>
    </div>
  );
};
