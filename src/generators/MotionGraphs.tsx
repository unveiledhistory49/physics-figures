import React, { useRef } from 'react';
import type { MotionGraphsState, MotionSegment } from '../types/figures';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { Checkbox } from '../components/Controls/Checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface MotionGraphsProps {
  state: MotionGraphsState;
  onChange: (newState: MotionGraphsState) => void;
}

export const defaultMotionGraphsState: MotionGraphsState = {
  graphType: 'position',
  timeMax: 12,
  valueMin: 0,
  valueMax: 30,
  segments: [
    {
      id: 's1',
      duration: 3,
      startValue: 0,
      endValue: 10,
      type: 'parabolic-accelerating',
    },
    {
      id: 's2',
      duration: 4,
      startValue: 10,
      endValue: 25,
      type: 'linear',
    },
    {
      id: 's3',
      duration: 3,
      startValue: 25,
      endValue: 25,
      type: 'constant',
    },
    {
      id: 's4',
      duration: 2,
      startValue: 25,
      endValue: 0,
      type: 'linear',
    },
  ],
  showGrid: true,
  timeUnit: 's',
  valueUnit: 'm',
  mirror: false,
  color: true,
};

export const MotionGraphs: React.FC<MotionGraphsProps> = ({ state, onChange }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 580;
  const height = 360;

  const originX = 75;
  const originY = 280;
  const plotWidth = 460;
  const plotHeight = 230;

  const totalTime = Math.max(
    state.timeMax,
    state.segments.reduce((acc, s) => acc + s.duration, 0)
  );
  const valSpan = state.valueMax - state.valueMin || 1;

  // Coordinate mapper functions
  const mapT = (t: number) => originX + (t / totalTime) * plotWidth;
  const mapV = (v: number) => originY - ((v - state.valueMin) / valSpan) * plotHeight;

  // Build SVG path curves for all piecewise segments
  let currentT = 0;
  const pathParts: string[] = [];

  state.segments.forEach((seg, idx) => {
    const t0 = currentT;
    const t1 = currentT + seg.duration;
    const x0 = mapT(t0);
    const y0 = mapV(seg.startValue);
    const x1 = mapT(t1);
    const y1 = mapV(seg.endValue);

    if (idx === 0) {
      pathParts.push(`M ${x0.toFixed(1)} ${y0.toFixed(1)}`);
    }

    if (seg.type === 'linear' || seg.type === 'constant') {
      pathParts.push(`L ${x1.toFixed(1)} ${y1.toFixed(1)}`);
    } else if (seg.type === 'parabolic-accelerating') {
      // Quadratic curve with flat horizontal start
      const cx = (x0 + x1) / 2;
      const cy = y0;
      pathParts.push(`Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`);
    } else if (seg.type === 'parabolic-decelerating') {
      // Quadratic curve flattening at the end
      const cx = (x0 + x1) / 2;
      const cy = y1;
      pathParts.push(`Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`);
    }

    currentT = t1;
  });

  const fullPathD = pathParts.join(' ');

  const addSegment = () => {
    const lastSeg = state.segments[state.segments.length - 1];
    const lastEnd = lastSeg ? lastSeg.endValue : 0;
    const newSeg: MotionSegment = {
      id: `seg_${Date.now()}`,
      duration: 3,
      startValue: lastEnd,
      endValue: Math.min(state.valueMax, lastEnd + 10),
      type: 'linear',
    };
    onChange({
      ...state,
      segments: [...state.segments, newSeg],
    });
  };

  const removeSegment = (id: string) => {
    onChange({
      ...state,
      segments: state.segments.filter((s) => s.id !== id),
    });
  };

  const updateSegment = (id: string, updates: Partial<MotionSegment>) => {
    onChange({
      ...state,
      segments: state.segments.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const axisLabels: Record<string, { yLabel: string; unit: string }> = {
    position: { yLabel: 'Position (m)', unit: 'm' },
    velocity: { yLabel: 'Velocity (m/s)', unit: 'm/s' },
    acceleration: { yLabel: 'Acceleration (m/s²)', unit: 'm/s²' },
  };

  const currentLabelInfo = axisLabels[state.graphType];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Canvas - Sticky Studio Viewport */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden lg:sticky lg:top-24">
        <CanvasToolbar svgRef={svgRef} filename="motion-graph" dimensions={{ width, height }} />

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

            {/* Grid Lines */}
            {state.showGrid && (
              <g stroke="#e2e8f0" strokeWidth={1}>
                {/* Vertical time grid lines */}
                {Array.from({ length: totalTime + 1 }).map((_, i) => (
                  <line
                    key={`t_${i}`}
                    x1={mapT(i)}
                    y1={originY - plotHeight}
                    x2={mapT(i)}
                    y2={originY}
                  />
                ))}
                {/* Horizontal value grid lines */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const val = state.valueMin + (i * valSpan) / 5;
                  return (
                    <line
                      key={`v_${i}`}
                      x1={originX}
                      y1={mapV(val)}
                      x2={originX + plotWidth}
                      y2={mapV(val)}
                    />
                  );
                })}
              </g>
            )}

            {/* Axes */}
            <g stroke="#111827" strokeWidth={2}>
              {/* X Axis (Time) */}
              <line x1={originX} y1={originY} x2={originX + plotWidth + 15} y2={originY} />
              {/* Y Axis (Value) */}
              <line x1={originX} y1={originY} x2={originX} y2={originY - plotHeight - 15} />

              {/* Axis Arrows */}
              <polygon
                points={`${originX + plotWidth + 24},${originY} ${originX + plotWidth + 14},${originY - 5} ${originX + plotWidth + 14},${originY + 5}`}
                fill="#111827"
              />
              <polygon
                points={`${originX},${originY - plotHeight - 24} ${originX - 5},${originY - plotHeight - 14} ${originX + 5},${originY - plotHeight - 14}`}
                fill="#111827"
              />
            </g>

            {/* Numerical Axis Ticks */}
            <g fontFamily="Arial, sans-serif" fontSize={12} fill="#4b5563" fontWeight="bold">
              {/* X ticks */}
              {Array.from({ length: Math.floor(totalTime) + 1 }).map((_, i) => {
                if (i % 2 !== 0 && totalTime > 8) return null;
                return (
                  <text key={i} x={mapT(i)} y={originY + 16} textAnchor="middle">
                    {i}
                  </text>
                );
              })}
              {/* Y ticks */}
              {Array.from({ length: 6 }).map((_, i) => {
                const val = state.valueMin + Math.round((i * valSpan) / 5);
                return (
                  <text key={i} x={originX - 10} y={mapV(val) + 4} textAnchor="end">
                    {val}
                  </text>
                );
              })}
            </g>

            {/* Axis Titles */}
            <text
              x={originX + plotWidth / 2}
              y={originY + 40}
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize={14}
              fontWeight="bold"
              fill="#111827"
            >
              Time ({state.timeUnit})
            </text>
            <text
              x={22}
              y={originY - plotHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 22 ${originY - plotHeight / 2})`}
              fontFamily="Arial, sans-serif"
              fontSize={14}
              fontWeight="bold"
              fill="#111827"
            >
              {currentLabelInfo.yLabel}
            </text>

            {/* Graph Curve Line */}
            <path
              d={fullPathD}
              fill="none"
              stroke={state.color ? '#059669' : '#111827'}
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Settings */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Graph Type
          </h3>
          <SegmentedControl<'position' | 'velocity' | 'acceleration'>
            label="Plotted quantity"
            value={state.graphType}
            options={[
              { value: 'position', label: 'Position (x-t)' },
              { value: 'velocity', label: 'Velocity (v-t)' },
              { value: 'acceleration', label: 'Accel (a-t)' },
            ]}
            onChange={(graphType) => onChange({ ...state, graphType })}
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Slider
              label="Min Value"
              value={state.valueMin}
              min={-20}
              max={10}
              step={5}
              onChange={(valueMin) => onChange({ ...state, valueMin })}
            />
            <Slider
              label="Max Value"
              value={state.valueMax}
              min={10}
              max={60}
              step={5}
              onChange={(valueMax) => onChange({ ...state, valueMax })}
            />
          </div>
        </div>

        {/* Piecewise Segments */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-900 text-sm">
              Segments ({state.segments.length})
            </h3>
            <button
              type="button"
              onClick={addSegment}
              className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-800 font-semibold rounded-lg hover:bg-emerald-100 border border-emerald-200/60 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add segment
            </button>
          </div>

          <div className="flex flex-col gap-4 divide-y divide-slate-100">
            {state.segments.map((seg, idx) => (
              <div key={seg.id} className="pt-3 first:pt-0 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">
                    Segment {idx + 1}
                  </span>
                  {state.segments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSegment(seg.id)}
                      className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Remove segment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <SegmentedControl<MotionSegment['type']>
                  label="Segment behavior"
                  value={seg.type}
                  options={[
                    { value: 'linear', label: 'Linear' },
                    { value: 'constant', label: 'Flat' },
                    { value: 'parabolic-accelerating', label: 'Curve ↑' },
                    { value: 'parabolic-decelerating', label: 'Curve ↓' },
                  ]}
                  onChange={(type) => updateSegment(seg.id, { type })}
                />

                <div className="grid grid-cols-3 gap-2">
                  <Slider
                    label="Δt"
                    value={seg.duration}
                    min={1}
                    max={6}
                    step={1}
                    unit="s"
                    onChange={(duration) => updateSegment(seg.id, { duration })}
                  />
                  <Slider
                    label="Start"
                    value={seg.startValue}
                    min={state.valueMin}
                    max={state.valueMax}
                    step={5}
                    onChange={(startValue) => updateSegment(seg.id, { startValue })}
                  />
                  <Slider
                    label="End"
                    value={seg.endValue}
                    min={state.valueMin}
                    max={state.valueMax}
                    step={5}
                    onChange={(endValue) => updateSegment(seg.id, { endValue })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <Checkbox
            label="Show background grid"
            checked={state.showGrid}
            onChange={(showGrid) => onChange({ ...state, showGrid })}
          />
          <Checkbox
            label="Color curve"
            checked={state.color}
            onChange={(color) => onChange({ ...state, color })}
          />
          <Checkbox
            label="Mirror (flip horizontal)"
            checked={state.mirror}
            onChange={(mirror) => onChange({ ...state, mirror })}
          />
        </div>
      </div>
    </div>
  );
};
