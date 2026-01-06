/**
 * Chart Container Component
 * 
 * Wrapper component for all charts with consistent styling
 */

import React from 'react';

interface ChartContainerProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    loading?: boolean;
    empty?: boolean;
    emptyMessage?: string;
}

export default function ChartContainer({
    title,
    children,
    className = '',
    loading = false,
    empty = false,
    emptyMessage = 'No data available',
}: ChartContainerProps) {
    return (
        <div className={`bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6 ${className}`}>
            {title && (
                <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            )}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-pulse text-slate-400 text-sm font-medium">Loading chart...</div>
                </div>
            ) : empty ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-slate-400 text-sm font-medium">{emptyMessage}</p>
                </div>
            ) : (
                <div className="w-full">{children}</div>
            )}
        </div>
    );
}

