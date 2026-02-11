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
          <div key={rowIndex} className="bg-surface border border-border rounded-lg p-4 space-y-2 shadow-sm">
            {headers.map((header, colIndex) => (
              row[colIndex] && (
                <div key={colIndex} className="flex justify-between">
                  <span className="text-text-muted text-sm font-medium">{header.label as string}:</span>
                  <span className="text-text-primary">{row[colIndex]}</span>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
      
      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border-spacing-0 bg-surface border border-border rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              {headers.map((header, index) => (
                <th key={index} className="p-4 text-left text-sm font-semibold text-text-secondary border-r border-border last:border-r-0">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-b-0 hover:bg-surface-subtle transition-colors">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-4 text-sm text-text-secondary border-r border-border last:border-r-0">
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
