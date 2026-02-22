import isFunction from "./is-fn";

export function runIfFn<T, U extends any[]>(
  valueOrFn: T | ((...fnArgs: U) => T),
  ...args: U
): T {
  return isFunction(valueOrFn)
    ? (valueOrFn as (...fnArgs: U) => T)(...args)
    : (valueOrFn as T);
}
