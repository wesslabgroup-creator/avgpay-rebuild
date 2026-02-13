
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValueBlock } from '@/lib/value-expansion';
import { TrendingUp, Building2 } from 'lucide-react';
import { DataTable } from '@/components/data-table';

function formatCurrency(n: number) {
    return `$${(n / 1000).toFixed(0)}k`;
}

export function ValueBlockRenderer({ blocks }: { blocks: ValueBlock[] }) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="space-y-8 my-8">
            {blocks.map((block, index) => {
                if (block.type === 'market_position') {
                    const { p25, median, p75, count } = block.data as { p25: number; median: number; p75: number; count: number };
                    return (
                        <Card key={index} className="bg-white border-emerald-500/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    {block.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-emerald-600">{formatCurrency(median)}</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase mt-1">Median Total Comp</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-semibold text-slate-800">{formatCurrency(p25)}</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase mt-1">25th Percentile</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-semibold text-slate-800">{formatCurrency(p75)}</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase mt-1">75th Percentile</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-semibold text-slate-800">{count.toLocaleString()}</p>
                                        <p className="text-sm font-medium text-slate-500 uppercase mt-1">Data Points</p>
                                    </div>
                                </div>
                                {block.narrative && (
                                    <p className="text-slate-600 italic border-l-4 border-emerald-200 pl-4 py-2 bg-emerald-50 rounded-r">
                                        {block.narrative}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    );
                }

                if (block.type === 'top_payers') {
                    const payers = block.data as { name: string; median: number }[];
                    return (
                        <Card key={index} className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-slate-600" />
                                    {block.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    headers={[{ label: "Name", key: "name" }, { label: "Median Comp", key: "median" }]}
                                    rows={payers.map((r) => [
                                        <span key={r.name} className="font-medium text-slate-900">{r.name}</span>,
                                        formatCurrency(r.median)
                                    ])}
                                />
                            </CardContent>
                        </Card>
                    );
                }

                return null;
            })}
        </div>
    );
}
