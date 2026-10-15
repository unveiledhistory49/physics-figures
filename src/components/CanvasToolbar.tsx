import React, { useState } from 'react';
import {
  Copy,
  Download,
  FileCode,
  Share2,
  Printer,
  Undo2,
  Redo2,
  Check,
} from 'lucide-react';
import {
  copyImageToClipboard,
  downloadPng,
  downloadSvg,
} from '../engine/export';

interface CanvasToolbarProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  filename: string;
  dimensions?: { width: number; height: number };
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  svgRef,
  filename,
  dimensions,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = async () => {
    if (!svgRef.current) return;
    const ok = await copyImageToClipboard(svgRef.current, 3);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    if (!svgRef.current) return;
    await downloadPng(svgRef.current, `${filename}.png`, 3);
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    downloadSvg(svgRef.current, `${filename}.svg`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-2.5 bg-white border-b border-slate-200/90 no-print rounded-t-xl gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Copy Image Button - High visibility discipline emerald */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm transition-all active:scale-95"
          title="Copy 3× High-DPI PNG to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied PNG!' : 'Copy PNG'}</span>
        </button>

        {/* Download PNG */}
        <button
          type="button"
          onClick={handleDownloadPng}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200/80 bg-slate-50/50"
          title="Download 3× High-Resolution PNG"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>PNG</span>
        </button>

        {/* Download SVG */}
        <button
          type="button"
          onClick={handleDownloadSvg}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200/80 bg-slate-50/50"
          title="Download scalable vector SVG"
        >
          <FileCode className="w-3.5 h-3.5 text-slate-500" />
          <span>SVG</span>
        </button>

        <div className="w-px h-4 bg-slate-200 mx-0.5 hidden sm:block" />

        {/* Print */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Print figure"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Print</span>
        </button>

        {/* Share Link */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Copy link with current settings"
        >
          {shared ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
          <span>{shared ? 'Copied!' : 'Share'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {dimensions && (
          <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md hidden md:inline-block">
            {dimensions.width}×{dimensions.height} px
          </span>
        )}

        <div className="flex items-center gap-0.5">
          {/* Undo */}
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          {/* Redo */}
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
