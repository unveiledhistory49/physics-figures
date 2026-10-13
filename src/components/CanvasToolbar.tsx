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
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  svgRef,
  filename,
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
    <div className="flex items-center justify-between p-2 bg-white border-b border-slate-200 no-print rounded-t-xl">
      <div className="flex items-center gap-1">
        {/* Copy Image Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
          title="Copy 3x High-DPI PNG to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied PNG!' : 'Copy image'}
        </button>

        {/* Download PNG */}
        <button
          type="button"
          onClick={handleDownloadPng}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
          title="Download 3x High-Resolution PNG"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          PNG
        </button>

        {/* Download SVG */}
        <button
          type="button"
          onClick={handleDownloadSvg}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
          title="Download scalable vector SVG"
        >
          <FileCode className="w-3.5 h-3.5 text-slate-500" />
          SVG
        </button>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        {/* Print */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
          title="Print figure"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          Print
        </button>

        {/* Share Link */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
          title="Copy link with current settings"
        >
          {shared ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
          {shared ? 'Link Copied!' : 'Share'}
        </button>
      </div>

      <div className="flex items-center gap-1">
        {/* Undo */}
        <button
          type="button"
          disabled={!canUndo}
          onClick={onUndo}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          type="button"
          disabled={!canRedo}
          onClick={onRedo}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
