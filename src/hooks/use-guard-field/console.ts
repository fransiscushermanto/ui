export function initialGuardControlledField(
  name: string,
  value?: unknown,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: Function,
  errorMessage?: string,
) {
  if (typeof value !== "undefined") {
    if (typeof onChange === "undefined") {
      console.error(`Warning [name: ${name}]:
      ${
        errorMessage ??
        "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
      }
      `);
    }

    return true;
  }

  return false;
}

export function guardControlledFieldChange(
  name: string,
  prevValue?: unknown,
  value?: unknown,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: Function,
  errorMessage?: string,
) {
  if (
    typeof prevValue === "undefined" &&
    typeof value !== "undefined" &&
    typeof onChange !== "undefined"
  ) {
    console.error(
      `Warning [name: ${name}]: ${
        errorMessage ??
        "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component."
      }`,
    );
  }
}
