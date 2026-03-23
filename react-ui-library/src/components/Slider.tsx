"use client";

import { ChangeEvent, useEffect, useId, useMemo, useState } from "react";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  onChange,
  label,
  showValue = true,
  disabled = false,
  className = "",
}: SliderProps) {
  const inputId = useId();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(() => {
    if (isControlled && value !== undefined) {
      setInternalValue(value);
    }
  }, [isControlled, value]);

  const currentValue = isControlled && value !== undefined ? value : internalValue;
  const percentage = useMemo(() => {
    if (max === min) return 0;
    return ((currentValue - min) / (max - min)) * 100;
  }, [currentValue, max, min]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <div className={`space-y-3 rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-4">
          {label ? (
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-slate-800"
            >
              {label}
            </label>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className="text-sm text-slate-600">{currentValue}</span>
          ) : null}
        </div>
      )}

      <input
        type="range"
        id={inputId}
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        onChange={handleChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(14 165 233) ${percentage}%, rgb(226 232 240) ${percentage}%, rgb(226 232 240) 100%)`,
        }}
        aria-label={label ?? "Slider"}
      />

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
