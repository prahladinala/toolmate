import { PDFDocument, rgb, degrees, StandardFonts, PageSizes } from "pdf-lib";

export interface PageNumberOptions {
  position: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
  format: "page-x-of-y" | "page-x" | "x" | "dash-x-dash";
  fontSize?: number;
  margin?: number;
  startPage?: number;
}

export interface WatermarkOptions {
  text: string;
  opacity: number;
  fontSize: number;
  angle: number;
  color?: { r: number; g: number; b: number };
}

export interface ImagesToPdfOptions {
  pageSize: "A4" | "LETTER" | "FIT";
  orientation: "portrait" | "landscape";
  margin: number;
}

/**
 * Get number of pages in a PDF file
 */
export async function getPDFPageCount(file: File | ArrayBuffer): Promise<number> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePDFs(files: (File | ArrayBuffer)[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = file instanceof File ? await file.arrayBuffer() : file;
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split PDF by page ranges (e.g. "1-3, 5, 7-10") or extract all pages
 */
export async function splitPDF(
  file: File | ArrayBuffer,
  rangeInput: string
): Promise<{ name: string; data: Uint8Array; pageCount: number }[]> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = doc.getPageCount();

  const results: { name: string; data: Uint8Array; pageCount: number }[] = [];

  // Parse ranges: e.g. "1-3, 5, 7-9"
  const tokens = rangeInput.split(",").map((s) => s.trim()).filter(Boolean);

  if (tokens.length === 0) {
    // Extract every page individually
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(doc, [i]);
      newDoc.addPage(copiedPage);
      const data = await newDoc.save();
      results.push({
        name: `page-${i + 1}.pdf`,
        data,
        pageCount: 1,
      });
    }
    return results;
  }

  let index = 1;
  for (const token of tokens) {
    let pageIndices: number[] = [];
    if (token.includes("-")) {
      const [startStr, endStr] = token.split("-").map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let p = start; p <= end; p++) {
          pageIndices.push(p - 1);
        }
      }
    } else {
      const p = parseInt(token, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        pageIndices.push(p - 1);
      }
    }

    if (pageIndices.length > 0) {
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(doc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));
      const data = await newDoc.save();
      results.push({
        name: `split-part-${index}-${token}.pdf`,
        data,
        pageCount: pageIndices.length,
      });
      index++;
    }
  }

  return results;
}

/**
 * Rotate pages in a PDF
 */
export async function rotatePDF(
  file: File | ArrayBuffer,
  rotations: Record<number, number>
): Promise<Uint8Array> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = doc.getPageCount();

  for (let i = 0; i < total; i++) {
    const pageNum = i + 1;
    const additionalRotation = rotations[pageNum] || rotations[0] || 0;
    if (additionalRotation !== 0) {
      const page = doc.getPage(i);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + additionalRotation) % 360));
    }
  }

  return await doc.save();
}

/**
 * Stamp page numbers on a PDF
 */
export async function addPageNumbers(
  file: File | ArrayBuffer,
  options: PageNumberOptions
): Promise<Uint8Array> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const totalPages = doc.getPageCount();

  const fontSize = options.fontSize || 10;
  const margin = options.margin || 25;
  const startPage = options.startPage || 1;

  for (let i = startPage - 1; i < totalPages; i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const currentPageNum = i + 1;

    let text = "";
    switch (options.format) {
      case "page-x-of-y":
        text = `Page ${currentPageNum} of ${totalPages}`;
        break;
      case "page-x":
        text = `Page ${currentPageNum}`;
        break;
      case "dash-x-dash":
        text = `- ${currentPageNum} -`;
        break;
      case "x":
      default:
        text = `${currentPageNum}`;
        break;
    }

    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = margin;
    let y = margin;

    if (options.position.includes("center")) {
      x = (width - textWidth) / 2;
    } else if (options.position.includes("right")) {
      x = width - margin - textWidth;
    } else {
      x = margin;
    }

    if (options.position.startsWith("top")) {
      y = height - margin - fontSize;
    } else {
      y = margin;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  return await doc.save();
}

/**
 * Add a diagonal or centered watermark to all pages
 */
export async function addWatermark(
  file: File | ArrayBuffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const totalPages = doc.getPageCount();

  const color = options.color || { r: 0.5, g: 0.5, b: 0.5 };

  for (let i = 0; i < totalPages; i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
    const textHeight = font.heightAtSize(options.fontSize);

    // Center coordinates
    const centerX = width / 2;
    const centerY = height / 2;

    page.drawText(options.text, {
      x: centerX - textWidth / 2,
      y: centerY - textHeight / 4,
      size: options.fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity: Math.max(0.05, Math.min(options.opacity, 1)),
      rotate: degrees(options.angle),
    });
  }

  return await doc.save();
}

/**
 * Reorder pages of a PDF
 */
export async function reorderPDF(
  file: File | ArrayBuffer,
  newOrder: number[] // 1-indexed page numbers in new desired sequence
): Promise<Uint8Array> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const zeroIndexed = newOrder.map((n) => n - 1);
  const copiedPages = await newDoc.copyPages(doc, zeroIndexed);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

/**
 * Remove specified pages from a PDF
 */
export async function removePDFPages(
  file: File | ArrayBuffer,
  pagesToRemove: number[] // 1-indexed
): Promise<Uint8Array> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = doc.getPageCount();

  const toRemoveSet = new Set(pagesToRemove);
  const remainingIndices: number[] = [];

  for (let i = 1; i <= total; i++) {
    if (!toRemoveSet.has(i)) {
      remainingIndices.push(i - 1);
    }
  }

  if (remainingIndices.length === 0) {
    throw new Error("Cannot remove all pages from PDF.");
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(doc, remainingIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

/**
 * Convert an array of image files into a single PDF
 */
export async function imagesToPDF(
  images: { file: File; width?: number; height?: number }[],
  options: ImagesToPdfOptions = { pageSize: "A4", orientation: "portrait", margin: 20 }
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  const standardSize = options.pageSize === "LETTER" ? PageSizes.Letter : PageSizes.A4;
  const [pageW, pageH] =
    options.orientation === "landscape"
      ? [standardSize[1], standardSize[0]]
      : [standardSize[0], standardSize[1]];

  for (const item of images) {
    const arrayBuffer = await item.file.arrayBuffer();
    const type = item.file.type.toLowerCase();

    let embeddedImage;
    if (type.includes("png")) {
      embeddedImage = await doc.embedPng(arrayBuffer);
    } else {
      // JPG, JPEG, and WebP converted to JPG
      try {
        embeddedImage = await doc.embedJpg(arrayBuffer);
      } catch {
        embeddedImage = await doc.embedPng(arrayBuffer);
      }
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    if (options.pageSize === "FIT") {
      // Page size matches image exactly
      const page = doc.addPage([imgWidth, imgHeight]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
      });
    } else {
      const page = doc.addPage([pageW, pageH]);
      const availWidth = pageW - options.margin * 2;
      const availHeight = pageH - options.margin * 2;

      const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight, 1);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      const x = (pageW - drawWidth) / 2;
      const y = (pageH - drawHeight) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  return await doc.save();
}

/**
 * Compress PDF by rewriting streams and removing unused objects
 */
export async function compressPDF(file: File | ArrayBuffer): Promise<Uint8Array> {
  const bytes = file instanceof File ? await file.arrayBuffer() : file;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  // PDF-Lib compress option
  return await doc.save({ useObjectStreams: true });
}
