import React from "react";
import { LuCircleX } from "react-icons/lu";

import { cx } from "../../utils";
import { runIfFn } from "../../utils/run-if-fn";
import { useSelectContext } from "./SelectProvider";
import type { SelectOption, SelectValueProps } from "./types";

function SelectValue<TOption = unknown>(props: SelectValueProps<TOption>) {
  const {
    className,
    placeholder,
    renderLabel,
    renderMultiValueTag,
    ...restProps
  } = props;

  const { multiple, selectedOptions, getValueProps, tagProps } =
    useSelectContext();

  return multiple ? (
    <div
      className={cx(
        "flex flex-1 items-center gap-1.5 py-1 flex-wrap",
        className,
      )}
      {...restProps}
    >
      {selectedOptions.length > 0 ? (
        selectedOptions.map(
          (option, i) =>
            runIfFn(
              renderMultiValueTag,
              option as SelectOption<TOption>,
              tagProps,
            ) ?? (
              <span
                data-value={option.value}
                data-index={i}
                className="flex flex-row items-center bg-gray-100 px-2 py-1 rounded-full gap-1.5 text-gray-600 whitespace-nowrap"
                {...tagProps.getTagRootProps()}
              >
                <span className="flex-1">{option.label}</span>
                <button
                  className="flex"
                  {...tagProps.getTagDeleteButtonProps({
                    onClick: () => tagProps.onDeleteValue(option),
                  })}
                >
                  <LuCircleX />
                </button>
              </span>
            ),
        )
      ) : (
        <span
          className="pointer-events-none text-gray-600 opacity-90"
          data-placeholder
        >
          {placeholder}
        </span>
      )}
    </div>
  ) : (
    <span
      className={cx(
        "flex flex-1 items-center h-full pointer-events-none data-placeholder:text-gray-600 data-placeholder:opacity-90",
        className,
      )}
      {...getValueProps({ placeholder, ...restProps })}
    >
      {selectedOptions[0]
        ? runIfFn(
            renderLabel ?? selectedOptions[0].label,
            selectedOptions[0] as SelectOption<TOption>,
          )
        : placeholder}
    </span>
  );
}

export default React.memo(SelectValue) as typeof SelectValue;
