import React from 'react';
import { ExternalLink, Atom } from 'lucide-react';
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectGenerator(null)}
            className="flex items-center gap-2.5 text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block">
                Physics Figures
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold tracking-wider block uppercase">
                Technical Vector Studio
              </span>
            </div>
          </button>

          {activeGenerator && (
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
              <span className="text-xs text-slate-400">/</span>
              <button
                type="button"
                onClick={() => onSelectGenerator(null)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
              >
                All Figures
              </button>
            </div>
          )}
        </div>

        {/* Network Family (STEM Figures) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600">
            <span className="text-slate-400 mr-0.5 font-medium">Studio Suite:</span>
            <a
              href="https://math-figures.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Math
            </a>
            <a
              href="https://chemistry-figures.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-medium transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-blue-800 inline-block" />
              Chemistry
            </a>
          </div>

          <a
            href="https://github.com/unveiledhistory49/physics-figures"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
