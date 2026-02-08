"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SalaryChartProps {
  yourSalary: number;
  marketMedian: number;
  blsMedian: number;
}

export function SalaryChart({ yourSalary, marketMedian, blsMedian }: SalaryChartProps) {
  const data = [
    { name: "BLS Data", value: blsMedian, color: "#64748b" },
    { name: "Market Median", value: marketMedian, color: "#818cf8" },
    { name: "Your Offer", value: yourSalary, color: "#6366f1" },
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), "Salary"]}
            contentStyle={{ 
              backgroundColor: "#0f172a", 
              border: "1px solid #1e293b",
              borderRadius: "6px"
            }}
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
