
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Utensils, Clock, CheckCircle2, Play, AlertCircle } from 'lucide-react';

export default function ProductionTab() {
    const { batches } = useKitchen();
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Utensils size={24} className="text-slate-500" />
                    Cooking Production
                </h2>
            </div>

            <div className="grid gap-4">
                {batches.map((batch) => (
                    <div key={batch.id} className="bg-white/60 p-4 rounded-xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${batch.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                batch.status === 'Cooking' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                                    batch.status === 'Quality Check' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                <Utensils size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900">{batch.recipeName} <span className="text-sm font-medium text-slate-500">Batch #{batch.batchNumber}</span></h3>
                                <p className="text-sm text-slate-600 font-medium">Head Cook: {batch.cookName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-xs uppercase font-bold text-slate-400">Yield</p>
                                <p className="font-mono font-bold text-slate-900">{batch.yield > 0 ? `${batch.yield} ${batch.unit}` : '-'}</p>
                            </div>

                            <div className="text-right min-w-[100px]">
                                <p className="text-xs uppercase font-bold text-slate-400">Status</p>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${batch.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                    batch.status === 'Cooking' ? 'bg-blue-100 text-blue-700' :
                                        batch.status === 'Quality Check' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {batch.status === 'Cooking' && <Clock size={12} className="animate-spin" />}
                                    {batch.status}
                                </div>
                            </div>

                            <button className={`p-2 rounded-lg transition-colors ${batch.status === 'Cooking' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                }`} disabled={batch.status !== 'Cooking'}>
                                {batch.status === 'Cooking' ? <CheckCircle2 size={20} /> : <Play size={20} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
