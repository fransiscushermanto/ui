import { useCallback } from "react";

import { callAllFn, cx } from "../../../utils";
import type { PropGetter } from "../../react.types";
import type { SelectOption } from "../types";

interface UseSelectMultiValueTagPropsOptions {
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  setValue: React.Dispatch<
    React.SetStateAction<string | number | (string | number)[] | undefined>
  >;
}

export function useSelectMultiValueTagProps(
  options: UseSelectMultiValueTagPropsOptions,
) {
  const { setSelectedOptions, setValue } = options;

  const onDeleteValue = useCallback((option: SelectOption) => {
    setSelectedOptions((prev) => prev.filter((o) => o.value !== option.value));

    setValue((prev) =>
      Array.isArray(prev)
        ? prev.filter((v) => v !== option.value)
        : option.value,
    );
  }, []);

  const getTagRootProps = useCallback<
    PropGetter<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >
    >
  >((props = {}) => {
    const { onClick, ...restProps } = props;

    return {
      ...restProps,
      onClick: callAllFn((e) => e.stopPropagation(), onClick),
    };
  }, []);

  const getTagDeleteButtonProps = useCallback<
    PropGetter<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >
    >
  >((props = {}) => {
    const { onClick, className, ...restProps } = props;

    return {
      ...restProps,
      className: cx("cursor-pointer", className),
      onClick: callAllFn((e) => e.stopPropagation(), onClick),
    };
  }, []);

  return { getTagRootProps, getTagDeleteButtonProps, onDeleteValue };
}
