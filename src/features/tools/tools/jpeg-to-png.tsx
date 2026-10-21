"use client";

import React from "react";
import { ImageConverterTool } from "./image-converter";

export function JpegToPngTool() {
  return (
    <ImageConverterTool
      defaultTargetFormat="image/png"
      fixedTargetName="PNG"
      toolTitle="Convert JPEG / JPG Images to Lossless PNG"
    />
  );
}
