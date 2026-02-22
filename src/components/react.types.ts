type DataAttributes = {
  [dataAttr: string]: any;
};

export interface DOMElement extends Element, HTMLOrSVGElement {}

export type DOMAttributes<T = DOMElement> = React.AriaAttributes &
  React.DOMAttributes<T> &
  DataAttributes & {
    id?: string;
    role?: React.AriaRole;
    tabIndex?: number;
    style?: React.CSSProperties;
  };

type Merge<M, N> = N extends Record<string, unknown> ? Omit<M, keyof N> & N : M;

export type PropGetter<P = DOMAttributes, R = DOMAttributes> = (
  props?: P & Merge<DOMAttributes, P>,
  ref?: React.Ref<any>,
) => R & P & React.RefAttributes<any>;

export type RequiredPropGetter<P = DOMAttributes, R = DOMAttributes> = (
  props: P & Merge<DOMAttributes, P>,
  ref?: React.Ref<any>,
) => R & P & React.RefAttributes<any>;
