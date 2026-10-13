import React from 'react';
import { Compass } from 'lucide-react';

interface AnglePickerProps {
  label: string;
  value: number; // 0-359
  onChange: (deg: number) => void;
}

export const AnglePicker: React.FC<AnglePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const normValue = ((Math.round(value) % 360) + 360) % 360;

  const quickDirections = [
    { name: 'Up', deg: 90 },
    { name: 'Down', deg: 270 },
    { name: 'Left', deg: 180 },
    { name: 'Right', deg: 0 },
  ];

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between items-center text-slate-700 font-medium">
        <span className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-slate-400" />
          {label}
        </span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={359}
            value={normValue}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              onChange(((val % 360) + 360) % 360);
            }}
            className="w-14 text-xs font-mono border border-slate-300 rounded px-1.5 py-0.5 text-right bg-white focus:outline-blue-500"
          />
          <span className="text-xs text-slate-500">°</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={359}
        value={normValue}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
      />

      <div className="grid grid-cols-4 gap-1.5 mt-0.5">
        {quickDirections.map((dir) => {
          const isActive = normValue === dir.deg;
          return (
            <button
              key={dir.name}
              type="button"
              onClick={() => onChange(dir.deg)}
              className={`py-1 text-xs font-medium rounded border transition-colors ${
                isActive
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {dir.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
