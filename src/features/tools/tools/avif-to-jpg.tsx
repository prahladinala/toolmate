"use client";

import React from "react";
import { ImageConverterTool } from "./image-converter";

export function AvifToJpgTool() {
  return (
    <ImageConverterTool
      defaultTargetFormat="image/jpeg"
      fixedTargetName="JPG"
      toolTitle="Convert AVIF Images to Standard JPG"
    />
  );
}
