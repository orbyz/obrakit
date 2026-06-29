import type { ComponentPropsWithoutRef } from "react";

type LabelProps = ComponentPropsWithoutRef<"label">;

export function Label({ children, ...props }: LabelProps) {
  return <label {...props}>{children}</label>;
}
