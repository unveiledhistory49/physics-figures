import { describe, it, expect } from 'vitest';
import {
  degToRad,
  radToDeg,
  polarToCartesian,
  computeArrow,
  describeArc,
  parseMathLabel,
  calculateParallelOffsets,
  SYMBOL_MAP,
} from '../engine/math';

describe('Trigonometry & Coordinates', () => {
  it('converts degrees to radians and back accurately', () => {
    expect(degToRad(0)).toBe(0);
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
    expect(radToDeg(Math.PI)).toBeCloseTo(180);
    expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
  });

  it('computes polar to Cartesian coordinates with SVG y-inversion', () => {
    const center = { cx: 200, cy: 200 };
    const r = 50;

    // 0 degrees = right (+x, same y)
    const p0 = polarToCartesian(center.cx, center.cy, r, 0);
    expect(p0.x).toBeCloseTo(250);
    expect(p0.y).toBeCloseTo(200);

    // 90 degrees = up (same x, -y in SVG coordinate system)
    const p90 = polarToCartesian(center.cx, center.cy, r, 90);
    expect(p90.x).toBeCloseTo(200);
    expect(p90.y).toBeCloseTo(150);

    // 180 degrees = left (-x, same y)
    const p180 = polarToCartesian(center.cx, center.cy, r, 180);
    expect(p180.x).toBeCloseTo(150);
    expect(p180.y).toBeCloseTo(200);

    // 270 degrees = down (same x, +y in SVG coordinate system)
    const p270 = polarToCartesian(center.cx, center.cy, r, 270);
    expect(p270.x).toBeCloseTo(200);
    expect(p270.y).toBeCloseTo(250);
  });
});

describe('Arrowhead & Vector Geometry', () => {
  it('computes arrow tip, end, and polygon wings for 0° vector', () => {
    const arrow = computeArrow(100, 100, 0, 100, 14, 10);
    expect(arrow.startX).toBe(100);
    expect(arrow.startY).toBe(100);
    expect(arrow.tipX).toBeCloseTo(200);
    expect(arrow.tipY).toBeCloseTo(100);
    // Base of head should be at 200 - 14 = 186
    expect(arrow.endX).toBeCloseTo(186);
    expect(arrow.endY).toBeCloseTo(100);
    expect(arrow.headPoints).toBeDefined();
    expect(arrow.headPoints.split(' ').length).toBe(3);
  });

  it('computes arrow geometry correctly for 90° upward vector', () => {
    const arrow = computeArrow(100, 100, 90, 80, 14, 10);
    expect(arrow.tipX).toBeCloseTo(100);
    expect(arrow.tipY).toBeCloseTo(20);
    expect(arrow.endX).toBeCloseTo(100);
    expect(arrow.endY).toBeCloseTo(34);
  });
});

describe('Angle Arc Path Generator', () => {
  it('generates a valid SVG arc path string', () => {
    const path = describeArc(150, 150, 40, 0, 45);
    expect(path).toMatch(/^M [0-9.]+ [0-9.]+ A 40 40 0 0 0 [0-9.]+ [0-9.]+$/);
  });

  it('handles large arcs (> 180 deg) by setting largeArcFlag = 1', () => {
    const path = describeArc(150, 150, 40, 0, 200);
    expect(path).toContain('A 40 40 0 1 0');
  });
});

describe('Math Label & LaTeX Parser', () => {
  it('handles empty inputs gracefully', () => {
    expect(parseMathLabel('')).toEqual({ base: '' });
  });

  it('parses plain text labels', () => {
    const parsed = parseMathLabel('10 N');
    expect(parsed.base).toBe('10 N');
    expect(parsed.isVector).toBe(false);
  });

  it('parses subscript syntax like F_g', () => {
    const parsed = parseMathLabel('F_g');
    expect(parsed.base).toBe('F');
    expect(parsed.subscript).toBe('g');
  });

  it('parses multi-character bracketed subscripts like F_{net}', () => {
    const parsed = parseMathLabel('F_{net}');
    expect(parsed.base).toBe('F');
    expect(parsed.subscript).toBe('net');
  });

  it('parses explicit LaTeX \\vec{} command', () => {
    const parsed = parseMathLabel('\\vec{F}_N');
    expect(parsed.base).toBe('F');
    expect(parsed.subscript).toBe('N');
    expect(parsed.isVector).toBe(true);
  });

  it('parses explicit LaTeX \\mathbf{} command', () => {
    const parsed = parseMathLabel('\\mathbf{F}_A');
    expect(parsed.base).toBe('F');
    expect(parsed.subscript).toBe('A');
    expect(parsed.isBold).toBe(true);
  });

  it('converts Greek letters and special symbols correctly', () => {
    expect(parseMathLabel('\\theta').base).toBe('θ');
    expect(parseMathLabel('theta').base).toBe('θ');
    expect(parseMathLabel('\\mu_k')).toEqual({
      base: 'μ',
      subscript: 'k',
      isVector: false,
      isBold: false,
    });
    expect(parseMathLabel('\\lambda').base).toBe('λ');
    expect(parseMathLabel('\\Delta x').base).toBe('Δ x');
  });

  it('parses superscripts and combined sub/super scripts', () => {
    const sup = parseMathLabel('x^2');
    expect(sup.base).toBe('x');
    expect(sup.superscript).toBe('2');

    const combined = parseMathLabel('v_0^2');
    expect(combined.base).toBe('v');
    expect(combined.subscript).toBe('0');
    expect(combined.superscript).toBe('2');
  });

  it('applies global vector arrow and bold notation overrides', () => {
    const withArrow = parseMathLabel('F_g', 'arrow');
    expect(withArrow.isVector).toBe(true);

    const withBold = parseMathLabel('F_g', 'bold');
    expect(withBold.isBold).toBe(true);
  });

  it('contains expected standard symbols in SYMBOL_MAP', () => {
    expect(SYMBOL_MAP['theta']).toBe('θ');
    expect(SYMBOL_MAP['pi']).toBe('π');
    expect(SYMBOL_MAP['deg']).toBe('°');
    expect(SYMBOL_MAP['inf']).toBe('∞');
  });
});

describe('Parallel Vector Offsets', () => {
  it('returns zero offset for single non-overlapping vectors', () => {
    const forces = [
      { id: 'f1', direction: 90 },
      { id: 'f2', direction: 270 },
    ];
    const offsets = calculateParallelOffsets(forces);
    expect(offsets.get('f1')).toEqual({ offsetX: 0, offsetY: 0 });
    expect(offsets.get('f2')).toEqual({ offsetX: 0, offsetY: 0 });
  });

  it('calculates symmetric perpendicular offsets for parallel vectors', () => {
    const forces = [
      { id: 'up1', direction: 90 },
      { id: 'up2', direction: 90 },
    ];
    const offsets = calculateParallelOffsets(forces, 20);
    const o1 = offsets.get('up1')!;
    const o2 = offsets.get('up2')!;

    // For vertical vectors (90°), perpendicular is horizontal along x
    expect(o1.offsetX).toBeCloseTo(-10);
    expect(o2.offsetX).toBeCloseTo(10);
    expect(o1.offsetY).toBeCloseTo(0);
    expect(o2.offsetY).toBeCloseTo(0);
  });
});
