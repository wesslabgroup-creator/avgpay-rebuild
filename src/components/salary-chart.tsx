"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SalaryChartProps {
  yourSalary: number;
  marketMedian: number;
  blsMedian: number;
}

export function SalaryChart({ yourSalary, marketMedian, blsMedian }: SalaryChartProps) {
  const data = [
    { name: "BLS Data", value: blsMedian, color: "#64748b" }, // Slate 500
    { name: "Market Median", value: marketMedian, color: "#34d399" }, // Emerald 400
    { name: "Your Offer", value: yourSalary, color: "#059669" }, // Emerald 600
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), "Salary"]}
            contentStyle={{ 
              backgroundColor: "#ffffff", 
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              color: "#0f172a"
            }}
            itemStyle={{ color: "#0f172a" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
