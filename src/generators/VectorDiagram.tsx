import React, { useRef } from 'react';
import type { VectorDiagramState, GridVector } from '../types/figures';
import { MathText } from '../components/MathText';
import { computeArrow, polarToCartesian, radToDeg } from '../engine/math';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { LabelInput } from '../components/Controls/LabelInput';
import { Checkbox } from '../components/Controls/Checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface VectorDiagramProps {
  state: VectorDiagramState;
  onChange: (newState: VectorDiagramState) => void;
}

export const defaultVectorDiagramState: VectorDiagramState = {
  gridSize: 7,
  showGrid: true,
  vectors: [
    {
      id: 'v1',
      name: 'A',
      dx: 4,
      dy: 1,
      label: { mode: 'text', text: 'A' },
      color: '#2563eb',
    },
    {
      id: 'v2',
      name: 'B',
      dx: 1,
      dy: 3,
      label: { mode: 'text', text: 'B' },
      color: '#059669',
    },
    {
      id: 'v3',
      name: 'C',
      dx: -2,
      dy: 1,
      label: { mode: 'text', text: 'C' },
      color: '#d97706',
    },
  ],
  showResultant: true,
  resultantLabel: { mode: 'text', text: 'R' },
  vectorNotation: 'arrow',
  mirror: false,
  color: true,
};

export const VectorDiagram: React.FC<VectorDiagramProps> = ({
  state,
  onChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const cellSize = 38;
  const padding = 45;
  const gridCells = state.gridSize;
  const width = gridCells * cellSize + padding * 2;
  const height = gridCells * cellSize + padding * 2;

  // Grid start position
  const startGridX = 1;
  const startGridY = gridCells - 2;

  // Compute head-to-tail positions
  let currentGridX = startGridX;
  let currentGridY = startGridY;

  const vectorSegments: {
    vector: GridVector;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    arrow: ReturnType<typeof computeArrow>;
  }[] = [];

  for (const vec of state.vectors) {
    const p1x = padding + currentGridX * cellSize;
    const p1y = padding + currentGridY * cellSize;

    const nextX = currentGridX + vec.dx;
    const nextY = currentGridY - vec.dy; // y is inverted in SVG

    const p2x = padding + nextX * cellSize;
    const p2y = padding + nextY * cellSize;

    const angle = radToDeg(Math.atan2(-(p2y - p1y), p2x - p1x));
    const len = Math.hypot(p2x - p1x, p2y - p1y);
    const arrow = computeArrow(p1x, p1y, angle, len, 14, 10);

    vectorSegments.push({
      vector: vec,
      startX: p1x,
      startY: p1y,
      endX: p2x,
      endY: p2y,
      arrow,
    });

    currentGridX = nextX;
    currentGridY = nextY;
  }

  // Resultant vector from (startGridX, startGridY) to final current position
  const resStartX = padding + startGridX * cellSize;
  const resStartY = padding + startGridY * cellSize;
  const resEndX = padding + currentGridX * cellSize;
  const resEndY = padding + currentGridY * cellSize;
  const resAngle = radToDeg(Math.atan2(-(resEndY - resStartY), resEndX - resStartX));
  const resLen = Math.hypot(resEndX - resStartX, resEndY - resStartY);
  const resultantArrow = computeArrow(resStartX, resStartY, resAngle, resLen, 14, 10);

  const addVector = () => {
    if (state.vectors.length >= 4) return;
    const names = ['A', 'B', 'C', 'D'];
    const name = names[state.vectors.length] || 'V';
    const newVec: GridVector = {
      id: `v_${Date.now()}`,
      name,
      dx: 2,
      dy: 2,
      label: { mode: 'text', text: name },
    };
    onChange({
      ...state,
      vectors: [...state.vectors, newVec],
    });
  };

  const removeVector = (id: string) => {
    onChange({
      ...state,
      vectors: state.vectors.filter((v) => v.id !== id),
    });
  };

  const updateVector = (id: string, updates: Partial<GridVector>) => {
    onChange({
      ...state,
      vectors: state.vectors.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Visual Canvas - Sticky Studio Viewport */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden lg:sticky lg:top-24">
        <CanvasToolbar svgRef={svgRef} filename="vector-diagram" dimensions={{ width, height }} />

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

            {/* Background Grid */}
            {state.showGrid && (
              <g stroke="#e2e8f0" strokeWidth={1}>
                {Array.from({ length: gridCells + 1 }).map((_, i) => (
                  <React.Fragment key={i}>
                    {/* Vertical lines */}
                    <line
                      x1={padding + i * cellSize}
                      y1={padding}
                      x2={padding + i * cellSize}
                      y2={padding + gridCells * cellSize}
                    />
                    {/* Horizontal lines */}
                    <line
                      x1={padding}
                      y1={padding + i * cellSize}
                      x2={padding + gridCells * cellSize}
                      y2={padding + i * cellSize}
                    />
                  </React.Fragment>
                ))}
              </g>
            )}

            {/* Individual Vectors (Head to Tail) */}
            {vectorSegments.map(({ vector, arrow }) => {
              const strokeColor = state.color ? vector.color || '#111827' : '#111827';
              const angle = radToDeg(Math.atan2(-(arrow.endY - arrow.startY), arrow.endX - arrow.startX));
              const midX = (arrow.startX + arrow.endX) / 2;
              const midY = (arrow.startY + arrow.endY) / 2;
              // Label perpendicular offset
              const labelPos = polarToCartesian(midX, midY, 18, angle + 90);

              return (
                <g key={vector.id}>
                  <line
                    x1={arrow.startX}
                    y1={arrow.startY}
                    x2={arrow.endX}
                    y2={arrow.endY}
                    stroke={strokeColor}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <polygon points={arrow.headPoints} fill={strokeColor} />

                  <MathText
                    x={labelPos.x}
                    y={labelPos.y}
                    label={vector.label}
                    fontSize={22}
                    vectorNotation={state.vectorNotation}
                    fill={strokeColor}
                  />
                </g>
              );
            })}

            {/* Resultant Vector */}
            {state.showResultant && (
              <g>
                <line
                  x1={resultantArrow.startX}
                  y1={resultantArrow.startY}
                  x2={resultantArrow.endX}
                  y2={resultantArrow.endY}
                  stroke={state.color ? '#dc2626' : '#111827'}
                  strokeWidth={3}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
                <polygon
                  points={resultantArrow.headPoints}
                  fill={state.color ? '#dc2626' : '#111827'}
                />

                {(() => {
                  const midX = (resultantArrow.startX + resultantArrow.endX) / 2;
                  const midY = (resultantArrow.startY + resultantArrow.endY) / 2;
                  const labelPos = polarToCartesian(midX, midY, 20, resAngle - 90);
                  return (
                    <MathText
                      x={labelPos.x}
                      y={labelPos.y}
                      label={state.resultantLabel}
                      fontSize={22}
                      vectorNotation={state.vectorNotation}
                      fill={state.color ? '#dc2626' : '#111827'}
                    />
                  );
                })()}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Settings Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        {/* Vectors Configuration */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-900 text-sm">
              Vectors ({state.vectors.length}/4)
            </h3>
            {state.vectors.length < 4 && (
              <button
                type="button"
                onClick={addVector}
                className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-800 font-semibold rounded-lg hover:bg-emerald-100 border border-emerald-200/60 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add vector
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 divide-y divide-slate-100">
            {state.vectors.map((vec, idx) => (
              <div key={vec.id} className="pt-3 first:pt-0 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">
                    Vector {idx + 1} ({vec.name})
                  </span>
                  {state.vectors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVector(vec.id)}
                      className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Remove vector"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Slider
                    label="Δx (right/left)"
                    value={vec.dx}
                    min={-5}
                    max={5}
                    step={1}
                    onChange={(dx) => updateVector(vec.id, { dx })}
                  />
                  <Slider
                    label="Δy (up/down)"
                    value={vec.dy}
                    min={-5}
                    max={5}
                    step={1}
                    onChange={(dy) => updateVector(vec.id, { dy })}
                  />
                </div>

                <LabelInput
                  label="Label"
                  value={vec.label}
                  onChange={(label) => updateVector(vec.id, { label })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Global Resultant & Grid Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3.5">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Resultant & Grid Options
          </h3>

          <Slider
            label="Grid Size"
            value={state.gridSize}
            min={5}
            max={10}
            step={1}
            unit=" cells"
            onChange={(gridSize) => onChange({ ...state, gridSize })}
          />

          <SegmentedControl
            label="Vector notation"
            value={state.vectorNotation}
            options={[
              { value: 'none', label: 'Plain (A)' },
              { value: 'arrow', label: 'Arrow (A⃗)' },
              { value: 'bold', label: 'Bold (A)' },
            ]}
            onChange={(vectorNotation) => onChange({ ...state, vectorNotation })}
          />

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <Checkbox
              label="Show grid lines"
              checked={state.showGrid}
              onChange={(showGrid) => onChange({ ...state, showGrid })}
            />
            <Checkbox
              label="Show resultant vector (R⃗)"
              checked={state.showResultant}
              onChange={(showResultant) => onChange({ ...state, showResultant })}
            />
            {state.showResultant && (
              <LabelInput
                label="Resultant label"
                value={state.resultantLabel}
                onChange={(resultantLabel) => onChange({ ...state, resultantLabel })}
              />
            )}
            <Checkbox
              label="Color lines"
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
    </div>
  );
};
