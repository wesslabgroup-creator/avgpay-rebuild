"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalaryDistributionChartProps {
  data: number[];
}

export const SalaryDistributionChart = ({ data }: SalaryDistributionChartProps) => {
  if (!data || data.length === 0) {
    return <p className="text-text-muted text-center">Not enough data to display a chart.</p>;
  }

  // Simple histogram logic
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const binCount = 10;
  const binSize = range / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => {
    const binMin = min + i * binSize;
    const binMax = binMin + binSize;
    return {
      name: `$${(binMin / 1000).toFixed(0)}k - $${(binMax / 1000).toFixed(0)}k`,
      count: data.filter(d => d >= binMin && d < binMax).length,
    };
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={bins}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${value} salaries`} />
          <Legend />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
