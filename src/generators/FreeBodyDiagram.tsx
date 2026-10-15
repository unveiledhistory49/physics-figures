import React, { useRef } from 'react';
import type {
  FreeBodyDiagramState,
  ForceItem,
  BodyType,
} from '../types/figures';
import { MathText } from '../components/MathText';
import {
  computeArrow,
  calculateParallelOffsets,
  describeArc,
  polarToCartesian,
} from '../engine/math';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { AnglePicker } from '../components/Controls/AnglePicker';
import { LabelInput } from '../components/Controls/LabelInput';
import { Checkbox } from '../components/Controls/Checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface FreeBodyDiagramProps {
  state: FreeBodyDiagramState;
  onChange: (newState: FreeBodyDiagramState) => void;
}

export const defaultFreeBodyDiagramState: FreeBodyDiagramState = {
  body: 'block',
  bodySize: 1.0,
  forces: [
    {
      id: 'f1',
      name: 'Gravity',
      direction: 270,
      length: 1.0,
      label: { mode: 'text', text: 'F_g' },
    },
    {
      id: 'f2',
      name: 'Normal',
      direction: 90,
      length: 1.0,
      label: { mode: 'text', text: 'F_N' },
    },
    {
      id: 'f3',
      name: 'Applied',
      direction: 0,
      length: 1.2,
      label: { mode: 'text', text: 'F_A' },
    },
    {
      id: 'f4',
      name: 'Friction',
      direction: 180,
      length: 0.8,
      label: { mode: 'text', text: 'F_f' },
    },
  ],
  vectorNotation: 'none',
  showVelocity: false,
  velocityAngle: 0,
  velocityLabel: { mode: 'text', text: 'v' },
  showAcceleration: false,
  accelerationAngle: 0,
  accelerationLabel: { mode: 'text', text: 'a' },
  mirror: false,
  color: false,
};

export const FreeBodyDiagram: React.FC<FreeBodyDiagramProps> = ({
  state,
  onChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const cx = 220;
  const cy = 200;
  const width = 440;
  const height = 400;

  // Base force pixel length multiplier
  const baseArrowLength = 110;

  // Compute parallel offsets
  const offsets = calculateParallelOffsets(
    state.forces.map((f) => ({ id: f.id, direction: f.direction }))
  );

  const addForcePreset = (presetName: string, defaultDeg: number, labelText: string) => {
    if (state.forces.length >= 8) return;
    const newForce: ForceItem = {
      id: `f_${Date.now()}`,
      name: presetName,
      direction: defaultDeg,
      length: 1.0,
      label: { mode: 'text', text: labelText },
    };
    onChange({
      ...state,
      forces: [...state.forces, newForce],
    });
  };

  const removeForce = (id: string) => {
    onChange({
      ...state,
      forces: state.forces.filter((f) => f.id !== id),
    });
  };

  const updateForce = (id: string, updates: Partial<ForceItem>) => {
    onChange({
      ...state,
      forces: state.forces.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  // Color theme palettes
  const forceColor = state.color ? '#2563eb' : '#111827';
  const componentColor = state.color ? '#0284c7' : '#4b5563';
  const bodyFill = state.color ? '#f1f5f9' : '#e5e7eb';
  const bodyStroke = '#111827';

  // Render central physical body
  const renderBody = () => {
    const s = state.bodySize;
    switch (state.body) {
      case 'dot':
        return <circle cx={cx} cy={cy} r={6 * s} fill={bodyStroke} />;
      case 'block':
        const bw = 56 * s;
        const bh = 56 * s;
        return (
          <rect
            x={cx - bw / 2}
            y={cy - bh / 2}
            width={bw}
            height={bh}
            rx={2}
            fill={bodyFill}
            stroke={bodyStroke}
            strokeWidth={2.5}
          />
        );
      case 'ball':
        return (
          <circle
            cx={cx}
            cy={cy}
            r={28 * s}
            fill={bodyFill}
            stroke={bodyStroke}
            strokeWidth={2.5}
          />
        );
      case 'cart':
        const cw = 70 * s;
        const ch = 40 * s;
        const wr = 8 * s;
        return (
          <g>
            <rect
              x={cx - cw / 2}
              y={cy - ch / 2 - 4 * s}
              width={cw}
              height={ch}
              rx={3}
              fill={bodyFill}
              stroke={bodyStroke}
              strokeWidth={2.5}
            />
            {/* Wheels */}
            <circle
              cx={cx - cw * 0.3}
              cy={cy + ch / 2 + wr - 4 * s}
              r={wr}
              fill="#94a3b8"
              stroke={bodyStroke}
              strokeWidth={2}
            />
            <circle
              cx={cx + cw * 0.3}
              cy={cy + ch / 2 + wr - 4 * s}
              r={wr}
              fill="#94a3b8"
              stroke={bodyStroke}
              strokeWidth={2}
            />
          </g>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Visual Canvas Area - Sticky Studio Viewport */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden lg:sticky lg:top-24">
        <CanvasToolbar svgRef={svgRef} filename="free-body-diagram" dimensions={{ width, height }} />

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
            {/* Background canvas paper */}
            <rect width={width} height={height} fill="#ffffff" />

            {/* Central Physical Body */}
            {renderBody()}

            {/* Forces Vectors */}
            {state.forces.map((force) => {
              const offset = offsets.get(force.id) || { offsetX: 0, offsetY: 0 };
              const originX = cx + offset.offsetX;
              const originY = cy + offset.offsetY;
              const len = force.length * baseArrowLength;
              const arrow = computeArrow(originX, originY, force.direction, len, 14, 11);

              // Label placement along the arrowhead
              const labelPos = polarToCartesian(
                arrow.tipX,
                arrow.tipY,
                24,
                force.direction
              );

              // Orthogonal components if enabled
              const rad = (force.direction * Math.PI) / 180;
              const isDiagonal = force.direction % 90 !== 0;
              const compLenX = len * Math.cos(rad);
              const compLenY = -len * Math.sin(rad);

              return (
                <g key={force.id}>
                  {/* Optional Angle Arc */}
                  {force.showAngle && isDiagonal && (
                    <g opacity={0.85}>
                      <path
                        d={describeArc(
                          originX,
                          originY,
                          34,
                          0,
                          force.direction % 360
                        )}
                        fill="none"
                        stroke="#4b5563"
                        strokeWidth={1.5}
                      />
                      {/* Arc label */}
                      <MathText
                        x={originX + 46 * Math.cos(rad / 2)}
                        y={originY - 46 * Math.sin(rad / 2)}
                        label={force.angleLabel || { mode: 'text', text: 'θ' }}
                        fontSize={16}
                      />
                    </g>
                  )}

                  {/* Optional Components */}
                  {force.showComponents && isDiagonal && (
                    <g strokeDasharray="4 3" stroke={componentColor} strokeWidth={1.5}>
                      {/* X Component */}
                      <line
                        x1={originX}
                        y1={originY}
                        x2={originX + compLenX}
                        y2={originY}
                      />
                      {/* Y Component */}
                      <line
                        x1={originX + compLenX}
                        y1={originY}
                        x2={originX + compLenX}
                        y2={originY + compLenY}
                      />
                      {/* Component Labels */}
                      <MathText
                        x={originX + compLenX / 2}
                        y={originY + (compLenY > 0 ? -14 : 16)}
                        label={force.xLabel || { mode: 'text', text: `${force.label.text}_x` }}
                        fontSize={16}
                        fill={componentColor}
                      />
                      <MathText
                        x={originX + compLenX + (compLenX > 0 ? 20 : -20)}
                        y={originY + compLenY / 2}
                        label={force.yLabel || { mode: 'text', text: `${force.label.text}_y` }}
                        fontSize={16}
                        fill={componentColor}
                      />
                    </g>
                  )}

                  {/* Main Vector Shaft Line */}
                  <line
                    x1={arrow.startX}
                    y1={arrow.startY}
                    x2={arrow.endX}
                    y2={arrow.endY}
                    stroke={forceColor}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />

                  {/* Vector Arrowhead Polygon */}
                  <polygon points={arrow.headPoints} fill={forceColor} />

                  {/* Force Label */}
                  <MathText
                    x={labelPos.x}
                    y={labelPos.y}
                    label={force.label}
                    fontSize={22}
                    vectorNotation={state.vectorNotation}
                  />
                </g>
              );
            })}

            {/* Velocity Indicator (Dashed, beside body) */}
            {state.showVelocity && (
              <g opacity={0.8}>
                {(() => {
                  const arrow = computeArrow(cx + 45, cy - 45, state.velocityAngle, 65, 12, 9);
                  const labelPos = polarToCartesian(arrow.tipX, arrow.tipY, 18, state.velocityAngle);
                  return (
                    <>
                      <line
                        x1={arrow.startX}
                        y1={arrow.startY}
                        x2={arrow.endX}
                        y2={arrow.endY}
                        stroke="#16a34a"
                        strokeWidth={2.2}
                        strokeDasharray="5 3"
                      />
                      <polygon points={arrow.headPoints} fill="#16a34a" />
                      <MathText
                        x={labelPos.x}
                        y={labelPos.y}
                        label={state.velocityLabel}
                        fontSize={18}
                        fill="#16a34a"
                        vectorNotation={state.vectorNotation}
                      />
                    </>
                  );
                })()}
              </g>
            )}

            {/* Acceleration Indicator (Dashed, beside body) */}
            {state.showAcceleration && (
              <g opacity={0.8}>
                {(() => {
                  const arrow = computeArrow(cx - 45, cy - 45, state.accelerationAngle, 65, 12, 9);
                  const labelPos = polarToCartesian(arrow.tipX, arrow.tipY, 18, state.accelerationAngle);
                  return (
                    <>
                      <line
                        x1={arrow.startX}
                        y1={arrow.startY}
                        x2={arrow.endX}
                        y2={arrow.endY}
                        stroke="#dc2626"
                        strokeWidth={2.2}
                        strokeDasharray="5 3"
                      />
                      <polygon points={arrow.headPoints} fill="#dc2626" />
                      <MathText
                        x={labelPos.x}
                        y={labelPos.y}
                        label={state.accelerationLabel}
                        fontSize={18}
                        fill="#dc2626"
                        vectorNotation={state.vectorNotation}
                      />
                    </>
                  );
                })()}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Editor Controls Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        {/* Physical Body Settings */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3.5">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Central Body
          </h3>
          <SegmentedControl<BodyType>
            label="Body representation"
            value={state.body}
            options={[
              { value: 'dot', label: 'Dot' },
              { value: 'block', label: 'Block' },
              { value: 'ball', label: 'Ball' },
              { value: 'cart', label: 'Cart' },
            ]}
            onChange={(body) => onChange({ ...state, body })}
          />
          {state.body !== 'dot' && (
            <Slider
              label="Body size"
              value={state.bodySize}
              min={0.5}
              max={2.0}
              step={0.1}
              unit="×"
              onChange={(bodySize) => onChange({ ...state, bodySize })}
            />
          )}
        </div>

        {/* Forces List */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-900 text-sm">
              Forces ({state.forces.length}/8)
            </h3>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-500">Add force preset:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => addForcePreset('Gravity', 270, 'F_g')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Gravity
              </button>
              <button
                type="button"
                onClick={() => addForcePreset('Normal', 90, 'F_N')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Normal
              </button>
              <button
                type="button"
                onClick={() => addForcePreset('Friction', 180, 'F_f')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Friction
              </button>
              <button
                type="button"
                onClick={() => addForcePreset('Tension', 90, 'T')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Tension
              </button>
              <button
                type="button"
                onClick={() => addForcePreset('Applied', 0, 'F_A')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Applied
              </button>
            </div>
          </div>

          {/* List of active forces */}
          <div className="flex flex-col gap-4 divide-y divide-slate-100">
            {state.forces.map((force, idx) => (
              <div key={force.id} className="pt-3 first:pt-0 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">
                    Force {idx + 1}: {force.name || 'Custom'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeForce(force.id)}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Remove force"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <AnglePicker
                  label="Direction"
                  value={force.direction}
                  onChange={(direction) => updateForce(force.id, { direction })}
                />

                <Slider
                  label="Length"
                  value={force.length}
                  min={0.25}
                  max={2.0}
                  step={0.05}
                  unit="×"
                  onChange={(length) => updateForce(force.id, { length })}
                />

                <LabelInput
                  label="Label"
                  value={force.label}
                  onChange={(label) => updateForce(force.id, { label })}
                />

                {/* Additional force geometry checkboxes */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Checkbox
                    label="Angle arc"
                    checked={!!force.showAngle}
                    onChange={(showAngle) => updateForce(force.id, { showAngle })}
                  />
                  <Checkbox
                    label="Components"
                    checked={!!force.showComponents}
                    onChange={(showComponents) => updateForce(force.id, { showComponents })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Figure Settings */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3.5">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Figure & Notation Options
          </h3>
          <SegmentedControl
            label="Vector notation"
            value={state.vectorNotation}
            options={[
              { value: 'none', label: 'Plain (F)' },
              { value: 'arrow', label: 'Arrow (F⃗)' },
              { value: 'bold', label: 'Bold (F)' },
            ]}
            onChange={(vectorNotation) => onChange({ ...state, vectorNotation })}
          />

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <Checkbox
              label="Show velocity vector (v⃗)"
              description="Dashed green vector beside the body"
              checked={state.showVelocity}
              onChange={(showVelocity) => onChange({ ...state, showVelocity })}
            />
            <Checkbox
              label="Show acceleration vector (a⃗)"
              description="Dashed red vector beside the body"
              checked={state.showAcceleration}
              onChange={(showAcceleration) => onChange({ ...state, showAcceleration })}
            />
            <Checkbox
              label="Mirror (flip horizontal)"
              checked={state.mirror}
              onChange={(mirror) => onChange({ ...state, mirror })}
            />
            <Checkbox
              label="Color (for presentation slides)"
              checked={state.color}
              onChange={(color) => onChange({ ...state, color })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
