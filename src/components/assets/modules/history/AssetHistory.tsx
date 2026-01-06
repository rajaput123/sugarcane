import React from 'react';
import { Archive, Clock, FileText } from 'lucide-react';

export default function AssetHistory() {
    return (
        <div className="animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">History & Memory</h2>
                <p className="text-sm text-slate-600 font-medium">Institutional memory and archival media preservation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Archive className="text-slate-400" size={20} />
                        <h3 className="text-sm font-black text-slate-900">Complete Lifecycle History</h3>
                    </div>
                    <div className="space-y-2">
                        {[
                            { event: 'Acquired', date: 'Jan 1, 2020', by: 'Trustee A' },
                            { event: 'Registered', date: 'Jan 2, 2020', by: 'Asset Manager' },
                            { event: 'Valued', date: 'Jan 15, 2020', by: 'Valuator' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                                <Clock size={14} className="text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-slate-900">{item.event}</p>
                                    <p className="text-[10px] text-slate-500">{item.date} by {item.by}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-slate-400" size={20} />
                        <h3 className="text-sm font-black text-slate-900">Archived Documents</h3>
                    </div>
                    <div className="space-y-2">
                        {[
                            { doc: 'Acquisition Certificate', date: 'Jan 1, 2020' },
                            { doc: 'Valuation Report', date: 'Jan 15, 2020' },
                            { doc: 'Audit Record', date: 'Dec 1, 2025' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                                <FileText size={14} className="text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-slate-900">{item.doc}</p>
                                    <p className="text-[10px] text-slate-500">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

