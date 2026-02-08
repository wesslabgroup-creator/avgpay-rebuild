"use client";

import { ReactNode } from 'react';

interface Header {
  label: ReactNode | string;
  key: string;
}

interface DataTableProps {
  headers: Header[];
  rows: (ReactNode | string)[][];
}

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="w-full">
      {/* Mobile: Cards */}
      <div className="block md:hidden space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
            {headers.map((header, colIndex) => (
              row[colIndex] && (
                <div key={colIndex} className="flex justify-between">
                  <span className="text-slate-400 text-sm font-medium">{header.label as string}:</span>
                  <span>{row[colIndex]}</span>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
      
      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border-spacing-0 bg-slate-800/50 border border-slate-700 rounded-lg">
          <thead>
            <tr className="border-b border-slate-700">
              {headers.map((header, index) => (
                <th key={index} className="p-4 text-left text-sm font-semibold text-slate-300 border-r border-slate-700 last:border-r-0">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-4 text-sm text-slate-200 border-r border-slate-700 last:border-r-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}