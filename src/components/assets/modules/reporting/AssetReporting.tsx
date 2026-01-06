import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export default function AssetReporting() {
    return (
        <div className="animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Impact & Reporting</h2>
                <p className="text-sm text-slate-600 font-medium">High-fidelity dashboards for trustees and auditors</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-black text-slate-900">Total Assets</h3>
                        <BarChart3 className="text-slate-400" size={20} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">1,247</p>
                    <p className="text-xs text-slate-500 mt-1">Across all categories</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-black text-slate-900">Total Value</h3>
                        <TrendingUp className="text-slate-400" size={20} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">₹45.2 Cr</p>
                    <p className="text-xs text-slate-500 mt-1">Current valuation</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-black text-slate-900">Pending Audits</h3>
                        <PieChart className="text-slate-400" size={20} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">12</p>
                    <p className="text-xs text-slate-500 mt-1">Due this month</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                <h3 className="text-sm font-black text-slate-900 mb-4">Cross-Module Integration Status</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-xs font-medium text-slate-900">People Module (Departments)</span>
                        <span className="text-xs font-bold text-green-600">Linked</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-xs font-medium text-slate-900">Finance Module (Valuations)</span>
                        <span className="text-xs font-bold text-green-600">Read-Only</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-xs font-medium text-slate-900">Projects Module (Usage Requests)</span>
                        <span className="text-xs font-bold text-green-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-xs font-medium text-slate-900">Operations Module (Usage Requests)</span>
                        <span className="text-xs font-bold text-green-600">Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

