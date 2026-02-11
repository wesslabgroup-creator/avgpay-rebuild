"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
    value: number[];
    min: number;
    max: number;
    step?: number;
    onValueChange: (value: number[]) => void;
    className?: string;
}

export function Slider({ value, min, max, step = 1, onValueChange, className }: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange([parseFloat(e.target.value)]);
    };

    const percentage = ((value[0] - min) / (max - min)) * 100;

    return (
        <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
            <div className="relative w-full h-2 bg-surface-muted rounded-full">
                <div
                    className="absolute h-full bg-primary-subtle0 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
            <div
                className="absolute h-5 w-5 rounded-full border-2 border-primary bg-surface ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                style={{ left: `calc(${percentage}% - 10px)` }}
            />
        </div>
    );
}
