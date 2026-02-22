import { cx } from "../../utils/cx";
import { useSelectContext } from "./SelectProvider";

import type { SelectTriggerProps } from "./types";

const SelectTrigger = (props: SelectTriggerProps) => {
  const { className, ...restProps } = props;

  const { getTriggerProps } = useSelectContext();

  return (
    <button
      className={cx(
        `
          cursor-pointer
          flex 
          items-center 
          w-full 
          h-select-height 
          px-2.5 
          gap-2.5 
          [border:1px_solid_theme(colors.gray.200)] 
          rounded-sm text-sm 
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          hover:not-disabled:border-blue-300
           data-focus:not-disabled:border-blue-300
           data-multiple:h-auto
           data-multiple:min-h-select-height
        `,
        className,
      )}
      {...getTriggerProps(restProps)}
    />
  );
};

export default SelectTrigger;
