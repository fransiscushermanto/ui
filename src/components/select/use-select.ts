import React, {
  useCallback,
  useState,
  useRef,
  useDeferredValue,
  useEffect,
} from "react";

import { useCallbackRef, useGuardField } from "../../hooks";
import { callAllFn, mergeRefs, omit, isTrullyEmpty } from "../../utils";
import type { PropGetter } from "../react.types";
import { getDefaultValue } from "./utils";
import {
  useOutsideClick,
  useSelectCalculatePosition,
  useSelectMultiValueTagProps,
  useSelectSyncValue,
} from "./usecase";
import type {
  SelectDropdownProps,
  SelectItemProps,
  SelectOption,
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
} from "./types";

export type UseSelectReturn = ReturnType<typeof useSelect>;

interface UseSelectOptions
  extends
    Required<
      Pick<SelectRootProps, "multiple" | "disabled" | "options" | "searchable">
    >,
    Partial<
      Pick<SelectRootProps, "value" | "defaultValue" | "onChange" | "name">
    > {}

export function useSelect(options: UseSelectOptions) {
  const {
    multiple,
    disabled,
    options: rootOptions,
    searchable,
    value: valueProp,
    onChange: onChangeProp,
    defaultValue,
    name,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<typeof valueProp>(() =>
    getDefaultValue({ defaultValue, value: valueProp, multiple }),
  );
  const [selectedOptions, setSelectedOptions] = useState<Array<SelectOption>>(
    rootOptions.filter(
      (option) =>
        option.value ===
        (isTrullyEmpty(defaultValue) ? valueProp : defaultValue),
    ),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const query = useDeferredValue(searchQuery);

  const onChange = useCallbackRef(onChangeProp);

  const prevMultipleRef = useRef(multiple);
  const prevSearchableRef = useRef(searchable);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isControlled, onGuardFieldChange } = useGuardField({
    name: name ?? "select",
    onChange: onChangeProp,
    value: valueProp,
  });

  const { position, onClick: onClickGetTriggerPosition } =
    useSelectCalculatePosition({ triggerRef });

  const tagProps = useSelectMultiValueTagProps({
    setSelectedOptions,
    setValue,
  });

  const onResetSelectValue = useCallback(() => {
    setSearchQuery("");
    setValue(undefined);
    setSelectedOptions([]);
    setIsOpen(false);
  }, []);

  const onClickTrigger = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const onClickItem = useCallback(
    (newValue: SelectOption["value"]) => {
      const newSelectedOption = rootOptions.find(
        (option) => option.value === newValue,
      );
      const isPrevSelected = selectedOptions.some(
        (sOption) => sOption.value === newValue,
      );

      if (!newSelectedOption) return;

      if (isControlled) {
        onChange?.(newSelectedOption);
      } else {
        onGuardFieldChange(newValue, onChange);

        setSelectedOptions((prev) => {
          if (multiple) {
            if (isPrevSelected) {
              return prev.filter((option) => option.value !== newValue);
            }

            return [...prev, newSelectedOption];
          }

          return [newSelectedOption];
        });

        setValue((prev) => {
          if (multiple) {
            if (Array.isArray(prev)) {
              if (isPrevSelected) {
                return prev.filter((v) => v !== newValue);
              }

              return [...prev, newValue];
            }
            return [newValue];
          }

          return newValue;
        });
      }

      if (!multiple) {
        setIsOpen(false);
      }
    },
    [rootOptions, multiple, selectedOptions, isControlled],
  );

  const onSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement, Element>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const getRootProps = useCallback<
    PropGetter<Omit<SelectRootProps, "children" | keyof UseSelectOptions>>
  >(
    (props = {}) => {
      return {
        ...props,
        "data-value": value,
        ...(isOpen && { "data-focus": "" }),
        ...(disabled && { "data-disabled": "" }),
      };
    },
    [value, isOpen, disabled],
  );

  const getValueProps = useCallback<PropGetter<SelectValueProps>>(
    (props = {}) => {
      const { placeholder, ...restProps } = props;

      return {
        ...(isTrullyEmpty(value) &&
          !!placeholder && { "data-placeholder": "" }),
        ...restProps,
      };
    },
    [value],
  );

  const getTriggerProps = useCallback<PropGetter<SelectTriggerProps>>(
    (props = {}) => {
      const { ref = null, ...restProps } = props;
      return {
        ...restProps,
        ref: mergeRefs(triggerRef, ref),
        ...(isOpen && { "data-focus": "" }),
        onClick: callAllFn(
          onClickGetTriggerPosition,
          onClickTrigger,
          props.onClick,
        ),
        ...(multiple && { "data-multiple": "" }),
        disabled: props.disabled ?? disabled,
      };
    },
    [onClickGetTriggerPosition, onClickTrigger, disabled, isOpen, multiple],
  );

  const getDropdownProps = useCallback<
    PropGetter<Omit<SelectDropdownProps, "children">>
  >(
    (props = {}) => {
      const { style, ref = null, ...restProps } = props;

      return {
        ref: mergeRefs(dropdownRef, ref),
        style: {
          ...style,
          position: "absolute",
          ...(position && {
            width: position.width,
            top: `calc(${position.top} + var(--spacing-select-height))`,
            left: position.left,
          }),
        },
        ...restProps,
      };
    },
    [position],
  );

  const getItemProps = useCallback<PropGetter<Partial<SelectItemProps>>>(
    (props = {}) => {
      const { onClick, ...restProps } = props;

      let isSelected = false;
      if (multiple && Array.isArray(value)) {
        isSelected = value.some((v) => v === props.value);
      } else {
        isSelected = props.value === value;
      }

      return {
        ...omit(restProps, ["value"]),
        tabIndex: 0,
        "data-value": props.value,
        ...(isSelected && { "data-selected": "" }),
        onClick: callAllFn(() => onClickItem(props.value ?? ""), onClick),
      };
    },
    [value, multiple, onClickItem],
  );

  const getSearchInputProps = useCallback<
    PropGetter<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >
    >
  >((props = {}) => {
    const { onChange, ref = null, ...restProps } = props;

    return {
      ref: mergeRefs(searchInputRef, ref),
      onChange: callAllFn(onSearchInputChange, onChange),
      ...restProps,
    };
  }, []);

  useOutsideClick([triggerRef, dropdownRef], () => {
    if (isOpen) setIsOpen(false);
    if (document.activeElement === triggerRef.current) {
      triggerRef.current?.blur();
    }
  });

  useSelectSyncValue({
    enabled: isControlled,
    setValue,
    value,
    outsourcedValue: valueProp,
    options: rootOptions,
    setSelectedOptions,
  });

  useEffect(() => {
    if (multiple != prevMultipleRef.current) {
      prevMultipleRef.current = multiple;
      onResetSelectValue();
    }
  }, [onResetSelectValue, multiple]);

  useEffect(() => {
    if (!isOpen) {
      // clear search query when blur
      setSearchQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchable != prevSearchableRef.current) {
      if (isOpen && prevSearchableRef.current != searchable) {
        setIsOpen(false);
      }
      prevSearchableRef.current = searchable;
    }

    if (isOpen && searchable) {
      // ensure search input is already painted
      const frameId = requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [isOpen, searchable]);

  return {
    isOpen,
    value,
    multiple,
    disabled,
    options: rootOptions,
    selectedOptions,
    query,
    searchable,
    getTriggerProps,
    getValueProps,
    getRootProps,
    getDropdownProps,
    getItemProps,
    getSearchInputProps,
    tagProps,
  };
}
