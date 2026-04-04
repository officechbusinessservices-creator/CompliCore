import * as React from "react";
import { cn } from "@/lib/utils";

type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "value" | "onChange"> & {
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
};

export function Slider({ className, defaultValue, value, onValueChange, ...props }: SliderProps) {
  const controlled = Array.isArray(value);
  const [internal, setInternal] = React.useState<number[]>(defaultValue ?? [0]);
  const current = controlled ? value! : internal;
  return (
    <input
      type="range"
      value={current[0]}
      onChange={(event) => {
        const next = [Number(event.target.value)];
        if (!controlled) setInternal(next);
        onValueChange?.(next);
      }}
      className={cn("w-full accent-emerald-500", className)}
      {...props}
    />
  );
}
