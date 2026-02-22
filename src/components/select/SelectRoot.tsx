import { cx } from "../../utils";
import { SelectProvider } from "./SelectProvider";
import { useSelect } from "./use-select";
import type { SelectRootProps } from "./types";

const SelectRoot = (props: SelectRootProps) => {
  const {
    children,
    disabled = false,
    multiple = false,
    className,
    options,
    searchable = true,
    virtualized = true,
    onChange,
    value,
    defaultValue,
    ...restProps
  } = props;

  const { getRootProps, ...restSelectProps } = useSelect({
    multiple,
    disabled,
    options,
    searchable,
    onChange,
    value,
    defaultValue,
  });

  return (
    <SelectProvider value={{ virtualized, ...restSelectProps }}>
      <div className={cx("select", className)} {...getRootProps(restProps)}>
        {children}
      </div>
    </SelectProvider>
  );
};

export default SelectRoot;
