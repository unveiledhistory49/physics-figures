import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  description,
}) => {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none text-sm group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <div className="flex flex-col">
        <span className="text-slate-800 font-medium group-hover:text-slate-900 transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-xs text-slate-500">{description}</span>
        )}
      </div>
    </label>
  );
};
