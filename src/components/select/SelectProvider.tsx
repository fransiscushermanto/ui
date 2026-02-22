import { createContext } from "../../utils/context";

import type { SelectRootProps } from "./types";
import type { UseSelectReturn } from "./use-select";

interface SelectContextProps
  extends
    Required<Pick<SelectRootProps, "searchable" | "virtualized">>,
    Omit<UseSelectReturn, "getRootProps"> {}

const [SelectProvider, useSelectContext] = createContext<SelectContextProps>({
  strict: true,
  name: "SelectContext",
});

// eslint-disable-next-line react-refresh/only-export-components
export { SelectProvider, useSelectContext };
