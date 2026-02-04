import * as React from "react";
import { cn } from "@/lib/utils";

type SelectContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

export function Select<T extends string>({ value, defaultValue, onValueChange, children }: {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next as T);
  };

  return <SelectContext.Provider value={{ value: current, setValue }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm", className)}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext);
  return <span className="text-zinc-200">{ctx?.value || placeholder}</span>;
}

export function SelectContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-2 rounded-md border border-zinc-700 bg-zinc-900 p-1", className)}>{children}</div>;
}

export function SelectItem({ value, className, children }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(SelectContext);
  return (
    <div
      onClick={() => ctx?.setValue(value)}
      className={cn("cursor-pointer rounded px-2 py-1 text-sm text-zinc-200 hover:bg-zinc-800", className)}
    >
      {children}
    </div>
  );
}
