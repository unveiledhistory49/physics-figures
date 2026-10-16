import React from 'react';
import type { GeneratorKind } from '../types/figures';

export const FigurePreview: React.FC<{ kind: GeneratorKind }> = ({ kind }) => {
  switch (kind) {
    case 'free-body-diagram':
      return (
        <svg
          viewBox="0 0 240 220"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Free body diagram preview"
        >
          <rect width="240" height="220" fill="#ffffff" />
          {/* Central Block */}
          <rect
            x="96"
            y="86"
            width="48"
            height="48"
            rx="3"
            fill="#e5e7eb"
            stroke="#111827"
            strokeWidth="2.5"
          />
          <circle cx="120" cy="110" r="3" fill="#111827" />

          {/* Normal Force (Up) */}
          <line x1="120" y1="110" x2="120" y2="36" stroke="#111827" strokeWidth="2.5" />
          <polygon points="120,26 115,40 125,40" fill="#111827" />
          <text
            x="120"
            y="20"
            textAnchor="middle"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="15"
            fontStyle="italic"
            fill="#111827"
          >
            F<tspan dy="4" fontSize="10" fontStyle="italic">N</tspan>
          </text>

          {/* Gravity Force (Down) */}
          <line x1="120" y1="110" x2="120" y2="184" stroke="#111827" strokeWidth="2.5" />
          <polygon points="120,194 115,180 125,180" fill="#111827" />
          <text
            x="120"
            y="212"
            textAnchor="middle"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="15"
            fontStyle="italic"
            fill="#111827"
          >
            F<tspan dy="4" fontSize="10" fontStyle="italic">g</tspan>
          </text>

          {/* Applied Force (Right) */}
          <line x1="120" y1="110" x2="194" y2="110" stroke="#111827" strokeWidth="2.5" />
          <polygon points="204,110 190,105 190,115" fill="#111827" />
          <text
            x="220"
            y="114"
            textAnchor="middle"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="15"
            fontStyle="italic"
            fill="#111827"
          >
            F<tspan dy="4" fontSize="10" fontStyle="italic">A</tspan>
          </text>

          {/* Friction Force (Left) */}
          <line x1="120" y1="110" x2="46" y2="110" stroke="#111827" strokeWidth="2.5" />
          <polygon points="36,110 50,105 50,115" fill="#111827" />
          <text
            x="20"
            y="114"
            textAnchor="middle"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="15"
            fontStyle="italic"
            fill="#111827"
          >
            F<tspan dy="4" fontSize="10" fontStyle="italic">f</tspan>
          </text>
        </svg>
      );

    case 'vector-diagram':
      return (
        <svg
          viewBox="0 0 240 220"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Vector diagram preview"
        >
          <rect width="240" height="220" fill="#ffffff" />
          {/* Subtle Grid */}
          <g stroke="#e5e7eb" strokeWidth="1">
            <line x1="20" y1="30" x2="220" y2="30" />
            <line x1="20" y1="70" x2="220" y2="70" />
            <line x1="20" y1="110" x2="220" y2="110" />
            <line x1="20" y1="150" x2="220" y2="150" />
            <line x1="20" y1="190" x2="220" y2="190" />
            <line x1="30" y1="20" x2="30" y2="200" />
            <line x1="75" y1="20" x2="75" y2="200" />
            <line x1="120" y1="20" x2="120" y2="200" />
            <line x1="165" y1="20" x2="165" y2="200" />
            <line x1="210" y1="20" x2="210" y2="200" />
          </g>

          {/* Vector A */}
          <line x1="40" y1="170" x2="130" y2="150" stroke="#111827" strokeWidth="2.5" />
          <polygon points="138,148 126,145 128,155" fill="#111827" />
          <text
            x="85"
            y="175"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="14"
            fontStyle="italic"
            fill="#111827"
          >
            A
          </text>

          {/* Vector B */}
          <line x1="138" y1="148" x2="165" y2="60" stroke="#111827" strokeWidth="2.5" />
          <polygon points="168,50 159,62 169,65" fill="#111827" />
          <text
            x="170"
            y="110"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="14"
            fontStyle="italic"
            fill="#111827"
          >
            B
          </text>

          {/* Resultant Vector R (Dashed) */}
          <line
            x1="40"
            y1="170"
            x2="162"
            y2="56"
            stroke="#111827"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <polygon points="168,50 156,54 163,63" fill="#111827" />
          <text
            x="90"
            y="95"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="14"
            fontStyle="italic"
            fontWeight="bold"
            fill="#111827"
          >
            R
          </text>
        </svg>
      );

    case 'inclined-plane':
      return (
        <svg
          viewBox="0 0 240 180"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Inclined plane preview"
        >
          <rect width="240" height="180" fill="#ffffff" />
          {/* Ground & Hatch */}
          <line x1="20" y1="145" x2="220" y2="145" stroke="#111827" strokeWidth="2" />
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={i}
              x1={25 + i * 14}
              y1="145"
              x2={20 + i * 14}
              y2="153"
              stroke="#111827"
              strokeWidth="1.2"
            />
          ))}

          {/* Wedge Ramp */}
          <path
            d="M 35 145 L 205 145 L 205 55 Z"
            fill="#f3f4f6"
            stroke="#111827"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Angle theta arc */}
          <path
            d="M 75 145 A 40 40 0 0 0 71 127"
            fill="none"
            stroke="#111827"
            strokeWidth="1.5"
          />
          <text
            x="85"
            y="138"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="13"
            fontStyle="italic"
            fill="#111827"
          >
            θ
          </text>

          {/* Sliding Block on Ramp */}
          <g transform="translate(130, 95) rotate(-28)">
            <rect
              x="-18"
              y="-36"
              width="36"
              height="36"
              rx="2"
              fill="#e5e7eb"
              stroke="#111827"
              strokeWidth="2.2"
            />
            <text
              x="0"
              y="-13"
              textAnchor="middle"
              fontFamily="'Times New Roman', Times, serif"
              fontSize="14"
              fontStyle="italic"
              fill="#111827"
            >
              m
            </text>
          </g>
        </svg>
      );

    case 'pulley':
      return (
        <svg
          viewBox="0 0 240 200"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Pulley Atwood preview"
        >
          <rect width="240" height="200" fill="#ffffff" />
          {/* Ceiling Hatch */}
          <line x1="80" y1="24" x2="160" y2="24" stroke="#111827" strokeWidth="2.2" />
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1={86 + i * 11}
              y1="24"
              x2={91 + i * 11}
              y2="17"
              stroke="#111827"
              strokeWidth="1.2"
            />
          ))}

          {/* Mounting bracket */}
          <line x1="120" y1="24" x2="120" y2="58" stroke="#111827" strokeWidth="2.5" />

          {/* Pulley Wheel */}
          <circle cx="120" cy="58" r="22" fill="#f3f4f6" stroke="#111827" strokeWidth="2.2" />
          <circle cx="120" cy="58" r="6" stroke="#111827" strokeWidth="1.5" />
          <circle cx="120" cy="58" r="2" fill="#111827" />

          {/* String */}
          <path d="M 98 58 L 98 120" stroke="#111827" strokeWidth="2" />
          <path d="M 142 58 L 142 140" stroke="#111827" strokeWidth="2" />

          {/* Mass 1 */}
          <rect
            x="83"
            y="120"
            width="30"
            height="30"
            rx="2"
            fill="#e5e7eb"
            stroke="#111827"
            strokeWidth="2"
          />
          <text
            x="98"
            y="140"
            textAnchor="middle"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="12"
            fontStyle="italic"
            fill="#111827"
          >
            m<tspan dy="3" fontSize="9">1</tspan>
          </text>

          {/* Mass 2 */}
          <rect
            x="127"
            y="140"
            width="30"
            height="34"
            rx="2"
            fill="#e5e7eb"
            stroke="#111827"
            strokeWidth="2"
          />
          <text
            x="142"
            y="162"
            textAnchor="middle"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="12"
            fontStyle="italic"
            fill="#111827"
          >
            m<tspan dy="3" fontSize="9">2</tspan>
          </text>
        </svg>
      );

    case 'projectile-motion':
      return (
        <svg
          viewBox="0 0 240 180"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Projectile motion preview"
        >
          <rect width="240" height="180" fill="#ffffff" />
          {/* Ground */}
          <line x1="15" y1="145" x2="225" y2="145" stroke="#111827" strokeWidth="2" />

          {/* Parabolic Trajectory */}
          <path
            d="M 35 145 Q 120 40 205 145"
            fill="none"
            stroke="#111827"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Launch Angle Arc */}
          <path
            d="M 55 145 A 20 20 0 0 0 49 131"
            fill="none"
            stroke="#111827"
            strokeWidth="1.5"
          />
          <text
            x="64"
            y="138"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="12"
            fontStyle="italic"
            fill="#111827"
          >
            θ
          </text>

          {/* Velocity Vector v0 */}
          <line
            x1="35"
            y1="145"
            x2="72"
            y2="105"
            stroke="#111827"
            strokeWidth="2.5"
          />
          <polygon points="78,98 67,106 75,114" fill="#111827" />
          <text
            x="76"
            y="94"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="13"
            fontStyle="italic"
            fill="#111827"
          >
            v<tspan dy="3" fontSize="9">0</tspan>
          </text>

          {/* Ball */}
          <circle cx="35" cy="145" r="7" fill="#e5e7eb" stroke="#111827" strokeWidth="2" />
        </svg>
      );

    case 'motion-graphs':
      return (
        <svg
          viewBox="0 0 240 180"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Motion graphs preview"
        >
          <rect width="240" height="180" fill="#ffffff" />
          {/* Grid */}
          <g stroke="#e5e7eb" strokeWidth="1">
            <line x1="45" y1="35" x2="215" y2="35" />
            <line x1="45" y1="70" x2="215" y2="70" />
            <line x1="45" y1="105" x2="215" y2="105" />
            <line x1="87" y1="35" x2="87" y2="140" />
            <line x1="130" y1="35" x2="130" y2="140" />
            <line x1="172" y1="35" x2="172" y2="140" />
          </g>

          {/* Axes */}
          <line x1="45" y1="140" x2="220" y2="140" stroke="#111827" strokeWidth="2" />
          <line x1="45" y1="140" x2="45" y2="25" stroke="#111827" strokeWidth="2" />

          {/* Curves */}
          <path
            d="M 45 140 Q 87 140 100 105 L 145 50 Q 175 35 190 35 L 215 35"
            fill="none"
            stroke="#111827"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Axis Labels */}
          <text
            x="215"
            y="156"
            fontFamily="Arial, sans-serif"
            fontSize="11"
            fontWeight="bold"
            fill="#111827"
          >
            t (s)
          </text>
          <text
            x="24"
            y="35"
            fontFamily="Arial, sans-serif"
            fontSize="11"
            fontWeight="bold"
            fill="#111827"
          >
            x (m)
          </text>
        </svg>
      );

    case 'spring-scale':
      return (
        <svg
          viewBox="0 0 240 220"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Spring scale preview"
        >
          <rect width="240" height="220" fill="#ffffff" />
          {/* Top Ring */}
          <circle cx="120" cy="22" r="9" fill="none" stroke="#111827" strokeWidth="2.2" />
          <line x1="120" y1="31" x2="120" y2="38" stroke="#111827" strokeWidth="2.5" />

          {/* Scale Tube */}
          <rect
            x="96"
            y="38"
            width="48"
            height="130"
            rx="5"
            fill="#f9fafb"
            stroke="#111827"
            strokeWidth="2"
          />
          {/* Top Cap */}
          <rect
            x="96"
            y="38"
            width="48"
            height="18"
            rx="4"
            fill="#e5e7eb"
            stroke="#111827"
            strokeWidth="1.5"
          />
          <text
            x="120"
            y="51"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="9"
            fontWeight="bold"
            fill="#111827"
          >
            10 N
          </text>

          {/* Graduations */}
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i}>
              <line
                x1="102"
                y1={66 + i * 18}
                x2="114"
                y2={66 + i * 18}
                stroke="#111827"
                strokeWidth="1.3"
              />
              <text
                x="117"
                y={69 + i * 18}
                fontFamily="Arial, sans-serif"
                fontSize="8"
                fill="#4b5563"
              >
                {i * 2}
              </text>
            </g>
          ))}

          {/* Spring & Pointer */}
          <path
            d="M 126 62 L 123 68 L 129 74 L 123 80 L 129 86 L 123 92 L 126 96"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.3"
          />
          <line x1="106" y1="96" x2="134" y2="96" stroke="#dc2626" strokeWidth="2" />
          <line x1="126" y1="96" x2="126" y2="175" stroke="#6b7280" strokeWidth="2" />

          {/* Bottom Hook */}
          <path
            d="M 126 175 L 126 186 A 8 8 0 0 1 114 186"
            fill="none"
            stroke="#111827"
            strokeWidth="2.5"
          />
        </svg>
      );

    case 'circuit-diagram':
      return (
        <svg
          viewBox="0 0 240 180"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Circuit diagram preview"
        >
          <rect width="240" height="180" fill="#ffffff" />
          {/* Circuit Loop Path */}
          {/* Battery Top */}
          <line x1="40" y1="35" x2="105" y2="35" stroke="#111827" strokeWidth="2" />
          <line x1="105" y1="24" x2="105" y2="46" stroke="#111827" strokeWidth="2.5" />
          <line x1="113" y1="28" x2="113" y2="42" stroke="#111827" strokeWidth="1.5" />
          <line x1="121" y1="24" x2="121" y2="46" stroke="#111827" strokeWidth="2.5" />
          <line x1="129" y1="28" x2="129" y2="42" stroke="#111827" strokeWidth="1.5" />
          <line x1="129" y1="35" x2="200" y2="35" stroke="#111827" strokeWidth="2" />

          {/* Right Wire with Switch */}
          <line x1="200" y1="35" x2="200" y2="70" stroke="#111827" strokeWidth="2" />
          <circle cx="200" cy="70" r="3" fill="#111827" />
          <line x1="200" y1="70" x2="190" y2="88" stroke="#111827" strokeWidth="2.2" />
          <circle cx="200" cy="92" r="3" fill="#111827" />
          <line x1="200" y1="92" x2="200" y2="145" stroke="#111827" strokeWidth="2" />

          {/* Bottom Resistor */}
          <line x1="200" y1="145" x2="145" y2="145" stroke="#111827" strokeWidth="2" />
          <path
            d="M 145 145 L 140 138 L 132 152 L 124 138 L 116 152 L 108 138 L 100 152 L 95 145"
            fill="none"
            stroke="#111827"
            strokeWidth="2"
          />
          <line x1="95" y1="145" x2="40" y2="145" stroke="#111827" strokeWidth="2" />

          {/* Left Wire with Bulb */}
          <line x1="40" y1="145" x2="40" y2="105" stroke="#111827" strokeWidth="2" />
          <circle cx="40" cy="90" r="14" fill="#ffffff" stroke="#111827" strokeWidth="2" />
          <path d="M 32 82 L 48 98 M 32 98 L 48 82" stroke="#111827" strokeWidth="1.8" />
          <line x1="40" y1="76" x2="40" y2="35" stroke="#111827" strokeWidth="2" />
        </svg>
      );

    case 'waves':
      return (
        <svg
          viewBox="0 0 240 180"
          className="w-full h-full object-contain select-none"
          role="img"
          aria-label="Wave diagram preview"
        >
          <rect width="240" height="180" fill="#ffffff" />
          {/* Baseline */}
          <line
            x1="20"
            y1="90"
            x2="220"
            y2="90"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Sine Wave */}
          <path
            d="M 25 90 Q 50 40 75 90 T 125 90 T 175 90 T 215 90"
            fill="none"
            stroke="#111827"
            strokeWidth="2.5"
          />

          {/* Wavelength lambda annotation */}
          <line x1="25" y1="30" x2="125" y2="30" stroke="#111827" strokeWidth="1.5" />
          <line x1="25" y1="24" x2="25" y2="36" stroke="#111827" strokeWidth="1.5" />
          <line x1="125" y1="24" x2="125" y2="36" stroke="#111827" strokeWidth="1.5" />
          <text
            x="75"
            y="24"
            textAnchor="middle"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="14"
            fontStyle="italic"
            fill="#111827"
          >
            λ
          </text>

          {/* Amplitude A annotation */}
          <line x1="150" y1="90" x2="150" y2="40" stroke="#111827" strokeWidth="1.5" />
          <polygon points="150,38 147,46 153,46" fill="#111827" />
          <text
            x="162"
            y="68"
            fontFamily="'Times New Roman', Times, serif"
            fontSize="13"
            fontStyle="italic"
            fill="#111827"
          >
            A
          </text>
        </svg>
      );

    default:
      return null;
  }
};
