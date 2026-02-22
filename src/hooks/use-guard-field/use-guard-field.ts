import { useCallback, useEffect, useRef, useState } from "react";
import {
  guardControlledFieldChange,
  initialGuardControlledField,
} from "./console";

interface UseGuardFieldOptions {
  name: string;
  value?: unknown;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: Function;
  initialErrorMessage?: string;
  onChangErrorMessage?: string;
}

export function useGuardField(options: UseGuardFieldOptions) {
  const { value, onChange, initialErrorMessage, onChangErrorMessage, name } =
    options;

  const [isControlled, setIsControlled] = useState(false);

  const prevValueRef = useRef(value);

  const onGuardFieldChange = useCallback(
    (
      value?: unknown,
      // eslint-disable-next-line @typescript-eslint/ban-types
      onChange?: Function | undefined,
      errorMessage?: string | undefined,
    ) => {
      if (prevValueRef.current === value) return false;

      guardControlledFieldChange(
        name,
        prevValueRef.current,
        value,
        onChange,
        errorMessage ?? onChangErrorMessage,
      );
    },
    [name, onChangErrorMessage],
  );

  useEffect(() => {
    if (
      initialGuardControlledField(name, value, onChange, initialErrorMessage)
    ) {
      setIsControlled(true);
    }
  }, []);

  return { isControlled, onGuardFieldChange };
}
