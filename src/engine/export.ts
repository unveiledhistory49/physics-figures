/**
 * Export and Clipboard Pipeline
 */

/**
 * Sanitizes and serializes an SVG element into a clean XML string
 */
export const serializeSvg = (svgElement: SVGSVGElement): string => {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Remove any interactive UI or guide elements marked with data-no-export
  const nonExportables = clone.querySelectorAll('[data-no-export]');
  nonExportables.forEach((el) => el.remove());

  // Ensure standard namespaces exist
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  // Ensure explicit dimensions on SVG root for standalone Image and canvas rendering
  const viewBox = svgElement.viewBox?.baseVal;
  const width = viewBox?.width || svgElement.clientWidth || 600;
  const height = viewBox?.height || svgElement.clientHeight || 400;
  if (!clone.getAttribute('width')) {
    clone.setAttribute('width', String(width));
  }
  if (!clone.getAttribute('height')) {
    clone.setAttribute('height', String(height));
  }

  // Inject embedded stylesheet so standalone SVG/PNG rendering preserves math text halo and typography
  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = `
    .math-text-stroke { paint-order: stroke fill; stroke-linejoin: round; }
    text { font-family: 'Times New Roman', Times, serif; }
  `;
  let defs = clone.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    clone.insertBefore(defs, clone.firstChild);
  }
  defs.appendChild(styleEl);

  return new XMLSerializer().serializeToString(clone);
};

/**
 * Renders an SVG to an offscreen HTML5 canvas at high-DPI (default 3x) and returns PNG Blob
 */
export const svgToPngBlob = (
  svgElement: SVGSVGElement,
  scale: number = 3
): Promise<Blob> => {
  const viewBox = svgElement.viewBox.baseVal;
  const width = viewBox.width || svgElement.clientWidth || 600;
  const height = viewBox.height || svgElement.clientHeight || 400;

  const svgString = serializeSvg(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          return reject(new Error('Canvas 2D context unavailable'));
        }

        // Fill solid white background so copied PNG isn't transparent on dark slide backgrounds
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas export failed to produce blob'));
          }
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load SVG into image: ${e}`));
    };

    img.src = url;
  });
};

/**
 * Initiates browser download of a given Blob
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Download SVG file
 */
export const downloadSvg = (svgElement: SVGSVGElement, filename: string = 'physics-figure.svg'): void => {
  const svgString = serializeSvg(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename.endsWith('.svg') ? filename : `${filename}.svg`);
};

/**
 * Download high-DPI PNG file
 */
export const downloadPng = async (
  svgElement: SVGSVGElement,
  filename: string = 'physics-figure.png',
  scale: number = 3
): Promise<void> => {
  const blob = await svgToPngBlob(svgElement, scale);
  downloadBlob(blob, filename.endsWith('.png') ? filename : `${filename}.png`);
};

/**
 * Copy high-DPI PNG directly to system clipboard
 */
export const copyImageToClipboard = async (
  svgElement: SVGSVGElement,
  scale: number = 3
): Promise<boolean> => {
  try {
    const blob = await svgToPngBlob(svgElement, scale);
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Clipboard API not supported');
    }
    await navigator.clipboard.write([
      new window.ClipboardItem({
        'image/png': blob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  }
};
