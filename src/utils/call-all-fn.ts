export const callAllFn = <T extends (...args: any[]) => any>(
  ...fns: (T | undefined)[]
): ((...args: Parameters<T>) => void) => {
  return (...args: Parameters<T>) => {
    fns.forEach((fn) => {
      if (typeof fn === "function") {
        fn(...args);
      }
    });
  };
};
