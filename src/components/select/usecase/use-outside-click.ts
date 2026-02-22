import { useEffect, useRef } from "react";

export function useOutsideClick(
  ref:
    | React.RefObject<HTMLElement | null>[]
    | React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];

      const isOutside = refs.every((ref) => {
        const el = ref.current;
        return el && !el.contains(event.target as Node);
      });

      if (isOutside) {
        savedHandler.current(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}
