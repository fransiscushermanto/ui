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

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === triggerRef.current) {
        const bounds = getElementBounds(entry.target as HTMLElement);
        setPosition(bounds);
      }
    }
  });

  useEffect(() => {
    if (triggerRef.current) {
      resizeObserver.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        resizeObserver.unobserve(triggerRef.current);
      }
    };
  }, []);

  return { position, onClick };
}
