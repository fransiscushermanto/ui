import { useEffect } from "react";
import type { SelectRootProps } from "../types";

interface UseSelectSyncValueOptions {
  outsourcedValue: SelectRootProps["value"];
  value: SelectRootProps["value"];
  setValue: React.Dispatch<React.SetStateAction<SelectRootProps["value"]>>;
  options: SelectRootProps["options"];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<SelectRootProps["options"]>
  >;
  enabled: boolean;
}

export function useSelectSyncValue(options: UseSelectSyncValueOptions) {
  const {
    outsourcedValue,
    value,
    setValue,
    enabled,
    options: selectOptions,
    setSelectedOptions,
  } = options;

  useEffect(() => {
    if (!enabled) return;
    if (outsourcedValue !== value) {
      setSelectedOptions(() =>
        selectOptions.filter((opt) =>
          Array.isArray(outsourcedValue)
            ? outsourcedValue.some((v) => opt.value === v)
            : opt.value === outsourcedValue,
        ),
      );
      setValue(outsourcedValue);
    }
  }, [enabled, value, outsourcedValue, selectOptions, setSelectedOptions]);
}
