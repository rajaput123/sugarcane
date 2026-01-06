
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Store, Package, TrendingDown, ArrowRight } from 'lucide-react';

export default function CounterTab() {
    const { counterStock } = useKitchen();
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Store size={24} className="text-slate-500" />
                    Counter Prasad Management
                </h2>
            </div>

            <div className="grid gap-6">
                {counterStock.map((counter) => (
                    <div key={counter.counterId} className="bg-white/60 p-6 rounded-xl border border-white/20">
                        <h3 className="text-lg font-black text-slate-900 mb-4">{counter.counterName}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {counter.items.map((item) => (
                                <div key={item.itemId} className="bg-white/50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800">{item.itemName}</h4>
                                            <Package size={16} className="text-slate-400" />
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-slate-900">{item.currentStock.toLocaleString()}</span>
                                            <span className="text-xs text-slate-500 font-bold uppercase">Available</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Issued Today</span>
                                            <span className="font-medium text-slate-900">{item.totalIssued}</span>
                                        </div>
                                        <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded hover:bg-slate-800 flex items-center justify-center gap-2">
                                            Issue Stock <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
