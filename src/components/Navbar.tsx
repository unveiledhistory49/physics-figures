import React from 'react';
import { ExternalLink, Atom, Sparkles } from 'lucide-react';
import type { GeneratorKind } from '../types/figures';

interface NavbarProps {
  activeGenerator: GeneratorKind | null;
  onSelectGenerator: (kind: GeneratorKind | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeGenerator,
  onSelectGenerator,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectGenerator(null)}
            className="flex items-center gap-2.5 text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block">
                Physics Figures
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide block uppercase">
                Vector Diagram Generator
              </span>
            </div>
          </button>

          {activeGenerator && (
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
              <span className="text-xs text-slate-400">/</span>
              <button
                type="button"
                onClick={() => onSelectGenerator(null)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                All Figures
              </button>
            </div>
          )}
        </div>

        {/* Network Family (STEM Figures) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-slate-400 mr-1">Network:</span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              Math Figures
              <Sparkles className="w-3 h-3 text-amber-500" />
            </span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              Chemistry Figures
              <Sparkles className="w-3 h-3 text-emerald-500" />
            </span>
          </div>

          <a
            href="https://stemfigures.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            STEM Figures
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
