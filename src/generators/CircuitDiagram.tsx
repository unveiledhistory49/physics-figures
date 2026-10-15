import React, { useRef } from 'react';
import type { CircuitDiagramState, CircuitElement } from '../types/figures';
import { MathText } from '../components/MathText';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { Checkbox } from '../components/Controls/Checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface CircuitDiagramProps {
  state: CircuitDiagramState;
  onChange: (newState: CircuitDiagramState) => void;
}

export const defaultCircuitDiagramState: CircuitDiagramState = {
  layout: 'series',
  elements: [
    { id: 'e1', type: 'battery', value: '12 V', position: 'left' },
    { id: 'e2', type: 'switch', value: 'S_1', position: 'top', isOpen: false },
    { id: 'e3', type: 'resistor', value: '10 Ω', position: 'right' },
    { id: 'e4', type: 'bulb', value: 'L_1', position: 'bottom' },
  ],
  batteryVoltage: '12 V',
  mirror: false,
  color: true,
};

export const CircuitDiagram: React.FC<CircuitDiagramProps> = ({ state, onChange }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 520;
  const height = 400;

  // Circuit loop bounds
  const x1 = 90;
  const x2 = 430;
  const y1 = 70;
  const y2 = 330;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const wireColor = '#111827';

  // Render individual schematic symbols centered at (cx, cy) along a line
  const renderElement = (elem: CircuitElement) => {
    let cx = midX;
    let cy = y1;
    let isVertical = false;

    if (elem.position === 'top') {
      cx = midX;
      cy = y1;
    } else if (elem.position === 'bottom') {
      cx = midX;
      cy = y2;
    } else if (elem.position === 'left') {
      cx = x1;
      cy = midY;
      isVertical = true;
    } else if (elem.position === 'right') {
      cx = x2;
      cy = midY;
      isVertical = true;
    }

    switch (elem.type) {
      case 'battery':
        return (
          <g key={elem.id}>
            {/* Battery symbol: Long thin plate, short thick plate */}
            <rect x={cx - 16} y={cy - 20} width={32} height={40} fill="#ffffff" />
            <line x1={cx - 14} y1={cy} x2={cx - 5} y2={cy} stroke={wireColor} strokeWidth={2.4} />
            {/* Long thin plate (+) */}
            <line x1={cx - 5} y1={cy - 16} x2={cx - 5} y2={cy + 16} stroke={wireColor} strokeWidth={2.2} />
            {/* Short thick plate (-) */}
            <line x1={cx + 5} y1={cy - 9} x2={cx + 5} y2={cy + 9} stroke={wireColor} strokeWidth={3.6} />
            <line x1={cx + 5} y1={cy} x2={cx + 14} y2={cy} stroke={wireColor} strokeWidth={2.4} />
            <MathText x={cx} y={cy - 26} label={{ mode: 'text', text: elem.value }} fontSize={17} />
          </g>
        );

      case 'resistor':
        return (
          <g key={elem.id}>
            <rect
              x={isVertical ? cx - 18 : cx - 30}
              y={isVertical ? cy - 30 : cy - 18}
              width={isVertical ? 36 : 60}
              height={isVertical ? 60 : 36}
              fill="#ffffff"
            />
            {isVertical ? (
              // Vertical zigzag
              <path
                d={`M ${cx} ${cy - 28} 
                    L ${cx} ${cy - 20} 
                    L ${cx + 10} ${cy - 14} 
                    L ${cx - 10} ${cy - 6} 
                    L ${cx + 10} ${cy + 2} 
                    L ${cx - 10} ${cy + 10} 
                    L ${cx + 10} ${cy + 18} 
                    L ${cx} ${cy + 24} 
                    L ${cx} ${cy + 28}`}
                fill="none"
                stroke={wireColor}
                strokeWidth={2.4}
                strokeLinejoin="round"
              />
            ) : (
              // Horizontal zigzag
              <path
                d={`M ${cx - 28} ${cy} 
                    L ${cx - 20} ${cy} 
                    L ${cx - 14} ${cy - 10} 
                    L ${cx - 6} ${cy + 10} 
                    L ${cx + 2} ${cy - 10} 
                    L ${cx + 10} ${cy + 10} 
                    L ${cx + 18} ${cy - 10} 
                    L ${cx + 24} ${cy} 
                    L ${cx + 28} ${cy}`}
                fill="none"
                stroke={wireColor}
                strokeWidth={2.4}
                strokeLinejoin="round"
              />
            )}
            <MathText
              x={isVertical ? cx + 28 : cx}
              y={isVertical ? cy : cy - 22}
              label={{ mode: 'text', text: elem.value }}
              fontSize={17}
            />
          </g>
        );

      case 'bulb':
        return (
          <g key={elem.id}>
            <rect
              x={cx - 20}
              y={cy - 20}
              width={40}
              height={40}
              fill="#ffffff"
            />
            <circle
              cx={cx}
              cy={cy}
              r={16}
              fill={state.color ? '#fef08a' : '#ffffff'}
              stroke={wireColor}
              strokeWidth={2.4}
            />
            {/* Cross filament inside bulb */}
            <line x1={cx - 11} y1={cy - 11} x2={cx + 11} y2={cy + 11} stroke={wireColor} strokeWidth={2} />
            <line x1={cx - 11} y1={cy + 11} x2={cx + 11} y2={cy - 11} stroke={wireColor} strokeWidth={2} />
            <MathText
              x={isVertical ? cx + 26 : cx}
              y={isVertical ? cy : cy + 28}
              label={{ mode: 'text', text: elem.value }}
              fontSize={17}
            />
          </g>
        );

      case 'switch':
        return (
          <g key={elem.id}>
            <rect x={cx - 24} y={cy - 16} width={48} height={32} fill="#ffffff" />
            <circle cx={cx - 14} cy={cy} r={3} fill={wireColor} />
            <circle cx={cx + 14} cy={cy} r={3} fill={wireColor} />
            {elem.isOpen ? (
              // Open switch arm
              <line x1={cx - 14} y1={cy} x2={cx + 10} y2={cy - 16} stroke={wireColor} strokeWidth={2.4} strokeLinecap="round" />
            ) : (
              // Closed switch arm
              <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} stroke={wireColor} strokeWidth={2.4} strokeLinecap="round" />
            )}
            <MathText x={cx} y={cy - 24} label={{ mode: 'text', text: elem.value }} fontSize={17} />
          </g>
        );

      case 'ammeter':
      case 'voltmeter':
        const symbolLetter = elem.type === 'ammeter' ? 'A' : 'V';
        return (
          <g key={elem.id}>
            <rect x={cx - 20} y={cy - 20} width={40} height={40} fill="#ffffff" />
            <circle cx={cx} cy={cy} r={16} fill="#ffffff" stroke={wireColor} strokeWidth={2.4} />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize={16}
              fontWeight="bold"
              fill={wireColor}
            >
              {symbolLetter}
            </text>
            <MathText
              x={isVertical ? cx + 26 : cx}
              y={isVertical ? cy : cy - 24}
              label={{ mode: 'text', text: elem.value }}
              fontSize={17}
            />
          </g>
        );
    }
  };

  const addElement = (type: CircuitElement['type']) => {
    const positions: CircuitElement['position'][] = ['top', 'right', 'bottom', 'left'];
    const taken = state.elements.map((e) => e.position);
    const available = positions.find((p) => !taken.includes(p)) || 'right';

    const newElem: CircuitElement = {
      id: `elem_${Date.now()}`,
      type,
      value: type === 'resistor' ? '5 Ω' : type === 'bulb' ? 'L' : 'V',
      position: available,
    };
    onChange({
      ...state,
      elements: [...state.elements, newElem],
    });
  };

  const removeElement = (id: string) => {
    onChange({
      ...state,
      elements: state.elements.filter((e) => e.id !== id),
    });
  };

  const updateElement = (id: string, updates: Partial<CircuitElement>) => {
    onChange({
      ...state,
      elements: state.elements.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Canvas - Sticky Studio Viewport */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden lg:sticky lg:top-24">
        <CanvasToolbar svgRef={svgRef} filename="circuit-diagram" dimensions={{ width, height }} />

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

            {/* Main Connecting Wire Loop */}
            <path
              d={`M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z`}
              fill="none"
              stroke={wireColor}
              strokeWidth={2.4}
              strokeLinejoin="round"
            />

            {/* Parallel Central Branch if layout is parallel */}
            {state.layout === 'parallel' && (
              <g>
                <line x1={midX} y1={y1} x2={midX} y2={y2} stroke={wireColor} strokeWidth={2.4} />
                <circle cx={midX} cy={y1} r={4} fill={wireColor} />
                <circle cx={midX} cy={y2} r={4} fill={wireColor} />
              </g>
            )}

            {/* Render all circuit components */}
            {state.elements.map((elem) => renderElement(elem))}
          </svg>
        </div>
      </div>

      {/* Settings */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Circuit Topology
          </h3>
          <SegmentedControl<'series' | 'parallel'>
            label="Branching layout"
            value={state.layout}
            options={[
              { value: 'series', label: 'Single loop (Series)' },
              { value: 'parallel', label: 'Parallel Branch' },
            ]}
            onChange={(layout) => onChange({ ...state, layout })}
          />

          <div className="flex flex-col gap-1.5 pt-2">
            <span className="text-xs font-medium text-slate-500">Add Component:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => addElement('resistor')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Resistor
              </button>
              <button
                type="button"
                onClick={() => addElement('bulb')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Bulb
              </button>
              <button
                type="button"
                onClick={() => addElement('switch')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Switch
              </button>
              <button
                type="button"
                onClick={() => addElement('ammeter')}
                className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" /> Ammeter
              </button>
            </div>
          </div>
        </div>

        {/* Components Configuration */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Active Components ({state.elements.length})
          </h3>

          <div className="flex flex-col gap-4 divide-y divide-slate-100">
            {state.elements.map((elem) => (
              <div key={elem.id} className="pt-3 first:pt-0 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700 capitalize">
                    {elem.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeElement(elem.id)}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <SegmentedControl<CircuitElement['position']>
                    label="Position"
                    value={elem.position}
                    options={[
                      { value: 'top', label: 'Top' },
                      { value: 'right', label: 'Right' },
                      { value: 'bottom', label: 'Bottom' },
                      { value: 'left', label: 'Left' },
                    ]}
                    onChange={(position) => updateElement(elem.id, { position })}
                  />

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Value / Label
                    </label>
                    <input
                      type="text"
                      value={elem.value}
                      onChange={(e) => updateElement(elem.id, { value: e.target.value })}
                      className="w-full text-xs font-serif border border-slate-300 rounded px-2 py-1.5 bg-white"
                    />
                  </div>
                </div>

                {elem.type === 'switch' && (
                  <Checkbox
                    label="Switch is open"
                    checked={!!elem.isOpen}
                    onChange={(isOpen) => updateElement(elem.id, { isOpen })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <Checkbox
            label="Color bulbs and highlights"
            checked={state.color}
            onChange={(color) => onChange({ ...state, color })}
          />
          <Checkbox
            label="Mirror diagram"
            checked={state.mirror}
            onChange={(mirror) => onChange({ ...state, mirror })}
          />
        </div>
      </div>
    </div>
  );
};
