import React, { useState, useEffect } from 'react';
import type { GeneratorKind } from './types/figures';
import { Navbar } from './components/Navbar';
import { Catalog } from './components/Catalog';

// Generators & Defaults
import {
  FreeBodyDiagram,
  defaultFreeBodyDiagramState,
} from './generators/FreeBodyDiagram';
import {
  VectorDiagram,
  defaultVectorDiagramState,
} from './generators/VectorDiagram';
import {
  InclinedPlane,
  defaultInclinedPlaneState,
} from './generators/InclinedPlane';
import {
  Pulley,
  defaultPulleyState,
} from './generators/Pulley';
import {
  ProjectileMotion,
  defaultProjectileMotionState,
} from './generators/ProjectileMotion';
import {
  MotionGraphs,
  defaultMotionGraphsState,
} from './generators/MotionGraphs';
import {
  SpringScale,
  defaultSpringScaleState,
} from './generators/SpringScale';
import {
  CircuitDiagram,
  defaultCircuitDiagramState,
} from './generators/CircuitDiagram';
import {
  WaveDiagram,
  defaultWaveDiagramState,
} from './generators/WaveDiagram';

export const App: React.FC = () => {
  // Read initial figure from URL params if present
  const [activeGenerator, setActiveGenerator] = useState<GeneratorKind | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const fig = params.get('figure') as GeneratorKind | null;
    return fig || null;
  });

  // State objects for each generator
  const [fbdState, setFbdState] = useState(defaultFreeBodyDiagramState);
  const [vectorState, setVectorState] = useState(defaultVectorDiagramState);
  const [inclinedState, setInclinedState] = useState(defaultInclinedPlaneState);
  const [pulleyState, setPulleyState] = useState(defaultPulleyState);
  const [projectileState, setProjectileState] = useState(defaultProjectileMotionState);
  const [motionGraphState, setMotionGraphState] = useState(defaultMotionGraphsState);
  const [springScaleState, setSpringScaleState] = useState(defaultSpringScaleState);
  const [circuitState, setCircuitState] = useState(defaultCircuitDiagramState);
  const [waveState, setWaveState] = useState(defaultWaveDiagramState);

  // Sync active figure to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeGenerator) {
      params.set('figure', activeGenerator);
    } else {
      params.delete('figure');
    }
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeGenerator]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar
        activeGenerator={activeGenerator}
        onSelectGenerator={setActiveGenerator}
      />

      <main className="flex-1 flex flex-col">
        {activeGenerator === null ? (
          <Catalog onSelectGenerator={setActiveGenerator} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col gap-6">
            <div className="flex items-center justify-between no-print border-b border-slate-200/80 pb-3">
              <button
                type="button"
                onClick={() => setActiveGenerator(null)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80"
              >
                <span>←</span>
                <span>Back to all figures</span>
              </button>
              <span className="text-xs font-mono text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 hidden sm:inline-block">
                Studio Active
              </span>
            </div>

            {activeGenerator === 'free-body-diagram' && (
              <FreeBodyDiagram state={fbdState} onChange={setFbdState} />
            )}
            {activeGenerator === 'vector-diagram' && (
              <VectorDiagram state={vectorState} onChange={setVectorState} />
            )}
            {activeGenerator === 'inclined-plane' && (
              <InclinedPlane state={inclinedState} onChange={setInclinedState} />
            )}
            {activeGenerator === 'pulley' && (
              <Pulley state={pulleyState} onChange={setPulleyState} />
            )}
            {activeGenerator === 'projectile-motion' && (
              <ProjectileMotion state={projectileState} onChange={setProjectileState} />
            )}
            {activeGenerator === 'motion-graphs' && (
              <MotionGraphs state={motionGraphState} onChange={setMotionGraphState} />
            )}
            {activeGenerator === 'spring-scale' && (
              <SpringScale state={springScaleState} onChange={setSpringScaleState} />
            )}
            {activeGenerator === 'circuit-diagram' && (
              <CircuitDiagram state={circuitState} onChange={setCircuitState} />
            )}
            {activeGenerator === 'waves' && (
              <WaveDiagram state={waveState} onChange={setWaveState} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span className="font-medium text-slate-700">Vector Physics</span>
            <span>— Precision STEM vector diagram studio for tests and worksheets.</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="https://vector-math.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-amber-600 transition-colors"
            >
              Vector Math
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="https://vector-chem.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-blue-800 transition-colors"
            >
              Vector Chem
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="https://github.com/unveiledhistory49/vector-physics"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
