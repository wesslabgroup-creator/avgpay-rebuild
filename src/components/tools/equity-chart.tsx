"use client";

import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface EquityChartProps {
    data: Array<{
        month: number;
        value: number;
        vested: number;
    }>;
}

export function EquityChart({ data }: EquityChartProps) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

    return (
        <div className="h-[400px] w-full bg-surface rounded-xl border border-border p-4 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(value) => `Year ${value / 12}`}
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tickFormatter={(value) => `$${value / 1000}k`}
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        formatter={(value: unknown) => [formatCurrency(value as number), "Value"]}
                        labelFormatter={(label) => `Month ${label}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        name="Total Value"
                    />
                    <Line
                        type="monotone"
                        dataKey="vested"
                        stroke="#059669"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Vested Value"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
