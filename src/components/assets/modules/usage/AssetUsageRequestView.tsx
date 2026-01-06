import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Building2, LayoutGrid, Workflow } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { AssetUsageRequest } from '@/types/asset';

interface AssetUsageRequestViewProps {
    requests: AssetUsageRequest[];
    onApprove: (requestId: string) => void;
    onReject: (requestId: string) => void;
    canModify: boolean; // Only Asset Governance can approve
}

export default function AssetUsageRequestView({ requests, onApprove, onReject, canModify }: AssetUsageRequestViewProps) {
    const [selectedRequest, setSelectedRequest] = useState<AssetUsageRequest | null>(null);

    const getModuleIcon = (module: string) => {
        switch (module) {
            case 'Operations':
                return Workflow;
            case 'Projects':
                return LayoutGrid;
            case 'Finance':
                return Building2;
            default:
                return Building2;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-earth-100 text-earth-900';
            case 'rejected':
                return 'bg-earth-900/10 text-earth-900';
            case 'completed':
                return 'bg-earth-400/30 text-earth-900';
            default:
                return 'bg-earth-400/20 text-earth-900';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">Asset Usage Requests</h3>
                    <p className="text-xs text-slate-500">Cross-module requests for asset usage</p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="p-8 text-center border border-slate-100 rounded-xl bg-slate-50">
                    <p className="text-sm text-slate-500">No usage requests</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map((request) => {
                        const ModuleIcon = getModuleIcon(request.requestingModule);
                        return (
                            <div
                                key={request.id}
                                className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-900 transition-all cursor-pointer"
                                onClick={() => setSelectedRequest(request)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <ModuleIcon size={18} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{request.requestingModule} Request</p>
                                            <p className="text-xs text-slate-500 mt-1">{request.purpose}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">Requested: {new Date(request.requestedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                        {request.status === 'pending' && canModify && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onApprove(request.id);
                                                    }}
                                                    className="p-1.5 bg-earth-100 text-earth-900 rounded-lg hover:bg-earth-400 transition-colors"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onReject(request.id);
                                                    }}
                                                    className="p-1.5 bg-earth-900/10 text-earth-900 rounded-lg hover:bg-earth-900/20 transition-colors"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedRequest && (
                <Modal
                    isOpen={!!selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    title="Usage Request Details"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Requesting Module</p>
                            <p className="text-sm font-black text-slate-900">{selectedRequest.requestingModule}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Purpose</p>
                            <p className="text-sm text-slate-900">{selectedRequest.purpose}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
                            <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(selectedRequest.status)}`}>
                                {selectedRequest.status}
                            </span>
                        </div>
                        {selectedRequest.projectId && (
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">Project ID</p>
                                <p className="text-sm text-slate-900">{selectedRequest.projectId}</p>
                            </div>
                        )}
                        {selectedRequest.usageStartDate && (
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">Usage Period</p>
                                <p className="text-sm text-slate-900">
                                    {new Date(selectedRequest.usageStartDate).toLocaleDateString()} - {selectedRequest.usageEndDate ? new Date(selectedRequest.usageEndDate).toLocaleDateString() : 'Ongoing'}
                                </p>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}

