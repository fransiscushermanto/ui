import { useCallback, useEffect, useState } from "react";
import { getElementBounds } from "../../../utils";

interface UseSelectCalculatePositionOptions {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function useSelectCalculatePosition(
  options: UseSelectCalculatePositionOptions,
) {
  const { triggerRef } = options;

  const [position, setPosition] =
    useState<ReturnType<typeof getElementBounds>>();

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (event.target === triggerRef.current) {
        const target = event.target as HTMLElement;
        const bounds = getElementBounds(target);
        console.log(bounds);
        setPosition(bounds);
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.ResizeObserver) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === triggerRef.current) {
          const bounds = getElementBounds(entry.target as HTMLElement);
          setPosition(bounds);
        }
      }
    });

    if (triggerRef.current) {
      resizeObserver.observe(triggerRef.current);
    }

    let frameID: number | null = null;

    function handleWindowResize() {
      if (!triggerRef.current) return;

      if (frameID) {
        cancelAnimationFrame(frameID);
      }

      frameID = requestAnimationFrame(() => {
        const bounds = getElementBounds(triggerRef.current as HTMLElement);
        setPosition(bounds);
      });
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      if (triggerRef.current) {
        resizeObserver.unobserve(triggerRef.current);
      }
    };
  }, []);

  return { position, onClick };
}
