/**
 * Timeline Chart Component
 * 
 * Reusable timeline/Gantt chart visualization
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TimelineItem {
    id: string;
    name: string;
    start: number; // minutes from start of day
    duration: number; // minutes
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface TimelineChartProps {
    data: TimelineItem[];
    startHour?: number;
    endHour?: number;
    className?: string;
}

const statusColors = {
    scheduled: '#8b5cf6',
    'in-progress': '#3b82f6',
    completed: '#10b981',
    cancelled: '#ef4444',
};

export default function TimelineChart({
    data,
    startHour = 6,
    endHour = 22,
    className = '',
}: TimelineChartProps) {
    // Transform data for Recharts
    const chartData = data.map((item) => ({
        name: item.name,
        start: item.start,
        end: item.start + item.duration,
        duration: item.duration,
        status: item.status,
    }));

    const maxTime = (endHour - startHour) * 60; // Total minutes in range

    return (
        <div className={`w-full ${className}`}>
            <ResponsiveContainer width="100%" height={Math.max(300, data.length * 60)}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        type="number"
                        domain={[0, maxTime]}
                        tickFormatter={(value) => {
                            const hour = Math.floor(value / 60) + startHour;
                            const minute = value % 60;
                            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        }}
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        width={90}
                    />
                    <Tooltip
                        formatter={(value: number | undefined, name: string | undefined) => {
                            if (value === undefined) return '';
                            const safeName = name || '';
                            if (safeName === 'start') {
                                const hour = Math.floor(value / 60) + startHour;
                                const minute = value % 60;
                                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            }
                            if (safeName === 'end') {
                                const hour = Math.floor(value / 60) + startHour;
                                const minute = value % 60;
                                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            }
                            return value;
                        }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px',
                        }}
                    />
                    <Bar dataKey="duration" fill="#3b82f6">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={statusColors[entry.status as keyof typeof statusColors]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

