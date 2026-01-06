import React from 'react';
import CalendarView from './CalendarView';
import TaskManagement from './TaskManagement';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_48px_0_rgba(31,38,135,0.1)] hover:bg-white/50 animate-snappy ${className}`}>
        {children}
    </div>
);

export default function DashboardView() {

    return (
        <div className="h-full w-full gamma-light-bg relative overflow-hidden group/dashboard">
            <div className="grain-overlay" />

            <div className="relative h-full w-full overflow-auto px-4 sm:px-8 py-8 sm:py-12 scrollbar-hide">
                <div className="max-w-[1600px] mx-auto space-y-12">
                    {/* Header */}
                    <div className="animate-fadeIn">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">Dashboard.</h1>
                        <p className="text-base sm:text-lg text-slate-600 font-medium italic opacity-60 tracking-tight">Everything looks bright today.</p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
                        {/* Calendar Section - Spans 7 cols on XL */}
                        <div className="xl:col-span-7 space-y-6">
                            <h2 className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] px-1 opacity-40">Workspace Planning</h2>
                            <GlassCard className="h-full">
                                <CalendarView />
                            </GlassCard>
                        </div>

                        {/* Task Management Section - Spans 5 cols on XL */}
                        <div className="xl:col-span-5 space-y-6">
                            <h2 className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] px-1 opacity-40">Active Roadmap</h2>
                            <GlassCard className="h-full">
                                <TaskManagement />
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
