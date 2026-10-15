import React, { useRef } from 'react';
import type { SpringScaleState } from '../types/figures';
import { MathText } from '../components/MathText';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { LabelInput } from '../components/Controls/LabelInput';
import { Checkbox } from '../components/Controls/Checkbox';

interface SpringScaleProps {
  state: SpringScaleState;
  onChange: (newState: SpringScaleState) => void;
}

export const defaultSpringScaleState: SpringScaleState = {
  capacity: 10,
  reading: 3.5,
  showReadingValue: true,
  showDampedPointer: true,
  hangingMassLabel: { mode: 'text', text: 'm' },
  color: true,
};

export const SpringScale: React.FC<SpringScaleProps> = ({ state, onChange }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 420;
  const height = 540;

  const cx = 210;
  const topY = 60;
  const scaleHeight = 320;
  const scaleWidth = 90;

  const capacity = state.capacity;
  const reading = Math.min(capacity, Math.max(0, state.reading));
  const fraction = reading / capacity;

  // Spring dimensions
  const springZeroY = topY + 45;
  const maxDisplacement = 220;
  const currentDisplacement = fraction * maxDisplacement;
  const pointerY = springZeroY + currentDisplacement;

  // Helical coil zigzag points
  const coils = 16;
  const coilTop = springZeroY - 20;
  const coilBottom = pointerY - 10;
  const coilHeight = Math.max(30, coilBottom - coilTop);
  const coilPitch = coilHeight / coils;

  const coilPoints: string[] = [];
  coilPoints.push(`${cx},${coilTop}`);
  for (let i = 0; i < coils; i++) {
    const y1 = coilTop + (i + 0.25) * coilPitch;
    const y2 = coilTop + (i + 0.75) * coilPitch;
    coilPoints.push(`${cx - 10},${y1.toFixed(1)}`);
    coilPoints.push(`${cx + 10},${y2.toFixed(1)}`);
  }
  coilPoints.push(`${cx},${coilBottom}`);
  const coilPathD = `M ${coilPoints.join(' L ')}`;

  // Ticks generation
  const tickSpacing = maxDisplacement / capacity;

  const housingColor = state.color ? '#f8fafc' : '#ffffff';
  const headerColor = state.color ? '#c69c6d' : '#e2e8f0';

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Canvas - Sticky Studio Viewport */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden lg:sticky lg:top-24">
        <CanvasToolbar svgRef={svgRef} filename="spring-scale" dimensions={{ width, height }} />

        <div className="p-6 flex items-center justify-center bg-slate-50/50 min-h-[460px] figure-canvas-container overflow-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            className="max-w-full h-auto select-none bg-white shadow-sm border border-slate-200 rounded-lg"
          >
            <rect width={width} height={height} fill="#ffffff" />

            {/* Top Suspension Ring */}
            <circle cx={cx} cy={25} r={12} fill="none" stroke="#111827" strokeWidth={3} />
            <line x1={cx} y1={37} x2={cx} y2={topY} stroke="#111827" strokeWidth={3} />

            {/* Main Outer Scale Body Housing */}
            <rect
              x={cx - scaleWidth / 2}
              y={topY}
              width={scaleWidth}
              height={scaleHeight}
              rx={8}
              fill={housingColor}
              stroke="#111827"
              strokeWidth={2.4}
            />

            {/* Top Header Label Badge */}
            <rect
              x={cx - scaleWidth / 2}
              y={topY}
              width={scaleWidth}
              height={26}
              rx={6}
              fill={headerColor}
              stroke="#111827"
              strokeWidth={2}
            />
            <text
              x={cx}
              y={topY + 17}
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize={12}
              fontWeight="bold"
              fill="#111827"
            >
              {capacity} N
            </text>

            {/* Internal Central Slit Track */}
            <rect
              x={cx - 5}
              y={topY + 32}
              width={10}
              height={scaleHeight - 42}
              rx={3}
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth={1.2}
            />

            {/* Calibrated Ticks & Numerical Labels */}
            {Array.from({ length: capacity + 1 }).map((_, i) => {
              const tickY = springZeroY + i * tickSpacing;
              const isMajor = i % (capacity === 50 ? 5 : 1) === 0;
              return (
                <g key={i}>
                  {/* Left tick */}
                  <line
                    x1={cx - 26}
                    y1={tickY}
                    x2={cx - 10}
                    y2={tickY}
                    stroke="#111827"
                    strokeWidth={isMajor ? 1.6 : 1}
                  />
                  {isMajor && (
                    <text
                      x={cx - 30}
                      y={tickY + 4}
                      textAnchor="end"
                      fontFamily="Arial, sans-serif"
                      fontSize={11}
                      fontWeight="bold"
                      fill="#111827"
                    >
                      {i}
                    </text>
                  )}
                  {/* Sub-divisions between major ticks */}
                  {i < capacity &&
                    Array.from({ length: 4 }).map((_, j) => {
                      const subY = tickY + ((j + 1) * tickSpacing) / 5;
                      return (
                        <line
                          key={j}
                          x1={cx - 18}
                          y1={subY}
                          x2={cx - 10}
                          y2={subY}
                          stroke="#64748b"
                          strokeWidth={0.8}
                        />
                      );
                    })}
                </g>
              );
            })}

            {/* Helical Spring Coil */}
            <path d={coilPathD} fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

            {/* Pointer Collar */}
            <rect
              x={cx - 14}
              y={pointerY - 4}
              width={28}
              height={8}
              rx={1}
              fill={state.color ? '#ef4444' : '#111827'}
              stroke="#111827"
              strokeWidth={1}
            />
            {/* Pointer reading line mark */}
            <line
              x1={cx - 24}
              y1={pointerY}
              x2={cx + 24}
              y2={pointerY}
              stroke={state.color ? '#ef4444' : '#111827'}
              strokeWidth={2}
            />

            {/* Bottom Extension Rod */}
            <line
              x1={cx}
              y1={pointerY}
              x2={cx}
              y2={topY + scaleHeight + 35}
              stroke="#111827"
              strokeWidth={3}
            />

            {/* Bottom Load Hook */}
            <path
              d={`M ${cx} ${topY + scaleHeight + 35} 
                  L ${cx + 10} ${topY + scaleHeight + 46} 
                  V ${topY + scaleHeight + 60} 
                  A 12 12 0 0 1 ${cx - 14} ${topY + scaleHeight + 60} 
                  V ${topY + scaleHeight + 52}`}
              fill="none"
              stroke="#111827"
              strokeWidth={2.8}
              strokeLinecap="round"
            />

            {/* Hanging Mass block */}
            <g>
              <rect
                x={cx - 26}
                y={topY + scaleHeight + 66}
                width={52}
                height={50}
                rx={3}
                fill="#e2e8f0"
                stroke="#111827"
                strokeWidth={2.4}
              />
              <MathText
                x={cx}
                y={topY + scaleHeight + 91}
                label={state.hangingMassLabel}
                fontSize={19}
              />
            </g>

            {/* Numerical Reading Callout */}
            {state.showReadingValue && (
              <g>
                <rect
                  x={cx + 36}
                  y={pointerY - 14}
                  width={56}
                  height={26}
                  rx={4}
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth={1.2}
                />
                <text
                  x={cx + 64}
                  y={pointerY + 4}
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize={12}
                  fontWeight="bold"
                  fill="#111827"
                >
                  {reading.toFixed(1)} N
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Settings */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Spring Scale Calibration
          </h3>
          <SegmentedControl<5 | 10 | 20 | 50>
            label="Scale Capacity"
            value={state.capacity}
            options={[
              { value: 5, label: '5 N' },
              { value: 10, label: '10 N' },
              { value: 20, label: '20 N' },
              { value: 50, label: '50 N' },
            ]}
            onChange={(capacity) => onChange({ ...state, capacity, reading: Math.min(state.reading, capacity) })}
          />

          <Slider
            label="Applied Force / Reading"
            value={state.reading}
            min={0}
            max={state.capacity}
            step={state.capacity === 50 ? 1 : 0.1}
            unit=" N"
            onChange={(reading) => onChange({ ...state, reading })}
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Options & Mass
          </h3>
          <LabelInput
            label="Hanging Mass Label"
            value={state.hangingMassLabel}
            onChange={(hangingMassLabel) => onChange({ ...state, hangingMassLabel })}
          />
          <Checkbox
            label="Show numerical reading badge"
            checked={state.showReadingValue}
            onChange={(showReadingValue) => onChange({ ...state, showReadingValue })}
          />
          <Checkbox
            label="Color indicator collar"
            checked={state.color}
            onChange={(color) => onChange({ ...state, color })}
          />
        </div>
      </div>
    </div>
  );
};
