"use client";

import React from "react";
import { safeStorage } from "@/lib/storage/safe-storage";

type Persisted<T> = {
  value: T;
  setValue: (v: T) => void;
  clear: () => void;
};

export function usePersistedState<T>(key: string, initial: T): Persisted<T> {
  const [value, setValueState] = React.useState<T>(initial);

  React.useEffect(() => {
    const raw = safeStorage.get(key);
    if (!raw) return;
    try {
      setValueState(JSON.parse(raw) as T);
    } catch {}
  }, [key]);

  const setValue = (v: T) => {
    setValueState(v);
    safeStorage.set(key, JSON.stringify(v));
  };

  const clear = () => {
    setValueState(initial);
    safeStorage.remove(key);
  };

  return { value, setValue, clear };
}
