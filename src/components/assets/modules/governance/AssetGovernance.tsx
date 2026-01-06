import React from 'react';
import { Lock, Users, Shield } from 'lucide-react';

export default function AssetGovernance() {
    return (
        <div className="animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Access & Governance</h2>
                <p className="text-sm text-slate-600 font-medium">Role-based access, approval matrices, and audit logs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-slate-400" size={20} />
                        <h3 className="text-sm font-black text-slate-900">Access Roles</h3>
                    </div>
                    <div className="space-y-2">
                        {['Asset Manager', 'Custodian', 'Auditor', 'Trustee'].map((role) => (
                            <div key={role} className="p-2 bg-slate-50 rounded-lg">
                                <p className="text-xs font-medium text-slate-900">{role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-slate-400" size={20} />
                        <h3 className="text-sm font-black text-slate-900">Approval Matrix</h3>
                    </div>
                    <div className="space-y-2">
                        {[
                            { action: 'Sacred Asset Disposal', requires: 'Trustee Board' },
                            { action: 'Valuation Update', requires: 'Asset Manager' },
                            { action: 'Custody Transfer', requires: 'Dual Approval' },
                        ].map((item, idx) => (
                            <div key={idx} className="p-2 bg-slate-50 rounded-lg">
                                <p className="text-xs font-medium text-slate-900">{item.action}</p>
                                <p className="text-[10px] text-slate-500">{item.requires}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="text-slate-400" size={20} />
                        <h3 className="text-sm font-black text-slate-900">Module Boundaries</h3>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600">
                        <p className="font-medium">✓ Only Asset Governance can modify assets</p>
                        <p className="font-medium">✓ Other modules can request usage</p>
                        <p className="font-medium">✓ All actions are audited</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

