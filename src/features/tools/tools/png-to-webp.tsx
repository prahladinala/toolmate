"use client";

import React from "react";
import { ImageConverterTool } from "./image-converter";

export function PngToWebpTool() {
  return (
    <ImageConverterTool
      defaultTargetFormat="image/webp"
      fixedTargetName="WebP"
      toolTitle="Convert PNG Images to WebP (Save up to 80% size)"
    />
  );
}
