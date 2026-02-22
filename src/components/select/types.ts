import type { ReactNode } from "react";
import type { useSelectMultiValueTagProps } from "./usecase";

export interface HighlightedTextProps {
  node: React.ReactNode;
  query: string;
}

export type SelectOption<T extends unknown = unknown> = {
  value: string | number;
  label: ReactNode;
} & T;

export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export interface SelectRootProps<TOption = unknown>
  extends
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      "children" | "onChange" | "defaultValue"
    >,
    Required<React.PropsWithChildren> {
  name?: string;
  options: SelectOption<TOption>[];
  /**
   * @default false
   */
  multiple?: boolean;
  disabled?: boolean;
  /**
   * @default true
   */
  searchable?: boolean;
  /**
   * @default true
   */
  virtualized?: boolean;
  defaultValue?: string | number | Array<string | number>;
  value?: string | number | Array<string | number>;
  onChange?: (option: SelectOption<TOption>) => void;
}

export interface SelectTriggerProps extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {}

export interface SelectIconProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> {
  /**
   * @default 16
   */
  size?: number;
}

export interface SelectValueProps<
  TOption = unknown,
> extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  renderMultiValueTag?: (
    option: SelectOption<TOption>,
    props: ReturnType<typeof useSelectMultiValueTagProps>,
  ) => React.ReactNode;
  renderLabel?: (option: SelectOption<TOption>) => React.ReactNode;
  placeholder?: string;
}

export interface SelectDropdownProps<TOption = unknown> extends Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "children"
> {
  children: (option: SelectOption<TOption>) => React.ReactNode;
  /**
   * When you use virtualized, it's better to define the estimate size
   *
   * `height` for vertical scroll
   * `width` for horizontal scroll
   *
   * @default () => 40;
   *
   * @param index
   * @returns
   */
  estimateSize?: (index: number) => number;
  /**
   * This will determine how you item will be scrolled to when dropdown open
   *
   * @default center
   */
  scrollAlign?: "start" | "center" | "end";
}

export interface SelectItemProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  value: string | number;
}

export interface SelectPortalProps {
  container?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}
