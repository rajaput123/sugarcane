
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Trash2, TrendingUp, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function WastageTab() {
    const { wastage } = useKitchen();
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Trash2 size={24} className="text-slate-500" />
                    Wastage & Review
                </h2>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-neutral-200/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <AlertOctagon className="text-slate-400" size={24} />
                    <div>
                        <h3 className="font-bold text-slate-900">Daily Accountability</h3>
                        <p className="text-sm text-slate-500">All wastage must be logged and reviewed by the kitchen supervisor before closing the day.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {wastage.map((log) => (
                        <div key={log.id} className="flex flex-col md:flex-row gap-4 justify-between items-start p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div>
                                <h4 className="font-black text-slate-900">{log.itemName}</h4>
                                <p className="text-sm text-slate-500 font-medium">Source: {log.source}</p>
                                <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-red-50 text-red-700 text-xs font-bold uppercase rounded">
                                    <TrendingUp size={12} />
                                    {log.reason}
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-2xl font-black text-slate-900">{log.quantity} <span className="text-sm text-slate-500">{log.unit}</span></span>
                                <p className="text-xs text-slate-400 font-medium mt-1">Logged on {log.date}</p>
                            </div>

                            <div className="w-full md:w-1/3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                "{log.notes}"
                            </div>
                        </div>
                    ))}

                    {wastage.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            No wastage reported yet.
                        </div>
                    )}
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6 flex justify-end">
                    <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <CheckCircle2 size={20} /> Review & Close Day
                    </button>
                </div>
            </div>
        </div>
    );
}

