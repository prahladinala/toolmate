"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>

      <p className="mt-4 text-sm text-[rgb(var(--muted))]">
        Don’t worry. Try again or return home.
      </p>

      <div className="mt-6 flex gap-4">
        <Button onClick={() => reset()}>Retry</Button>
      </div>
    </main>
  );
}
