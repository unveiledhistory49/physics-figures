import React, { useRef } from 'react';
import type { InclinedPlaneState, BodyType } from '../types/figures';
import { MathText } from '../components/MathText';
import { computeArrow, describeArc, degToRad } from '../engine/math';
import { CanvasToolbar } from '../components/CanvasToolbar';
import { Slider } from '../components/Controls/Slider';
import { SegmentedControl } from '../components/Controls/SegmentedControl';
import { LabelInput } from '../components/Controls/LabelInput';
import { Checkbox } from '../components/Controls/Checkbox';

interface InclinedPlaneProps {
  state: InclinedPlaneState;
  onChange: (newState: InclinedPlaneState) => void;
}

export const defaultInclinedPlaneState: InclinedPlaneState = {
  angle: 30,
  body: 'block',
  bodySize: 1.0,
  showNormalForce: true,
  showGravityForce: true,
  showFrictionForce: true,
  showAppliedForce: false,
  appliedDirection: 'up',
  showComponents: true,
  labelMass: { mode: 'text', text: 'm' },
  labelAngle: { mode: 'text', text: 'θ' },
  mirror: false,
  color: true,
};

export const InclinedPlane: React.FC<InclinedPlaneProps> = ({
  state,
  onChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 560;
  const height = 400;

  const groundY = 320;
  const rampStartX = 60;
  const rampBaseLength = 400;

  const angleRad = degToRad(state.angle);
  const rampHeight = rampBaseLength * Math.tan(angleRad);
  const rampEndX = rampStartX + rampBaseLength;
  const rampTopY = groundY - rampHeight;

  // Center of body placed halfway along the slope
  const slopeRatio = 0.52;
  const bodyX = rampStartX + rampBaseLength * (1 - slopeRatio);
  const bodyY = groundY - rampHeight * (1 - slopeRatio);

  const forceColor = state.color ? '#059669' : '#111827';
  const compColor = state.color ? '#047857' : '#6b7280';

  // Ramp normal and parallel directions
  const normalAngle = 90 + state.angle;
  const upSlopeAngle = state.angle;
  const downSlopeAngle = state.angle + 180;

  // Arrow calculations
  const normalArrow = computeArrow(bodyX, bodyY, normalAngle, 85, 13, 9);
  const gravityArrow = computeArrow(bodyX, bodyY, 270, 95, 13, 9);
  const frictionArrow = computeArrow(bodyX, bodyY, upSlopeAngle, 65, 13, 9);
  const appliedArrow = computeArrow(
    bodyX,
    bodyY,
    state.appliedDirection === 'up' ? upSlopeAngle : downSlopeAngle,
    75,
    13,
    9
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Visual Canvas - Sticky Studio Viewport */}
      <div className="flex-1 w-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden lg:sticky lg:top-24">
        <CanvasToolbar svgRef={svgRef} filename="inclined-plane" dimensions={{ width, height }} />

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

            {/* Ground Line with diagonal hatch marks */}
            <g stroke="#111827">
              <line x1={30} y1={groundY} x2={530} y2={groundY} strokeWidth={2.5} />
              {Array.from({ length: 25 }).map((_, i) => (
                <line
                  key={i}
                  x1={40 + i * 20}
                  y1={groundY}
                  x2={32 + i * 20}
                  y2={groundY + 10}
                  strokeWidth={1.2}
                />
              ))}
            </g>

            {/* Ramp Triangle */}
            <path
              d={`M ${rampStartX} ${groundY} L ${rampEndX} ${groundY} L ${rampEndX} ${rampTopY} Z`}
              fill="#f8fafc"
              stroke="#111827"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />

            {/* Angle Arc at Vertex */}
            <path
              d={describeArc(rampStartX, groundY, 48, 0, state.angle)}
              fill="none"
              stroke="#111827"
              strokeWidth={1.8}
            />
            {/* Angle Label */}
            <MathText
              x={rampStartX + 65 * Math.cos(angleRad / 2)}
              y={groundY - 65 * Math.sin(angleRad / 2)}
              label={state.labelAngle}
              fontSize={20}
            />

            {/* Physical Body on Ramp (Rotated along slope) */}
            <g transform={`translate(${bodyX}, ${bodyY}) rotate(${-state.angle})`}>
              {state.body === 'block' && (
                <rect
                  x={-25 * state.bodySize}
                  y={-50 * state.bodySize}
                  width={50 * state.bodySize}
                  height={50 * state.bodySize}
                  rx={2}
                  fill="#e2e8f0"
                  stroke="#111827"
                  strokeWidth={2.4}
                />
              )}
              {state.body === 'ball' && (
                <circle
                  cx={0}
                  cy={-25 * state.bodySize}
                  r={25 * state.bodySize}
                  fill="#e2e8f0"
                  stroke="#111827"
                  strokeWidth={2.4}
                />
              )}
              {state.body === 'cart' && (
                <g>
                  <rect
                    x={-35 * state.bodySize}
                    y={-45 * state.bodySize}
                    width={70 * state.bodySize}
                    height={35 * state.bodySize}
                    rx={2}
                    fill="#e2e8f0"
                    stroke="#111827"
                    strokeWidth={2.4}
                  />
                  <circle cx={-20 * state.bodySize} cy={-6 * state.bodySize} r={7 * state.bodySize} fill="#94a3b8" stroke="#111827" strokeWidth={2} />
                  <circle cx={20 * state.bodySize} cy={-6 * state.bodySize} r={7 * state.bodySize} fill="#94a3b8" stroke="#111827" strokeWidth={2} />
                </g>
              )}
              {state.body === 'dot' && (
                <circle cx={0} cy={0} r={6 * state.bodySize} fill="#111827" />
              )}
            </g>

            {/* Mass Label */}
            <MathText
              x={bodyX - 25 * Math.sin(angleRad)}
              y={bodyY - 25 * Math.cos(angleRad)}
              label={state.labelMass}
              fontSize={20}
            />

            {/* Normal Force Vector */}
            {state.showNormalForce && (
              <g>
                <line
                  x1={normalArrow.startX}
                  y1={normalArrow.startY}
                  x2={normalArrow.endX}
                  y2={normalArrow.endY}
                  stroke={forceColor}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <polygon points={normalArrow.headPoints} fill={forceColor} />
                <MathText
                  x={normalArrow.tipX + 18 * Math.cos(degToRad(normalAngle))}
                  y={normalArrow.tipY - 18 * Math.sin(degToRad(normalAngle))}
                  label={{ mode: 'text', text: 'F_N' }}
                  fontSize={20}
                />
              </g>
            )}

            {/* Gravity Force Vector */}
            {state.showGravityForce && (
              <g>
                <line
                  x1={gravityArrow.startX}
                  y1={gravityArrow.startY}
                  x2={gravityArrow.endX}
                  y2={gravityArrow.endY}
                  stroke={forceColor}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <polygon points={gravityArrow.headPoints} fill={forceColor} />
                <MathText
                  x={gravityArrow.tipX}
                  y={gravityArrow.tipY + 18}
                  label={{ mode: 'text', text: 'F_g' }}
                  fontSize={20}
                />

                {/* Gravity Components */}
                {state.showComponents && (
                  <g strokeDasharray="4 3" stroke={compColor} strokeWidth={1.6}>
                    {/* Perpendicular component F_g_perp */}
                    <line
                      x1={bodyX}
                      y1={bodyY}
                      x2={bodyX + 70 * Math.sin(angleRad)}
                      y2={bodyY + 70 * Math.cos(angleRad)}
                    />
                    {/* Parallel component F_g_parallel */}
                    <line
                      x1={bodyX + 70 * Math.sin(angleRad)}
                      y1={bodyY + 70 * Math.cos(angleRad)}
                      x2={gravityArrow.tipX}
                      y2={gravityArrow.tipY}
                    />
                    <MathText
                      x={bodyX + 80 * Math.sin(angleRad) + 12}
                      y={bodyY + 50 * Math.cos(angleRad)}
                      label={{ mode: 'text', text: 'mg\\cosθ' }}
                      fontSize={16}
                      fill={compColor}
                    />
                    <MathText
                      x={bodyX + 35 * Math.sin(angleRad) - 18}
                      y={bodyY + 80 * Math.cos(angleRad) + 10}
                      label={{ mode: 'text', text: 'mg\\sinθ' }}
                      fontSize={16}
                      fill={compColor}
                    />
                  </g>
                )}
              </g>
            )}

            {/* Friction Force Vector */}
            {state.showFrictionForce && (
              <g>
                <line
                  x1={frictionArrow.startX}
                  y1={frictionArrow.startY}
                  x2={frictionArrow.endX}
                  y2={frictionArrow.endY}
                  stroke={forceColor}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <polygon points={frictionArrow.headPoints} fill={forceColor} />
                <MathText
                  x={frictionArrow.tipX + 16 * Math.cos(angleRad)}
                  y={frictionArrow.tipY - 16 * Math.sin(angleRad)}
                  label={{ mode: 'text', text: 'F_f' }}
                  fontSize={20}
                />
              </g>
            )}

            {/* Applied Force Vector */}
            {state.showAppliedForce && (
              <g>
                <line
                  x1={appliedArrow.startX}
                  y1={appliedArrow.startY}
                  x2={appliedArrow.endX}
                  y2={appliedArrow.endY}
                  stroke="#d97706"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <polygon points={appliedArrow.headPoints} fill="#d97706" />
                <MathText
                  x={appliedArrow.tipX + 16}
                  y={appliedArrow.tipY - 16}
                  label={{ mode: 'text', text: 'F_A' }}
                  fontSize={20}
                  fill="#d97706"
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
            Incline Geometry
          </h3>
          <Slider
            label="Incline Angle (θ)"
            value={state.angle}
            min={15}
            max={60}
            step={1}
            unit="°"
            onChange={(angle) => onChange({ ...state, angle })}
          />

          <SegmentedControl<BodyType>
            label="Object on slope"
            value={state.body}
            options={[
              { value: 'block', label: 'Block' },
              { value: 'ball', label: 'Ball' },
              { value: 'cart', label: 'Cart' },
              { value: 'dot', label: 'Dot' },
            ]}
            onChange={(body) => onChange({ ...state, body })}
          />

          <Slider
            label="Object size"
            value={state.bodySize}
            min={0.6}
            max={1.8}
            step={0.1}
            unit="×"
            onChange={(bodySize) => onChange({ ...state, bodySize })}
          />
        </div>

        {/* Force Toggles */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Forces on Ramp
          </h3>
          <Checkbox
            label="Normal Force (F_N)"
            checked={state.showNormalForce}
            onChange={(showNormalForce) => onChange({ ...state, showNormalForce })}
          />
          <Checkbox
            label="Gravity Force (F_g)"
            checked={state.showGravityForce}
            onChange={(showGravityForce) => onChange({ ...state, showGravityForce })}
          />
          <Checkbox
            label="Gravity Components (mg sinθ / mg cosθ)"
            checked={state.showComponents}
            onChange={(showComponents) => onChange({ ...state, showComponents })}
          />
          <Checkbox
            label="Friction Force (F_f)"
            checked={state.showFrictionForce}
            onChange={(showFrictionForce) => onChange({ ...state, showFrictionForce })}
          />
          <Checkbox
            label="Applied Force (F_A)"
            checked={state.showAppliedForce}
            onChange={(showAppliedForce) => onChange({ ...state, showAppliedForce })}
          />
          {state.showAppliedForce && (
            <SegmentedControl<'up' | 'down'>
              label="Applied direction"
              value={state.appliedDirection}
              options={[
                { value: 'up', label: 'Up the ramp' },
                { value: 'down', label: 'Down the ramp' },
              ]}
              onChange={(appliedDirection) => onChange({ ...state, appliedDirection })}
            />
          )}
        </div>

        {/* Labels & Presentation */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Labels & Appearance
          </h3>
          <LabelInput
            label="Mass Label"
            value={state.labelMass}
            onChange={(labelMass) => onChange({ ...state, labelMass })}
          />
          <LabelInput
            label="Angle Label"
            value={state.labelAngle}
            onChange={(labelAngle) => onChange({ ...state, labelAngle })}
          />
          <Checkbox
            label="Color vectors"
            checked={state.color}
            onChange={(color) => onChange({ ...state, color })}
          />
          <Checkbox
            label="Mirror (flip ramp left/right)"
            checked={state.mirror}
            onChange={(mirror) => onChange({ ...state, mirror })}
          />
        </div>
      </div>
    </div>
  );
};
