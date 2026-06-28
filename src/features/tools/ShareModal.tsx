"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  toolSlug: string;
  shortDescription: string;
}

export function ShareModal({ isOpen, onClose, toolName, toolSlug, shortDescription }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shareUrl = `https://toolmate.co.in/tools/${toolSlug}`;
  const shareText = `Check out ${toolName} on ToolMate: ${shortDescription}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: "hover:bg-neutral-800 hover:text-white dark:hover:bg-white dark:hover:text-black",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#0077b5] hover:text-white",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#1877f2] hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.031 2C6.495 2 2 6.496 2 12.032c0 1.834.484 3.593 1.405 5.143L2 22l4.981-1.306A9.972 9.972 0 0012.031 22c5.535 0 10.032-4.496 10.032-10.032C22.063 6.496 17.566 2 12.031 2zM12.031 20.31a8.315 8.315 0 01-4.25-1.166l-.304-.18-3.155.827.842-3.076-.197-.315A8.28 8.28 0 013.722 12.03c0-4.593 3.738-8.331 8.309-8.331 4.57 0 8.308 3.738 8.308 8.331 0 4.593-3.738 8.331-8.308 8.331zm4.568-6.223c-.25-.125-1.482-.733-1.713-.817-.23-.083-.4-.125-.568.125-.167.25-.65 .816-.798.983-.15.166-.3.187-.55.062-1.107-.55-2.29-1.282-3.185-2.583-.124-.181-.013-.28.112-.404.113-.112.25-.292.375-.438.125-.145.167-.25.25-.416.083-.167.042-.313-.021-.438-.063-.125-.568-1.375-.778-1.883-.205-.494-.41-.427-.568-.435l-.485-.008c-.167 0-.437.062-.667.313-.229.25-.875.854-.875 2.083 0 1.23.896 2.417 1.021 2.583.125.167 1.763 2.692 4.27 3.77.596.255 1.061.408 1.425.522.597.189 1.14.162 1.57.098.483-.07 1.482-.605 1.691-1.19.208-.584.208-1.084.146-1.19-.062-.105-.229-.167-.479-.292z" clipRule="evenodd" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "hover:bg-[#25D366] hover:text-white",
    },
    {
      name: "Reddit",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 11.5c0-1.38-1.12-2.5-2.5-2.5-.66 0-1.26.26-1.71.68-.45-.42-1.05-.68-1.71-.68C14.7 9 13.58 10.12 13.58 11.5c0 1.38 1.12 2.5 2.5 2.5.66 0 1.26-.26 1.71-.68.45.42 1.05.68 1.71.68 1.38 0 2.5-1.12 2.5-2.5zM12 2.5c-1.38 0-2.5 1.12-2.5 2.5 0 .66.26 1.26.68 1.71-.42.45-.68 1.05-.68 1.71C9.5 9.8 10.62 10.92 12 10.92c1.38 0 2.5-1.12 2.5-2.5 0-.66-.26-1.26-.68-1.71.42-.45.68-1.05.68-1.71 0-1.38-1.12-2.5-2.5-2.5zM12 13c-3.86 0-7 2.02-7 4.5S8.14 22 12 22s7-2.02 7-4.5S15.86 13 12 13zm-2.5 6.5c-1.38 0-2.5-1.12-2.5-2.5 0-.66.26-1.26.68-1.71-.42.45-.68 1.05-.68 1.71 0 1.38 1.12 2.5 2.5 2.5.66 0 1.26-.26 1.71-.68.42.45.68 1.05.68 1.71 0 1.38-1.12 2.5-2.5 2.5z" />
          <path fillRule="evenodd" d="M12 0A12 12 0 1024 12 12.013 12.013 0 0012 0zm5.176 17.584c-1.144 1.144-3.136 1.568-5.176 1.568s-4.032-.424-5.176-1.568A2.69 2.69 0 015.816 15.6c0-1.8 1.736-3.136 3.864-3.528A6.38 6.38 0 019 10.56a2.446 2.446 0 01-1.08-.24c-.752-.408-1.224-1.192-1.224-2.064C6.696 6.448 8.16 5 9.984 5c1.432 0 2.672.936 3.12 2.272A5.3 5.3 0 0115.536 7a2.535 2.535 0 011.088-.24c1.824 0 3.288 1.448 3.288 3.256 0 .888-.472 1.688-1.224 2.104A6.452 6.452 0 0118 13.624c2.144.384 3.88 1.728 3.88 3.528a2.68 2.68 0 01-1.008 2.016l.304-.152z" clipRule="evenodd" />
        </svg>
      ),
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(toolName)}`,
      color: "hover:bg-[#ff4500] hover:text-white",
    },
  ];

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight">Share {toolName}</h2>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-[rgb(var(--muted))] hover:bg-[rgb(var(--card-2))] hover:text-[rgb(var(--fg))] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-[rgb(var(--fg))]">Copy link</label>
                <div className="flex w-full items-center gap-2 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] p-1">
                  <div className="flex-1 truncate px-3 py-1.5 text-sm font-mono text-[rgb(var(--muted))] select-all">
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-[rgb(var(--accent))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-3 block text-sm font-medium text-[rgb(var(--fg))]">Share via</label>
                <div className="grid grid-cols-5 gap-3">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] transition-colors ${link.color}`}
                      title={`Share on ${link.name}`}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
