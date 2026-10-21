"use client";

import React from "react";
import { ImageConverterTool } from "./image-converter";

export function HeicToJpgTool() {
  return (
    <ImageConverterTool
      defaultTargetFormat="image/jpeg"
      fixedTargetName="JPG"
      toolTitle="Convert iPhone HEIC / HEIF Photos to JPG"
    />
  );
}
