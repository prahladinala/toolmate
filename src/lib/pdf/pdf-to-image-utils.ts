/**
 * Client-side PDF page rendering to images using pdfjs-dist
 */

export interface RenderedPageImage {
  pageNum: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export async function renderPDFPagesToImages(
  file: File,
  options: {
    format?: "image/jpeg" | "image/png";
    scale?: number;
  } = {}
): Promise<RenderedPageImage[]> {
  const format = options.format || "image/jpeg";
  const scale = options.scale || 1.5;

  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const total = pdfDoc.numPages;

  const pages: RenderedPageImage[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    // White background for JPEG
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: ctx, viewport } as any).promise;

    const dataUrl = canvas.toDataURL(format, 0.92);
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), format, 0.92);
    });

    pages.push({
      pageNum: i,
      dataUrl,
      blob,
      width: Math.round(viewport.width),
      height: Math.round(viewport.height),
    });
  }

  return pages;
}
