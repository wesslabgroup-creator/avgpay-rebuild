"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
} | null>(null);

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue || value);

    React.useEffect(() => {
        if (value !== undefined) setSelectedValue(value);
    }, [value]);

    const handleValueChange = (newValue: string) => {
        setSelectedValue(newValue);
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value: selectedValue || "", onValueChange: handleValueChange }}>
            <div className={cn("", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    className?: string;
    children: React.ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-surface-muted p-1 text-text-muted", className)}>
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
    const context = React.useContext(TabsContext);
    const isSelected = context?.value === value;

    return (
        <button
            type="button"
            onClick={() => context?.onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected && "bg-surface text-text-primary shadow-sm",
                className
            )}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
    const context = React.useContext(TabsContext);
    if (context?.value !== value) return null;

    return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>;
}
