/**
 * Mathematical & Geometric utility functions for Physics Figures
 */

export const degToRad = (degrees: number): number => (degrees * Math.PI) / 180;
export const radToDeg = (radians: number): number => (radians * 180) / Math.PI;

/**
 * Converts polar coordinates to Cartesian (standard math angle: 0° = right, 90° = up)
 * SVG y-axis is inverted (0 is top, y increases downwards).
 */
export const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } => {
  const rad = degToRad(angleDeg);
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
};

export interface ArrowGeometry {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  tipX: number;
  tipY: number;
  headPoints: string; // "x1,y1 x2,y2 x3,y3" for <polygon>
}

/**
 * Computes exact line coordinates and arrowhead polygon coordinates
 */
export const computeArrow = (
  startX: number,
  startY: number,
  angleDeg: number,
  length: number,
  headLength: number = 14,
  headWidth: number = 10
): ArrowGeometry => {
  const rad = degToRad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Tip of the arrow
  const tipX = startX + length * cos;
  const tipY = startY - length * sin;

  // Base of the arrowhead where the line ends
  const endX = tipX - headLength * cos;
  const endY = tipY + headLength * sin;

  // Arrowhead wings (perpendicular vector)
  const perpX = -sin * (headWidth / 2);
  const perpY = -cos * (headWidth / 2);

  const wing1X = endX + perpX;
  const wing1Y = endY + perpY;
  const wing2X = endX - perpX;
  const wing2Y = endY - perpY;

  return {
    startX,
    startY,
    endX,
    endY,
    tipX,
    tipY,
    headPoints: `${tipX.toFixed(2)},${tipY.toFixed(2)} ${wing1X.toFixed(2)},${wing1Y.toFixed(2)} ${wing2X.toFixed(2)},${wing2Y.toFixed(2)}`,
  };
};

/**
 * Generate SVG path data for an angle arc
 */
export const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number
): string => {
  let sweep = endAngleDeg - startAngleDeg;
  while (sweep < 0) sweep += 360;
  while (sweep > 360) sweep -= 360;

  const start = polarToCartesian(cx, cy, radius, startAngleDeg);
  const end = polarToCartesian(cx, cy, radius, endAngleDeg);
  const largeArcFlag = sweep <= 180 ? 0 : 1;
  // in SVG coordinate space, angle sweeps counter-clockwise is sweepFlag 0 because y is down
  const sweepFlag = 0;

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

/**
 * Greek letters and math symbol conversion map
 */
export const SYMBOL_MAP: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  Delta: 'Δ',
  theta: 'θ',
  Theta: 'Θ',
  lambda: 'λ',
  Lambda: 'Λ',
  mu: 'μ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  Sigma: 'Σ',
  tau: 'τ',
  phi: 'ϕ',
  omega: 'ω',
  Omega: 'Ω',
  deg: '°',
  degree: '°',
  inf: '∞',
  approx: '≈',
};

export interface ParsedMathToken {
  base: string;
  subscript?: string;
  superscript?: string;
  isVector?: boolean;
  isBold?: boolean;
}

/**
 * Parses math labels such as:
 * - "F_g" -> base: "F", subscript: "g"
 * - "\vec{F}_N" -> base: "F", subscript: "N", isVector: true
 * - "\mathbf{F}_A" -> base: "F", subscript: "A", isBold: true
 * - "\theta" -> base: "θ"
 * - "v_0" -> base: "v", subscript: "0"
 * - "10 N" -> base: "10 N"
 */
export const parseMathLabel = (raw: string, globalNotation: 'none' | 'arrow' | 'bold' = 'none'): ParsedMathToken => {
  if (!raw) return { base: '' };

  let text = raw.trim();
  let isVector = globalNotation === 'arrow';
  let isBold = globalNotation === 'bold';

  // Check explicit LaTeX commands
  if (text.startsWith('\\vec{') && text.includes('}')) {
    isVector = true;
    text = text.replace(/^\\vec{([^}]+)}/, '$1');
  } else if (text.startsWith('\\mathbf{') && text.includes('}')) {
    isBold = true;
    text = text.replace(/^\\mathbf{([^}]+)}/, '$1');
  }

  // Replace symbol macros (\theta -> θ, \mu -> μ)
  for (const [macro, sym] of Object.entries(SYMBOL_MAP)) {
    text = text.replace(new RegExp(`(?:\\\\${macro}|\\b${macro})(?![a-zA-Z])`, 'g'), sym);
  }

  // Parse subscript and superscript (e.g. F_g, x^2, v_0^2)
  let base = text;
  let subscript: string | undefined;
  let superscript: string | undefined;

  // Check for superscript ^
  const supMatch = base.match(/\^([^{]+|\{[^}]+\})$/);
  if (supMatch) {
    let sup = supMatch[1];
    if (sup.startsWith('{') && sup.endsWith('}')) {
      sup = sup.slice(1, -1);
    }
    superscript = sup;
    base = base.slice(0, supMatch.index);
  }

  // Check for subscript _
  const subMatch = base.match(/^([^_]+)_([^{]+|\{[^}]+\})$/);
  if (subMatch) {
    base = subMatch[1];
    let sub = subMatch[2];
    if (sub.startsWith('{') && sub.endsWith('}')) {
      sub = sub.slice(1, -1);
    }
    subscript = sub;
  }

  return {
    base,
    subscript,
    superscript,
    isVector,
    isBold,
  };
};

/**
 * Calculates perpendicular offsets when multiple vectors point in the same direction
 */
export const calculateParallelOffsets = (
  forces: { id: string; direction: number }[],
  separationDistance: number = 22
): Map<string, { offsetX: number; offsetY: number }> => {
  const result = new Map<string, { offsetX: number; offsetY: number }>();

  // Group by angle modulo 360
  const groups: { [angle: number]: string[] } = {};
  for (const force of forces) {
    const normAngle = ((Math.round(force.direction) % 360) + 360) % 360;
    if (!groups[normAngle]) groups[normAngle] = [];
    groups[normAngle].push(force.id);
  }

  for (const [angleStr, ids] of Object.entries(groups)) {
    const angle = Number(angleStr);
    const count = ids.length;
    if (count === 1) {
      result.set(ids[0], { offsetX: 0, offsetY: 0 });
      continue;
    }

    const rad = degToRad(angle);
    // Perpendicular direction (rotate 90° clockwise)
    const perpX = Math.sin(rad);
    const perpY = Math.cos(rad);

    ids.forEach((id, idx) => {
      // Center the group: e.g. for 2 items: -0.5, +0.5; for 3: -1, 0, 1
      const offsetIndex = idx - (count - 1) / 2;
      const dist = offsetIndex * separationDistance;
      result.set(id, {
        offsetX: dist * perpX,
        offsetY: dist * perpY,
      });
    });
  }

  return result;
};
