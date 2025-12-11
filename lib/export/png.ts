export type ExportOptions = {
  widthPx: number;
  heightPx: number;
  backgroundColor?: string;
  filename?: string;
};

function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgData = new XMLSerializer().serializeToString(clone);
  return svgData;
}

export async function exportSvgContainerToPng(
  container: HTMLElement,
  opts: ExportOptions
): Promise<void> {
  const svg = container.querySelector("svg");
  if (!svg) {
    throw new Error("No SVG found to export.");
  }
  const { widthPx, heightPx, backgroundColor = "#ffffff", filename = "mymap.png" } = opts;
  const svgText = serializeSvg(svg as SVGSVGElement);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    const loadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(e);
    });
    img.src = url;
    await loadPromise;

    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas not supported.");
    }
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, widthPx, heightPx);

    const aspectSvg = (img.width || 1) / (img.height || 1);
    const aspectOut = widthPx / heightPx;
    let drawW = widthPx;
    let drawH = heightPx;
    let dx = 0;
    let dy = 0;
    if (aspectSvg > aspectOut) {
      drawH = heightPx;
      drawW = Math.round(heightPx * aspectSvg);
      dx = Math.round((widthPx - drawW) / 2);
    } else {
      drawW = widthPx;
      drawH = Math.round(widthPx / aspectSvg);
      dy = Math.round((heightPx - drawH) / 2);
    }
    ctx.drawImage(img, dx, dy, drawW, drawH);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png")
    );
    if (!blob) throw new Error("Failed to create PNG blob.");

    const pngUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(pngUrl);
  } finally {
    URL.revokeObjectURL(url);
  }
}
