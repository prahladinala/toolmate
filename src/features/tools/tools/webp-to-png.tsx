"use client";

import React from "react";
import { ImageConverterTool } from "./image-converter";

export function WebpToPngTool() {
  return (
    <ImageConverterTool
      defaultTargetFormat="image/png"
      fixedTargetName="PNG"
      toolTitle="Convert WebP Images to Lossless PNG"
    />
  );
}
