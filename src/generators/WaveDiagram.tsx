import React, { useRef } from 'react';
import type { WaveDiagramState } from '../types/figures';
import { MathText } from '../components/MathText';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { LabelInput } from '../components/Controls/LabelInput';
import { Checkbox } from '../components/Controls/Checkbox';

interface WaveDiagramProps {
  state: WaveDiagramState;
  onChange: (newState: WaveDiagramState) => void;
}

export const defaultWaveDiagramState: WaveDiagramState = {
  type: 'transverse',
  wavelengthCount: 2,
  amplitude: 60,
  wavelengthPixels: 200,
  showNodes: true,
  showAntinodes: true,
  showWavelengthMarker: true,
  showAmplitudeMarker: true,
  wavelengthLabel: { mode: 'text', text: 'λ' },
  amplitudeLabel: { mode: 'text', text: 'A' },
  mirror: false,
  color: true,
};

export const WaveDiagram: React.FC<WaveDiagramProps> = ({ state, onChange }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 580;
  const height = 360;

  const startX = 60;
  const centerY = 180;
  const totalLength = 460;
  const lambda = totalLength / state.wavelengthCount;
  const amp = state.amplitude;

  // Generate sine wave curve points
  const points: { x: number; y: number }[] = [];
  const steps = 180;
  for (let i = 0; i <= steps; i++) {
    const x = startX + (i / steps) * totalLength;
    const phase = ((x - startX) / lambda) * 2 * Math.PI;
    const y = centerY - amp * Math.sin(phase);
    points.push({ x, y });
  }

  const sinePathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `${acc} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');

  // Calculate node positions (y = centerY)
  const nodeXs: number[] = [];
  for (let i = 0; i <= state.wavelengthCount * 2; i++) {
    nodeXs.push(startX + (i * lambda) / 2);
  }

  // Calculate antinode positions (crests and troughs)
  const antinodeXs: { x: number; isCrest: boolean }[] = [];
  for (let i = 0; i < state.wavelengthCount * 2; i++) {
    antinodeXs.push({
      x: startX + (i + 0.5) * (lambda / 2),
      isCrest: i % 2 === 0,
    });
  }

  const waveColor = state.color ? '#2563eb' : '#111827';

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Canvas */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <CanvasToolbar svgRef={svgRef} filename="wave-diagram" />

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

            {/* Equilibrium Center Line */}
            <line
              x1={30}
              y1={centerY}
              x2={550}
              y2={centerY}
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />

            {state.type === 'transverse' ? (
              // Transverse Wave
              <g>
                <path
                  d={sinePathD}
                  fill="none"
                  stroke={waveColor}
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                {/* Nodes markers (N) */}
                {state.showNodes &&
                  nodeXs.map((nx, i) => (
                    <g key={`n_${i}`}>
                      <circle cx={nx} cy={centerY} r={4.5} fill="#111827" />
                      <MathText
                        x={nx}
                        y={centerY + 18}
                        label={{ mode: 'text', text: 'N' }}
                        fontSize={14}
                        fill="#4b5563"
                      />
                    </g>
                  ))}

                {/* Antinodes markers (A) */}
                {state.showAntinodes &&
                  antinodeXs.map((an, i) => {
                    const y = an.isCrest ? centerY - amp : centerY + amp;
                    return (
                      <g key={`an_${i}`}>
                        <circle cx={an.x} cy={y} r={4} fill={state.color ? '#dc2626' : '#111827'} />
                        <MathText
                          x={an.x}
                          y={an.isCrest ? y - 16 : y + 18}
                          label={{ mode: 'text', text: 'A' }}
                          fontSize={15}
                          fill={state.color ? '#dc2626' : '#111827'}
                        />
                      </g>
                    );
                  })}

                {/* Wavelength Dimension Marker (λ) */}
                {state.showWavelengthMarker && (
                  <g>
                    {/* Across first full wavelength from startX to startX + lambda */}
                    <line
                      x1={startX}
                      y1={centerY - amp - 25}
                      x2={startX + lambda}
                      y2={centerY - amp - 25}
                      stroke="#4b5563"
                      strokeWidth={1.5}
                    />
                    <line x1={startX} y1={centerY - amp - 32} x2={startX} y2={centerY - amp - 18} stroke="#4b5563" strokeWidth={1.5} />
                    <line x1={startX + lambda} y1={centerY - amp - 32} x2={startX + lambda} y2={centerY - amp - 18} stroke="#4b5563" strokeWidth={1.5} />
                    <MathText
                      x={startX + lambda / 2}
                      y={centerY - amp - 40}
                      label={state.wavelengthLabel}
                      fontSize={20}
                    />
                  </g>
                )}

                {/* Amplitude Dimension Marker (A) */}
                {state.showAmplitudeMarker && (
                  <g>
                    const crestX = startX + lambda / 4;
                    <line
                      x1={startX + lambda / 4}
                      y1={centerY}
                      x2={startX + lambda / 4}
                      y2={centerY - amp}
                      stroke="#059669"
                      strokeWidth={1.8}
                      strokeDasharray="3 2"
                    />
                    <MathText
                      x={startX + lambda / 4 + 18}
                      y={centerY - amp / 2}
                      label={state.amplitudeLabel}
                      fontSize={18}
                      fill="#059669"
                    />
                  </g>
                )}
              </g>
            ) : (
              // Longitudinal Wave (Compression & Rarefaction lines)
              <g>
                {Array.from({ length: 90 }).map((_, i) => {
                  const frac = i / 90;
                  const xBase = startX + frac * totalLength;
                  // Modulate line spacing with sine
                  const offset = 14 * Math.sin((frac * totalLength / lambda) * 2 * Math.PI);
                  const x = xBase + offset;
                  return (
                    <line
                      key={i}
                      x1={x}
                      y1={centerY - 50}
                      x2={x}
                      y2={centerY + 50}
                      stroke={waveColor}
                      strokeWidth={1.8}
                    />
                  );
                })}
                <MathText x={startX + lambda / 2} y={centerY + 75} label={{ mode: 'text', text: 'Compression' }} fontSize={15} />
                <MathText x={startX + lambda} y={centerY + 75} label={{ mode: 'text', text: 'Rarefaction' }} fontSize={15} />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Settings */}
      <div className="w-full lg:w-96 flex flex-col gap-5 no-print">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Wave Characteristics
          </h3>
          <SegmentedControl<'transverse' | 'longitudinal'>
            label="Wave Type"
            value={state.type}
            options={[
              { value: 'transverse', label: 'Transverse' },
              { value: 'longitudinal', label: 'Longitudinal' },
            ]}
            onChange={(type) => onChange({ ...state, type })}
          />

          <Slider
            label="Wavelengths visible"
            value={state.wavelengthCount}
            min={1}
            max={4}
            step={0.5}
            unit=" λ"
            onChange={(wavelengthCount) => onChange({ ...state, wavelengthCount })}
          />

          {state.type === 'transverse' && (
            <Slider
              label="Amplitude (A)"
              value={state.amplitude}
              min={30}
              max={90}
              step={5}
              unit=" px"
              onChange={(amplitude) => onChange({ ...state, amplitude })}
            />
          )}
        </div>

        {state.type === 'transverse' && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
            <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Markers & Dimensions
            </h3>
            <Checkbox
              label="Show Nodes (N)"
              checked={state.showNodes}
              onChange={(showNodes) => onChange({ ...state, showNodes })}
            />
            <Checkbox
              label="Show Antinodes (A)"
              checked={state.showAntinodes}
              onChange={(showAntinodes) => onChange({ ...state, showAntinodes })}
            />
            <Checkbox
              label="Show Wavelength (λ) marker"
              checked={state.showWavelengthMarker}
              onChange={(showWavelengthMarker) => onChange({ ...state, showWavelengthMarker })}
            />
            <Checkbox
              label="Show Amplitude (A) marker"
              checked={state.showAmplitudeMarker}
              onChange={(showAmplitudeMarker) => onChange({ ...state, showAmplitudeMarker })}
            />
            <LabelInput
              label="Wavelength symbol"
              value={state.wavelengthLabel}
              onChange={(wavelengthLabel) => onChange({ ...state, wavelengthLabel })}
            />
            <LabelInput
              label="Amplitude symbol"
              value={state.amplitudeLabel}
              onChange={(amplitudeLabel) => onChange({ ...state, amplitudeLabel })}
            />
            <Checkbox
              label="Color lines"
              checked={state.color}
              onChange={(color) => onChange({ ...state, color })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
