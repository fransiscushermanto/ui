import type { ForwardedRef, RefObject } from "react";

import isFn from "./is-fn";

type RefCb<T> = (instance: T | null) => void;
type Ref<T> = RefCb<T> | RefObject<T>;

export const mergeRefs = <T = unknown>(...refs: ForwardedRef<T>[]) => {
  const filteredRefs = refs.filter(Boolean) as Ref<T>[];

  return (inst: T) =>
    filteredRefs.forEach((ref) =>
      isFn(ref) ? ref(inst) : (ref.current = inst),
    );
};
