import React from "react";

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    label: string;
    unit?: string;
  }
  
  export function Slider({ value, onChange, min, max, label, unit }: SliderProps) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}: {value}{unit}
        </label>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-light-green rounded-lg appearance-none cursor-pointer accent-primary-green"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  }