import React from 'react';
import type { FormattedLabel, LabelMode } from '../../types/figures';
import { Type, Minus, EyeOff } from 'lucide-react';

interface LabelInputProps {
  label: string;
  value: FormattedLabel;
  onChange: (val: FormattedLabel) => void;
  placeholder?: string;
}

export const LabelInput: React.FC<LabelInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'F_g',
}) => {
  const modes: { mode: LabelMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'text', label: 'Text', icon: <Type className="w-3.5 h-3.5" /> },
    { mode: 'blank', label: 'Blank line', icon: <Minus className="w-3.5 h-3.5" /> },
    { mode: 'none', label: 'None', icon: <EyeOff className="w-3.5 h-3.5" /> },
  ];

  const symbols = ['θ', 'μ', 'α', 'β', 'Δ', 'λ', 'Ω', '°'];
  const subscripts = ['_g', '_N', '_f', '_A', '_x', '_y', '_0', '_1', '_2'];

  const appendToken = (token: string) => {
    onChange({
      ...value,
      mode: 'text',
      text: (value.text || '') + token,
    });
  };

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <div className="flex justify-between items-center text-slate-700 font-medium">
        <span>{label}</span>
      </div>

      {/* Mode switcher */}
      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
        {modes.map((m) => (
          <button
            key={m.mode}
            type="button"
            onClick={() => onChange({ ...value, mode: m.mode })}
            className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              value.mode === m.mode
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Text input with math symbols */}
      {value.mode === 'text' && (
        <div className="flex flex-col gap-1 mt-1">
          <input
            type="text"
            value={value.text}
            placeholder={placeholder}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            className="w-full text-xs font-serif italic border border-slate-300 rounded px-2.5 py-1.5 bg-white focus:outline-blue-500"
          />

          {/* Quick symbol insertion chips */}
          <div className="flex flex-wrap gap-1 mt-0.5">
            {symbols.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => appendToken(sym)}
                className="px-1.5 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 font-serif"
                title={`Insert ${sym}`}
              >
                {sym}
              </button>
            ))}
            <div className="w-px h-4 bg-slate-200 my-auto mx-0.5" />
            {subscripts.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => appendToken(sub)}
                className="px-1.5 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 font-serif"
                title={`Insert subscript ${sub}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
