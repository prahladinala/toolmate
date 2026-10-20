"use client";

import React, { useState, useEffect } from "react";

const WORDS = [
  "Developer Arsenal",
  "Frontend Utilities",
  "Backend Swiss Knife",
  "Design Sandbox"
];

export function Typewriter() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[index];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length <= 1) {
          setIsDeleting(false);
          setIndex((index + 1) % WORDS.length);
        }
      }, 30);
    } else {
      if (text === currentWord) {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, 70);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  return (
    <>
      {text || WORDS[0]}
      <span className="inline-block w-[3px] h-[0.9em] bg-indigo-500 ml-1 align-middle animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-sm relative -top-[2px]"></span>
    </>
  );
}
