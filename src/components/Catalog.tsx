import React, { useState } from 'react';
import type { GeneratorKind, GeneratorMetadata } from '../types/figures';
import { Search, ArrowRight, Atom } from 'lucide-react';

interface CatalogProps {
  onSelectGenerator: (kind: GeneratorKind) => void;
}

export const GENERATORS: GeneratorMetadata[] = [
  {
    id: 'free-body-diagram',
    title: 'Free Body Diagram Generator',
    description: 'A dot, block, ball or cart with customizable force vectors, angle sliders, and component projections.',
    tags: ['Mechanics', 'Forces', 'Newton Laws', 'AP Physics'],
  },
  {
    id: 'vector-diagram',
    title: 'Vector Diagram Generator',
    description: 'Up to four vectors added head-to-tail on a Cartesian grid with their auto-calculated resultant vector.',
    tags: ['Kinematics', 'Vectors', 'Resultant'],
  },
  {
    id: 'inclined-plane',
    title: 'Inclined Plane Generator',
    description: 'A block, ball or cart on a ramp at angle θ, with gravity components, normal force, and friction.',
    tags: ['Mechanics', 'Ramp', 'Components'],
  },
  {
    id: 'pulley',
    title: 'Pulley & Atwood Machine Generator',
    description: 'Objects on strings over single or double pulleys, with tension vectors and hanging masses.',
    tags: ['Mechanics', 'Atwood Machine', 'Tension'],
  },
  {
    id: 'projectile-motion',
    title: 'Projectile Motion Generator',
    description: 'A launch from ground or an elevated cliff, with velocity vectors, parabolic arc, apex, and range callouts.',
    tags: ['Kinematics', 'Trajectories', '2D Motion'],
  },
  {
    id: 'motion-graphs',
    title: 'Motion Graph Generator',
    description: 'Position, velocity and acceleration vs time graphs, built segment by segment with linear and curved paths.',
    tags: ['Kinematics', 'Graphs', 'Calculus'],
  },
  {
    id: 'spring-scale',
    title: 'Spring Scale Generator',
    description: 'Calibrated Newton spring scale with spring coil stretch physics, pointer collar, and hanging load.',
    tags: ['Measurement', 'Hooke Law', 'Lab Instruments'],
  },
  {
    id: 'circuit-diagram',
    title: 'Circuit Diagram Generator',
    description: 'DC circuits with batteries, resistors, light bulbs, switches, and meters in series or parallel.',
    tags: ['Electricity', 'Circuits', 'Schematics'],
  },
  {
    id: 'waves',
    title: 'Wave Diagram Generator',
    description: 'Transverse and longitudinal sinusoidal waves, showing wavelength λ, amplitude A, nodes and antinodes.',
    tags: ['Waves', 'Harmonics', 'Oscillations'],
  },
];

export const Catalog: React.FC<CatalogProps> = ({ onSelectGenerator }) => {
  const [search, setSearch] = useState('');

  const filtered = GENERATORS.filter((gen) => {
    const q = search.toLowerCase();
    return (
      gen.title.toLowerCase().includes(q) ||
      gen.description.toLowerCase().includes(q) ||
      gen.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mx-auto">
          <Atom className="w-3.5 h-3.5 text-emerald-600" />
          Vector Physics Studio
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Vector physics figures for your tests and worksheets
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Make clean, publication-grade vector diagrams for tests, worksheets, and slides.
          Free, with high-DPI PNG clipboard copying and SVG downloads.
        </p>

        {/* Search Input */}
        <div className="mt-4 relative max-w-lg mx-auto w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search figures, e.g. “free body diagram”, “inclined plane”, “waves”..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white shadow-sm text-sm focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>
      </div>

      {/* Grid of Figure Generators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filtered.map((gen) => (
          <div
            key={gen.id}
            onClick={() => onSelectGenerator(gen.id)}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                  {gen.tags[0]}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-600 transition-colors">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {gen.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {gen.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-5 pt-3.5 border-t border-slate-100">
              {gen.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            No physics figures found matching "{search}". Try searching for "forces", "inclined", or "circuits".
          </div>
        )}
      </div>
    </div>
  );
};
