import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <div className="flex justify-between items-center text-slate-700 font-medium">
        <span>{label}</span>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
      />
    </div>
  );
};
