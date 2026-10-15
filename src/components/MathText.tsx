import React from 'react';
import { parseMathLabel, type ParsedMathToken } from '../engine/math';
import type { FormattedLabel, VectorNotation } from '../types/figures';

interface MathTextProps {
  x: number;
  y: number;
  label?: FormattedLabel | string;
  fontSize?: number;
  fill?: string;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: 'auto' | 'middle' | 'central' | 'hanging';
  vectorNotation?: VectorNotation;
  blankLength?: number;
}

export const MathText: React.FC<MathTextProps> = ({
  x,
  y,
  label,
  fontSize = 22,
  fill = '#111827',
  color,
  strokeColor = '#ffffff',
  strokeWidth = 4,
  textAnchor = 'middle',
  dominantBaseline = 'middle',
  vectorNotation = 'none',
  blankLength = 40,
}) => {
  if (!label) return null;

  const mode = typeof label === 'string' ? 'text' : label.mode;
  const rawText = typeof label === 'string' ? label : label.text;

  if (mode === 'none') return null;

  const actualFill = color || fill;

  if (mode === 'blank') {
    // Blank line for student worksheets
    const half = blankLength / 2;
    return (
      <g>
        <line
          x1={x - half}
          y1={y + 6}
          x2={x + half}
          y2={y + 6}
          stroke={actualFill}
          strokeWidth={1.5}
        />
      </g>
    );
  }

  const token: ParsedMathToken = parseMathLabel(rawText, vectorNotation);

  const renderContent = () => (
    <>
      {/* Base token */}
      <tspan
        fontStyle={token.isBold ? 'normal' : 'italic'}
        fontWeight={token.isBold ? 'bold' : 'normal'}
      >
        {token.isVector && !token.isBold ? (
          <>
            {token.base}
            {/* Vector arrow overbar mark */}
            <tspan dy={-fontSize * 0.4} dx={-fontSize * 0.4} fontSize={fontSize * 0.6}>
              →
            </tspan>
            <tspan dy={fontSize * 0.4} dx={0}>
              {''}
            </tspan>
          </>
        ) : (
          token.base
        )}
      </tspan>

      {/* Subscript */}
      {token.subscript && (
        <tspan
          dy={fontSize * 0.3}
          fontSize={fontSize * 0.7}
          fontStyle={/^[0-9]+$/.test(token.subscript) ? 'normal' : 'italic'}
        >
          {token.subscript}
        </tspan>
      )}

      {/* Superscript */}
      {token.superscript && (
        <tspan
          dy={-fontSize * 0.4}
          fontSize={fontSize * 0.7}
        >
          {token.superscript}
        </tspan>
      )}
    </>
  );

  const hasHalo = strokeWidth > 0 && strokeColor && strokeColor !== 'none';

  return (
    <g className="select-none">
      {/* Halo layer rendered first underneath */}
      {hasHalo && (
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          dominantBaseline={dominantBaseline}
          fontFamily="'Times New Roman', Times, serif"
          fontSize={fontSize}
          fill={strokeColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          paintOrder="stroke fill"
          style={{ paintOrder: 'stroke fill' }}
          aria-hidden="true"
        >
          {renderContent()}
        </text>
      )}

      {/* Sharp foreground text rendered on top (guaranteed never covered by stroke) */}
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fontFamily="'Times New Roman', Times, serif"
        fontSize={fontSize}
        fill={actualFill}
        stroke="none"
      >
        {renderContent()}
      </text>
    </g>
  );
};
