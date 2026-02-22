import { createPortal } from "react-dom";

import type { SelectPortalProps } from "./types";

const SelectPortal = (props: SelectPortalProps) => {
  const { children, container } = props;
  return createPortal(children, container?.current ?? document.body);
};

export default SelectPortal;
