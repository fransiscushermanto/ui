import { useMemo, useEffect, useRef } from "react";

export function useCallbackRef<T extends ((...args: any[]) => any) | undefined>(
  callback: T,
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(() => {
    if (!callback) return undefined as T;
    return ((...args: Parameters<NonNullable<T>>) =>
      callbackRef.current?.(...args)) as unknown as T;
  }, [!!callback]);
}
