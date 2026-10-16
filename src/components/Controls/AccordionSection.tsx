import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionSectionProps {
  icon: React.ReactNode;
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  accent?: 'emerald' | 'amber' | 'blue';
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  icon,
  title,
  summary,
  defaultOpen = true,
  children,
  accent = 'emerald',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const iconBg = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
  }[accent];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-sm ${iconBg}`}
          >
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {title}
            </span>
            {summary && (
              <span className="text-[11px] text-slate-500 truncate leading-normal">
                {summary}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex flex-col gap-3.5">
          {children}
        </div>
      )}
    </div>
  );
};
