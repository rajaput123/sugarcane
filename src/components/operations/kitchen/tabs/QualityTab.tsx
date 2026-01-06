
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { ClipboardCheck, Check, X, AlertTriangle } from 'lucide-react';

export default function QualityTab() {
    const { qualityChecks } = useKitchen();
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ClipboardCheck size={24} className="text-slate-500" />
                    Quality & Hygiene Inspection
                </h2>
            </div>

            <div className="grid gap-4">
                {qualityChecks.map((check) => (
                    <div key={check.id} className="bg-white/60 p-6 rounded-xl border border-white/20 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{check.recipeName}</h3>
                                <p className="text-sm text-slate-500">Inspected by {check.inspectorName} • {new Date(check.timestamp).toLocaleTimeString()}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold uppercase flex items-center gap-2 ${check.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {check.status === 'Passed' ? <Check size={16} /> : <X size={16} />}
                                {check.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {Object.entries(check.parameters).map(([param, passed]) => (
                                <div key={param} className={`p-3 rounded-lg text-center border ${passed ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'
                                    }`}>
                                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">{param}</p>
                                    {passed ? (
                                        <Check className="mx-auto text-green-500" size={20} />
                                    ) : (
                                        <X className="mx-auto text-red-500" size={20} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Rating</p>
                                <div className="flex gap-1">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={`h-2 w-4 rounded-full ${i < check.rating ? 'bg-green-500' : 'bg-slate-200'
                                            }`} />
                                    ))}
                                    <span className="ml-2 text-sm font-bold text-slate-700">{check.rating}/10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
