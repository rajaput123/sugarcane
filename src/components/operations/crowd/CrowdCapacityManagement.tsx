/**
 * Crowd & Capacity Management
 * 
 * Real-time crowd monitoring, capacity tracking, and zone management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, TrendingUp, MapPin, Activity } from 'lucide-react';
import { Zone, CrowdSnapshot } from '@/types/operations';
import { mockZones, mockCrowdSnapshots } from '@/data/mockOperationsData';
import ChartContainer from '@/components/shared/charts/ChartContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

export default function CrowdCapacityManagement() {
    const [zones, setZones] = useState<Zone[]>(mockZones);
    const [snapshots, setSnapshots] = useState<CrowdSnapshot[]>(mockCrowdSnapshots);

    // Update zones periodically (simulate real-time updates)
    useEffect(() => {
        const interval = setInterval(() => {
            setZones((prevZones) =>
                prevZones.map((zone) => ({
                    ...zone,
                    currentCount: Math.max(0, Math.min(zone.maxCapacity, zone.currentCount + Math.floor(Math.random() * 10 - 5))),
                    status:
                        zone.currentCount / zone.maxCapacity > 0.9
                            ? 'full'
                            : zone.currentCount / zone.maxCapacity > 0.7
                            ? 'crowded'
                            : 'normal',
                    lastUpdated: new Date().toISOString(),
                }))
            );
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Capacity data for charts
    const capacityData = zones.map((zone) => ({
        name: zone.name,
        current: zone.currentCount,
        max: zone.maxCapacity,
        percentage: Math.round((zone.currentCount / zone.maxCapacity) * 100),
    }));

    // Crowd flow data (mock historical)
    const flowData = [
        { time: '06:00', count: 50 },
        { time: '08:00', count: 150 },
        { time: '10:00', count: 300 },
        { time: '12:00', count: 400 },
        { time: '14:00', count: 350 },
        { time: '16:00', count: 280 },
        { time: '18:00', count: 200 },
        { time: '20:00', count: 100 },
    ];

    const totalCount = zones.reduce((sum, zone) => sum + zone.currentCount, 0);
    const totalCapacity = zones.reduce((sum, zone) => sum + zone.maxCapacity, 0);
    const overallPercentage = Math.round((totalCount / totalCapacity) * 100);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'full':
                return 'bg-red-100 text-red-700';
            case 'crowded':
                return 'bg-orange-100 text-orange-700';
            case 'closed':
                return 'bg-slate-100 text-slate-700';
            default:
                return 'bg-green-100 text-green-700';
        }
    };

    const getCapacityColor = (percentage: number) => {
        if (percentage >= 90) return '#ef4444';
        if (percentage >= 70) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crowd & Capacity Management</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">Monitor crowd density and capacity in real-time</p>
                </div>
            </div>

            {/* Overall Capacity Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Overall Capacity</span>
                        <Activity size={18} className="text-slate-400" />
                    </div>
                    <div className="text-3xl font-black text-slate-900">{overallPercentage}%</div>
                    <div className="text-xs text-slate-500 mt-1">
                        {totalCount} / {totalCapacity} people
                    </div>
                </div>
                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Total Zones</span>
                        <MapPin size={18} className="text-slate-400" />
                    </div>
                    <div className="text-3xl font-black text-slate-900">{zones.length}</div>
                    <div className="text-xs text-slate-500 mt-1">Active zones</div>
                </div>
                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Crowded Zones</span>
                        <AlertTriangle size={18} className="text-orange-500" />
                    </div>
                    <div className="text-3xl font-black text-orange-600">{zones.filter((z) => z.status === 'crowded' || z.status === 'full').length}</div>
                    <div className="text-xs text-slate-500 mt-1">Require attention</div>
                </div>
                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Available Space</span>
                        <TrendingUp size={18} className="text-green-500" />
                    </div>
                    <div className="text-3xl font-black text-green-600">{totalCapacity - totalCount}</div>
                    <div className="text-xs text-slate-500 mt-1">People capacity</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Capacity Heatmap */}
                    <ChartContainer title="Zone Capacity Status">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={capacityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={80} />
                                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="current" fill="#3b82f6" name="Current" />
                                <Bar dataKey="max" fill="#e2e8f0" name="Max Capacity" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Crowd Flow Chart */}
                    <ChartContainer title="Crowd Flow Over Time">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={flowData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Zones List */}
                    <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Zone Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {zones.map((zone) => {
                                const percentage = Math.round((zone.currentCount / zone.maxCapacity) * 100);
                                return (
                                    <div
                                        key={zone.id}
                                        className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={18} className="text-slate-400" />
                                                <h4 className="font-black text-slate-900">{zone.name}</h4>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(zone.status)}`}>
                                                {zone.status}
                                            </span>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-600">Capacity</span>
                                                <span className="font-black text-slate-900">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: getCapacityColor(percentage),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                            <span>
                                                {zone.currentCount} / {zone.maxCapacity} people
                                            </span>
                                            <span className="capitalize">{zone.type}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Capacity Percentage Chart */}
                    <ChartContainer title="Capacity by Zone">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={capacityData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, 100]} stroke="#64748b" style={{ fontSize: '10px' }} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: '10px' }} width={80} />
                                <Tooltip />
                                <Bar dataKey="percentage" fill="#3b82f6">
                                    {capacityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getCapacityColor(entry.percentage)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Alerts */}
                    {(zones.filter((z) => z.status === 'crowded' || z.status === 'full').length > 0) && (
                        <div className="bg-white/40 backdrop-blur-xl border border-orange-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                                <AlertTriangle size={16} className="text-orange-600" />
                                Capacity Alerts
                            </h3>
                            <div className="space-y-2">
                                {zones
                                    .filter((z) => z.status === 'crowded' || z.status === 'full')
                                    .map((zone) => (
                                        <div key={zone.id} className="p-2 bg-orange-50/60 rounded text-xs">
                                            <p className="font-medium text-slate-900">{zone.name}</p>
                                            <p className="text-slate-600">
                                                {Math.round((zone.currentCount / zone.maxCapacity) * 100)}% capacity - {zone.status}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
