import React, { useEffect, useMemo, useRef } from "react";
import { LuSearch } from "react-icons/lu";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cx } from "../../utils";
import { useCallbackRef } from "../../hooks";
import HighlightedText from "./HighlightedText";
import { useSelectContext } from "./SelectProvider";
import { filterOption } from "./utils";
import { useSelectDropdownScrollPosition } from "./usecase";
import type { SelectDropdownProps, SelectOption } from "./types";

function SelectDropdown<TOption = unknown>(
  props: SelectDropdownProps<TOption>,
) {
  const {
    children,
    className,
    estimateSize: estimateSizeProp = () => 40,
    scrollAlign = "center",
    ...restProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const estimateSize = useCallbackRef(estimateSizeProp);

  const {
    isOpen,
    getDropdownProps,
    getSearchInputProps,
    query,
    searchable,
    options,
    virtualized,
    selectedOptions,
  } = useSelectContext();

  const filteredOptions = useMemo(
    () => options.filter((option) => filterOption(option, query)),
    [options, query],
  );

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => containerRef.current,
    estimateSize,
    enabled: virtualized,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useSelectDropdownScrollPosition({
    isOpen,
    containerRef,
    virtualized,
    selectedOptions,
    scrollToIndex: virtualizer.scrollToIndex,
    selectOptions: options,
    scrollAlign,
  });

  useEffect(() => {
    if (isOpen) {
      virtualizer.measure();
    }
  }, [isOpen, estimateSize]);

  return (
    isOpen && (
      <div
        className={cx(
          "w-full mt-1 rounded-md overflow-hidden shadow-md bg-white [border:1px_solid_theme(colors.gray.200)] z-select-dropdown",
          className,
        )}
        {...getDropdownProps(restProps)}
      >
        {searchable && (
          <div className="flex px-2 py-1 gap-1 [border-bottom:1px_solid_theme(colors.gray.200)]">
            <span className="flex items-center justify-center w-[30px] h-[30px]">
              <LuSearch className="stroke-gray-400" />
            </span>
            <input
              name="search"
              className="flex-1 focus:outline-0"
              {...getSearchInputProps()}
            />
          </div>
        )}
        <div
          ref={containerRef}
          className="max-h-select-dropdown-max-height overflow-y-auto"
          {...(virtualized && {
            style: {
              height: "var(--spacing-dropdown-max-height)",
              width: "100%",
            },
          })}
        >
          {virtualized ? (
            <div
              className="w-full relative"
              style={{ height: virtualizer.getTotalSize() }}
            >
              <div
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                }}
              >
                {virtualItems.map((vi) => (
                  <div
                    key={vi.key}
                    ref={virtualizer.measureElement}
                    data-index={vi.index}
                  >
                    {children({
                      ...filteredOptions[vi.index],
                      label: (
                        <HighlightedText
                          node={filteredOptions[vi.index].label}
                          query={query}
                        />
                      ),
                    } as SelectOption<TOption>)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            filteredOptions.map((option) =>
              children({
                ...option,
                label: <HighlightedText node={option.label} query={query} />,
              } as SelectOption<TOption>),
            )
          )}
        </div>
      </div>
    )
  );
}

export default React.memo(SelectDropdown) as typeof SelectDropdown;
