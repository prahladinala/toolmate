"use client";

import React from "react";
import { ImageConverterTool } from "./image-converter";

export function JpegToWebpTool() {
  return (
    <ImageConverterTool
      defaultTargetFormat="image/webp"
      fixedTargetName="WebP"
      toolTitle="Convert JPEG / JPG Images to Modern WebP"
    />
  );
}
