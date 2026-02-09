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
          <div key={rowIndex} className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-sm">
            {headers.map((header, colIndex) => (
              row[colIndex] && (
                <div key={colIndex} className="flex justify-between">
                  <span className="text-slate-500 text-sm font-medium">{header.label as string}:</span>
                  <span className="text-slate-900">{row[colIndex]}</span>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
      
      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border-spacing-0 bg-white border border-slate-200 rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {headers.map((header, index) => (
                <th key={index} className="p-4 text-left text-sm font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-4 text-sm text-slate-700 border-r border-slate-200 last:border-r-0">
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
