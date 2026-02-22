import { cx } from "../../utils";
import { useSelectContext } from "./SelectProvider";
import type { SelectItemProps } from "./types";

const SelectItem = (props: SelectItemProps) => {
  const { className, ...restProps } = props;

  const { getItemProps } = useSelectContext();

  return (
    <div
      className={cx(
        "cursor-pointer w-full flex px-4 py-2.5 text-sm hover:bg-teal-50 data-selected:bg-teal-50",
        className,
      )}
      {...getItemProps(restProps)}
    />
  );
};

export default SelectItem;
