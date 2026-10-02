"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string | (() => string) | (() => Promise<string>);
  text?: React.ReactNode;
  copiedText?: React.ReactNode;
  toastMessage?: string;
  timeout?: number;
  iconOnly?: boolean;
  variant?: Variant;
  size?: Size;
}

export function CopyButton({
  value,
  text = "Copy",
  copiedText = "Copied!",
  toastMessage = "Copied to clipboard!",
  timeout = 2000,
  iconOnly = false,
  className,
  variant = "primary",
  size = "md",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copied) return;
    try {
      const val = typeof value === "function" ? await value() : value;
      if (!val) return;
      await navigator.clipboard.writeText(val);
      setCopied(true);
      toast.success(toastMessage);
      setTimeout(() => setCopied(false), timeout);
    } catch (e) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleCopy} 
      className={cn(copied && "text-emerald-500", className)} 
      {...props}
    >
      {copied ? <Check className={iconOnly ? "" : "h-4 w-4"} /> : <Copy className={iconOnly ? "" : "h-4 w-4"} />}
      {!iconOnly && (copied ? copiedText : text)}
    </Button>
  );
}
