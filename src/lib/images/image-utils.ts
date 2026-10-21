/**
 * Client-side image manipulation and conversion utilities
 */

export interface ImageProcessingOptions {
  format?: "image/jpeg" | "image/png" | "image/webp";
  quality?: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
}

export interface CompressedImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  newSize: number;
  reductionPercentage: number;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function loadImage(source: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error("Failed to load image: " + err));

    if (typeof source === "string") {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Resizes and compresses an image via HTML5 Canvas
 */
export async function compressAndConvertImage(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<CompressedImageResult> {
  const img = await loadImage(file);
  const { format = "image/jpeg", quality = 0.82, maxWidth = 3840, maxHeight = 3840 } = options;

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  // Calculate scaled dimensions if maxWidth or maxHeight is exceeded
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");

  // If saving to JPEG, fill white background in case source had transparency
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas conversion to Blob failed"));
          return;
        }

        const dataUrl = canvas.toDataURL(format, quality);
        const originalSize = file.size;
        const newSize = blob.size;
        const reductionPercentage = Math.round(((originalSize - newSize) / originalSize) * 100);

        resolve({
          blob,
          dataUrl,
          width,
          height,
          originalSize,
          newSize,
          reductionPercentage,
        });
      },
      format,
      quality
    );
  });
}

/**
 * Perform client-side background removal via color/luminance corner-sampling and flood keying
 */
export async function removeBackground(
  imageSource: File | HTMLImageElement,
  options: {
    tolerance: number; // 5 - 100
    feather: number;   // 0 - 10
    keyColor?: { r: number; g: number; b: number };
  }
): Promise<{ canvas: HTMLCanvasElement; blob: Blob; dataUrl: string }> {
  const img = imageSource instanceof HTMLImageElement ? imageSource : await loadImage(imageSource);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Cannot get canvas context");

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Sample corner colors if keyColor is not provided
  let keyR = 255;
  let keyG = 255;
  let keyB = 255;

  if (options.keyColor) {
    keyR = options.keyColor.r;
    keyG = options.keyColor.g;
    keyB = options.keyColor.b;
  } else {
    // Sample top-left corner
    keyR = data[0];
    keyG = data[1];
    keyB = data[2];
  }

  const tol = options.tolerance * 2.5;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      Math.pow(r - keyR, 2) + Math.pow(g - keyG, 2) + Math.pow(b - keyB, 2)
    );

    if (dist < tol) {
      if (dist < tol * 0.7) {
        data[i + 3] = 0; // Completely transparent
      } else {
        // Feather edge
        const alpha = ((dist - tol * 0.7) / (tol * 0.3)) * 255;
        data[i + 3] = Math.min(data[i + 3], alpha);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        canvas,
        blob: blob!,
        dataUrl: canvas.toDataURL("image/png"),
      });
    }, "image/png");
  });
}

/**
 * Professional bokeh portrait blur
 */
export async function applyPortraitBlur(
  imageSource: File | HTMLImageElement,
  options: {
    blurRadius: number; // 1 to 40
    focusShape: "oval" | "radial" | "horizontal";
    focusX: number; // 0 to 1 (normalized center)
    focusY: number; // 0 to 1
    focusSize: number; // 0.1 to 0.9
  }
): Promise<{ canvas: HTMLCanvasElement; blob: Blob; dataUrl: string }> {
  const img = imageSource instanceof HTMLImageElement ? imageSource : await loadImage(imageSource);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  // Step 1: Draw blurred background
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = width;
  bgCanvas.height = height;
  const bgCtx = bgCanvas.getContext("2d");
  if (bgCtx) {
    bgCtx.filter = `blur(${options.blurRadius}px)`;
    bgCtx.drawImage(img, 0, 0, width, height);
  }

  ctx.drawImage(bgCanvas, 0, 0);

  // Step 2: Draw crisp focal area on top with gradient mask
  const fgCanvas = document.createElement("canvas");
  fgCanvas.width = width;
  fgCanvas.height = height;
  const fgCtx = fgCanvas.getContext("2d");

  if (fgCtx) {
    const cx = width * options.focusX;
    const cy = height * options.focusY;
    const maxRadius = Math.min(width, height) * (options.focusSize / 2);

    const grad = fgCtx.createRadialGradient(cx, cy, maxRadius * 0.4, cx, cy, maxRadius);
    grad.addColorStop(0, "rgba(0, 0, 0, 1)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    fgCtx.fillStyle = grad;
    fgCtx.fillRect(0, 0, width, height);
    fgCtx.globalCompositeOperation = "source-in";
    fgCtx.drawImage(img, 0, 0, width, height);

    ctx.drawImage(fgCanvas, 0, 0);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        canvas,
        blob: blob!,
        dataUrl: canvas.toDataURL("image/jpeg", 0.92),
      });
    }, "image/jpeg", 0.92);
  });
}

/**
 * Generate Die-Cut Sticker with border contour
 */
export async function createSticker(
  imageSource: File | HTMLImageElement,
  options: {
    borderWidth: number; // 4 to 30
    borderColor: string;
    shadowBlur: number;
    shadowColor: string;
  }
): Promise<{ canvas: HTMLCanvasElement; blob: Blob; dataUrl: string }> {
  const img = imageSource instanceof HTMLImageElement ? imageSource : await loadImage(imageSource);
  const padding = options.borderWidth * 2 + options.shadowBlur * 2 + 10;
  const width = (img.naturalWidth || img.width) + padding * 2;
  const height = (img.naturalHeight || img.height) + padding * 2;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Context unavailable");

  const x = padding;
  const y = padding;
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  // Draw shadow
  if (options.shadowBlur > 0) {
    ctx.save();
    ctx.shadowColor = options.shadowColor;
    ctx.shadowBlur = options.shadowBlur;
    ctx.shadowOffsetY = options.shadowBlur / 2;
    // draw outline mask for shadow
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const ox = Math.cos(angle) * options.borderWidth;
      const oy = Math.sin(angle) * options.borderWidth;
      ctx.drawImage(img, x + ox, y + oy, imgW, imgH);
    }
    ctx.restore();
  }

  // Draw white/colored thick border contour
  ctx.save();
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
    for (let r = 1; r <= options.borderWidth; r += 2) {
      const ox = Math.cos(angle) * r;
      const oy = Math.sin(angle) * r;
      ctx.drawImage(img, x + ox, y + oy, imgW, imgH);
    }
  }
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = options.borderColor;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Draw original image on top
  ctx.drawImage(img, x, y, imgW, imgH);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        canvas,
        blob: blob!,
        dataUrl: canvas.toDataURL("image/png"),
      });
    }, "image/png");
  });
}
