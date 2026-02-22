import { LuChevronDown } from "react-icons/lu";

import { cx } from "../../utils/cx";
import type { SelectIconProps } from "./types";

const SelectIcon = (props: SelectIconProps) => {
  const { children, size = 16, style, className, ...restProps } = props;

  return (
    <span
      className={cx("flex", className)}
      style={{
        ...style,

        width: size,
        height: size,
      }}
      {...restProps}
    >
      {children ?? <LuChevronDown />}
    </span>
  );
};

export default SelectIcon;
