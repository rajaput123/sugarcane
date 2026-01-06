import React from 'react';
import { Building2, LayoutGrid, DollarSign, Workflow, Link2 } from 'lucide-react';
import { AssetWithRelationships } from '@/types/assetRelationships';

interface AssetRelationshipViewProps {
    asset: AssetWithRelationships;
}

export default function AssetRelationshipView({ asset }: AssetRelationshipViewProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Cross-Module Relationships</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* People Module Link */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Building2 size={16} className="text-slate-400" />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">People Module</h4>
                    </div>
                    {asset.department ? (
                        <div>
                            <p className="text-sm font-medium text-slate-900">{asset.department.name}</p>
                            <p className="text-xs text-slate-500 mt-1">Department: {asset.department.code}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No department assigned</p>
                    )}
                    {asset.custodian && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                            <p className="text-xs font-medium text-slate-700">Custodian: {asset.custodian.name}</p>
                        </div>
                    )}
                </div>

                {/* Projects Module Link */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                        <LayoutGrid size={16} className="text-slate-400" />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Projects Module</h4>
                    </div>
                    {asset.activeProjectUsage ? (
                        <div>
                            <p className="text-sm font-medium text-slate-900">{asset.activeProjectUsage.projectName}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Usage: {asset.activeProjectUsage.usageStartDate} - {asset.activeProjectUsage.usageEndDate || 'Ongoing'}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No active project usage</p>
                    )}
                </div>

                {/* Finance Module Link */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign size={16} className="text-slate-400" />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Finance Module</h4>
                    </div>
                    {asset.financialRecords ? (
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500">Valuations: {asset.financialRecords.valuationRecords.length}</p>
                            <p className="text-xs text-slate-500">Maintenance Expenses: {asset.financialRecords.maintenanceExpenses.length}</p>
                            <p className="text-xs text-slate-400 italic mt-2">Read-only access</p>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No financial records</p>
                    )}
                </div>

                {/* Operations Module Link */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Workflow size={16} className="text-slate-400" />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Operations Module</h4>
                    </div>
                    {asset.operationalUsage ? (
                        <div>
                            <p className="text-sm font-medium text-slate-900">{asset.operationalUsage.operationType}</p>
                            <p className="text-xs text-slate-500 mt-1">Last used: {asset.operationalUsage.lastUsed}</p>
                            <p className="text-xs text-slate-500">Usage count: {asset.operationalUsage.usageCount}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No operational usage</p>
                    )}
                </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                    <Link2 size={14} className="text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs font-medium text-blue-900 mb-1">Data Linkage Rules</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Department references are validated against People module</li>
                            <li>• Project usage is tracked via AssetUsageRequest</li>
                            <li>• Finance module has read-only access to valuations</li>
                            <li>• Operations module can request asset usage</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

