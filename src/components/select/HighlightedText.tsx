import React, { cloneElement } from "react";

import { highlightText } from "./utils";
import type { HighlightedTextProps } from "./types";

const HighlightedText = React.memo((props: HighlightedTextProps) => {
  const { node, query } = props;

  if (typeof node === "string" || typeof node === "number") {
    const result = highlightText(String(node), query);
    if (Array.isArray(result)) {
      return <span>{result}</span>;
    }
    return result;
  }

  if (Array.isArray(node)) {
    return React.Children.map(node, (child) => (
      <HighlightedText node={child} query={query} />
    ));
  }

  if (React.isValidElement(node)) {
    const children = React.Children.map(
      (node.props as React.PropsWithChildren).children,
      (child) => <HighlightedText node={child} query={query} />,
    );

    return cloneElement<any>(node, {
      ...(node.props as Record<string, any>),
      children,
    });
  }

  return node;
});

export default HighlightedText;
