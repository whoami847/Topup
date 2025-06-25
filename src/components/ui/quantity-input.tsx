"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityInput({ value, onChange, min = 1, max = 99, className, ...props }: QuantityInputProps) {
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseInt(e.target.value, 10);
      if (isNaN(num)) {
          onChange(min);
      } else {
          onChange(Math.max(min, Math.min(max, num)));
      }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="outline" size="icon" type="button" onClick={handleDecrement} className="h-10 w-10 shrink-0">
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="w-16 text-center"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        {...props}
      />
      <Button variant="outline" size="icon" type="button" onClick={handleIncrement} className="h-10 w-10 shrink-0">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
