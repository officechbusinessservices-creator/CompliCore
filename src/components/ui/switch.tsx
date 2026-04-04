import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export function Switch({ checked, defaultChecked, onCheckedChange, onClick, className }: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const isControlled = typeof checked === "boolean";
  const value = isControlled ? checked : internal;

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        const next = !value;
        if (!isControlled) setInternal(next);
        onCheckedChange?.(next);
      }}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        value ? "bg-emerald-500" : "bg-zinc-600",
        className
      )}
      aria-pressed={value}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          value ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}
