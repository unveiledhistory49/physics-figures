import React from 'react';

interface Option<T> {
  value: T;
  label: React.ReactNode;
}

interface SegmentedControlProps<T> {
  label?: string;
  value: T;
  options: Option<T>[];
  onChange: (val: T) => void;
}

export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      {label && <span className="text-xs text-slate-700 font-semibold">{label}</span>}
      <div className="flex bg-slate-100/80 p-1 rounded-lg border border-slate-200">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 py-1 px-2.5 text-xs font-medium rounded-md transition-all text-center flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-white text-emerald-800 shadow-sm font-semibold border border-slate-200/80 ring-1 ring-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
