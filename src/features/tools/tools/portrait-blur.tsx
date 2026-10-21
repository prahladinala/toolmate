"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { applyPortraitBlur, downloadBlob } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Aperture,
  CheckCircle2,
  Sliders,
} from "lucide-react";

export function PortraitBlurTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [blurRadius, setBlurRadius] = useState(16);
  const [focusSize, setFocusSize] = useState(0.5);
  const [focusX, setFocusX] = useState(0.5);
  const [focusY, setFocusY] = useState(0.45);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (
    src: File,
    radius = blurRadius,
    size = focusSize,
    fx = focusX,
    fy = focusY
  ) => {
    setIsProcessing(true);
    try {
      const res = await applyPortraitBlur(src, {
        blurRadius: radius,
        focusShape: "radial",
        focusSize: size,
        focusX: fx,
        focusY: fy,
      });
      setResultUrl(res.dataUrl);
      setResultBlob(res.blob);
    } catch (e) {
      console.error("Portrait blur error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith("image/")) return;
    setFile(selected);
    setPreviewOriginal(URL.createObjectURL(selected));
    processImage(selected);
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    downloadBlob(resultBlob, `${base}-portrait-bokeh.jpg`);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Bokeh Blur:</span>
              <input
                type="range"
                min="4"
                max="35"
                value={blurRadius}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBlurRadius(val);
                  if (file) processImage(file, val, focusSize, focusX, focusY);
                }}
                className="w-24 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[28px]">{blurRadius}px</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Subject Radius:</span>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={focusSize}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFocusSize(val);
                  if (file) processImage(file, blurRadius, val, focusX, focusY);
                }}
                className="w-24 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[28px]">{Math.round(focusSize * 100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setPreviewOriginal(null);
                  setResultUrl(null);
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!resultBlob}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download Photo
            </Button>
          </div>
        </ToolToolbar>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer border-[rgb(var(--border))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--card-2))]/50 bg-[rgb(var(--card))] flex flex-col items-center justify-center gap-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
              <Aperture className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop photo to add portrait blur
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Simulate DSLR depth-of-field and smooth bokeh blur while keeping your subject crisp and sharp.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% private in-browser
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] text-xs font-semibold text-[rgb(var(--muted))]">
                ORIGINAL PHOTO
              </div>
              <div className="p-4 flex items-center justify-center min-h-[350px]">
                {previewOriginal && (
                  <img
                    src={previewOriginal}
                    alt="Original portrait"
                    className="max-h-[380px] max-w-full h-auto object-contain rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] text-xs font-semibold text-emerald-500">
                PORTRAIT BOKEH PREVIEW
              </div>
              <div className="p-4 flex items-center justify-center min-h-[350px]">
                {isProcessing ? (
                  <div className="text-xs text-[rgb(var(--muted))]">Applying depth of field...</div>
                ) : resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Portrait blur preview"
                    className="max-h-[380px] max-w-full h-auto object-contain rounded-lg shadow-md"
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
