import { useEffect } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";

import { getElementBounds } from "../../../utils";
import type { SelectDropdownProps, SelectOption } from "../types";

interface UseSelectDropdownScrollPositionOptions extends Pick<
  Virtualizer<HTMLDivElement, Element>,
  "scrollToIndex"
> {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  virtualized: boolean;
  selectedOptions: SelectOption[];
  selectOptions: SelectOption[];
  scrollAlign: NonNullable<SelectDropdownProps["scrollAlign"]>;
}

export function useSelectDropdownScrollPosition(
  options: UseSelectDropdownScrollPositionOptions,
) {
  const {
    containerRef,
    isOpen,
    virtualized,
    selectOptions,
    selectedOptions,
    scrollToIndex,
    scrollAlign,
  } = options;

  // virtualized scrolling
  useEffect(() => {
    if (!virtualized || !isOpen) return;

    const frameId = requestAnimationFrame(() => {
      let smallestIndex = Infinity;
      for (const option of selectedOptions) {
        smallestIndex = Math.min(
          smallestIndex,
          selectOptions.findIndex((o) => o.value === option.value),
        );
      }

      if (smallestIndex === -1 || smallestIndex === Infinity) {
        scrollToIndex(0);
        return;
      }

      scrollToIndex(smallestIndex, {
        align: scrollAlign,
        behavior: "auto",
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [virtualized, isOpen, scrollAlign]);

  useEffect(() => {
    if (virtualized || !isOpen) return;

    // ensure the container is already painted and get the element
    const frameId = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const selectedItem =
        containerRef.current.querySelector("[data-selected]");

      if (!selectedItem) return;

      const selectedElem = selectedItem as HTMLElement;

      const bounds = getElementBounds(selectedElem);

      const positionValue = {
        start: selectedElem.offsetTop,
        center:
          selectedElem.offsetTop -
          containerRef.current.clientHeight / 2 +
          bounds.height / 2,
        end:
          selectedElem.offsetTop -
          containerRef.current.clientHeight +
          bounds.height,
      };

      containerRef.current.scrollTop = positionValue[scrollAlign];
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isOpen, scrollAlign]);
}
