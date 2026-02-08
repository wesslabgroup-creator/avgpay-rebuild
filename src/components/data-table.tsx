interface TableProps {
  headers: string[];
  rows: (string | number)[][];
}

export function DataTable({ headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            {headers.map((header, i) => (
              <th key={i} className="text-left py-3 px-4 font-semibold text-slate-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-slate-400">
                  {typeof cell === 'number' ? `$${cell.toLocaleString()}` : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
