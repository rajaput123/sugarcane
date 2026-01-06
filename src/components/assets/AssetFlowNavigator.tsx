import React, { useState } from 'react';
import {
    Database, Tag, PlusCircle, ShieldCheck, Truck,
    Wrench, Search, LineChart, FileText, Trash2,
    Archive, BarChart3, Lock, Info
} from 'lucide-react';

interface Node {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    x: number;
    y: number;
    description: string;
    linksTo?: string[];
}

export default function AssetFlowNavigator({
    activeNode,
    simulationPath,
    onNodeClick
}: {
    activeNode: string | null;
    simulationPath?: string[];
    onNodeClick: (id: string) => void;
}) {
    const nodes: Node[] = [
        { id: 'registry', label: 'Registry', icon: Database, x: 100, y: 100, description: 'Immutable entry of asset DNA.', linksTo: ['classification'] },
        { id: 'classification', label: 'Classification', icon: Tag, x: 250, y: 100, description: 'Tag-driven governance rules.', linksTo: ['security', 'valuation'] },
        { id: 'security', label: 'Security', icon: ShieldCheck, x: 400, y: 100, description: 'Access and custody controls.', linksTo: ['movement', 'audit'] },
        { id: 'movement', label: 'Movement', icon: Truck, x: 550, y: 100, description: 'Spatial tracking and logistics.' },
        { id: 'audit', label: 'Audit', icon: Search, x: 400, y: 250, description: 'Physical verification loop.', linksTo: ['valuation', 'compliance'] },
        { id: 'valuation', label: 'Valuation', icon: LineChart, x: 250, y: 250, description: 'Financial lifecycle tracking.' },
        { id: 'acquisition', label: 'Acquisition', icon: PlusCircle, x: 100, y: 250, description: 'Inbound stream protocols.', linksTo: ['registry'] },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench, x: 550, y: 250, description: 'Predictive preservation logic.' },
        { id: 'compliance', label: 'Compliance', icon: FileText, x: 700, y: 175, description: 'Legal and tax integrity.', linksTo: ['reporting'] },
        { id: 'reporting', label: 'Reporting', icon: BarChart3, x: 850, y: 175, description: 'Stakeholder transparency.' },
        { id: 'governance', label: 'Access', icon: Lock, x: 1000, y: 175, description: 'RBAC and audit trails.' },
        { id: 'history', label: 'History', icon: Archive, x: 700, y: 325, description: 'Permanent memory archive.' },
        { id: 'disposal', label: 'Disposal', icon: Trash2, x: 850, y: 325, description: 'End-of-life protocols.' },
    ];

    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <div className="relative w-full h-[500px] bg-slate-50/50 rounded-[48px] border border-slate-100 overflow-hidden cursor-crosshair group/navigator p-12">
            <div className="absolute top-8 left-12 flex items-center gap-2">
                <Info size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Governance Ribbon: Interactive Linking Flow</span>
            </div>

            <svg className="w-full h-full" viewBox="0 0 1100 400">
                {/* Background Grid Lines */}
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Connection Lines (Glow/Pulse) */}
                {nodes.map(node => node.linksTo?.map(targetId => {
                    const target = nodes.find(n => n.id === targetId);
                    if (!target) return null;
                    const isActive = activeNode === node.id || activeNode === target.id;
                    const isInSimulation = simulationPath?.includes(node.id) && simulationPath?.includes(target.id);
                    return (
                        <g key={`${node.id}-${targetId}`}>
                            <path
                                d={`M ${node.x} ${node.y} L ${target.x} ${target.y}`}
                                stroke={isInSimulation ? '#10b981' : isActive ? '#0f172a' : '#e2e8f0'}
                                strokeWidth={isInSimulation ? 3 : isActive ? 2 : 1}
                                strokeDasharray={isInSimulation ? "none" : isActive ? "none" : "4 4"}
                                className={`transition-all duration-500 ${isActive || isInSimulation ? 'opacity-100' : 'opacity-40'}`}
                            />
                            {(isActive || isInSimulation) && (
                                <circle r={isInSimulation ? 4 : 3} fill={isInSimulation ? "#10b981" : "#0f172a"}>
                                    <animateMotion
                                        dur={isInSimulation ? "1.5s" : "2s"}
                                        repeatCount="indefinite"
                                        path={`M ${node.x} ${node.y} L ${target.x} ${target.y}`}
                                    />
                                </circle>
                            )}
                        </g>
                    );
                }))}

                {/* Nodes */}
                {nodes.map((node) => {
                    const isActive = activeNode === node.id;
                    const isHovered = hoveredNode === node.id;
                    const isSimulation = simulationPath?.includes(node.id);
                    return (
                        <g
                            key={node.id}
                            transform={`translate(${node.x},${node.y})`}
                            onClick={() => onNodeClick(node.id)}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            className="cursor-pointer"
                        >
                            {/* Outer Glow */}
                            <circle
                                r={isActive || isSimulation ? 32 : 28}
                                className={`transition-all duration-500 ${isSimulation ? 'fill-emerald-500/10' : isActive ? 'fill-slate-900/10' : 'fill-transparent'}`}
                            />

                            {/* Node Body */}
                            <circle
                                r={24}
                                className={`transition-all duration-500 shadow-xl ${isSimulation ? 'fill-emerald-500' :
                                        isActive ? 'fill-slate-900 scale-110' :
                                            isHovered ? 'fill-slate-800' : 'fill-white stroke-slate-200'
                                    }`}
                                shadow-sm
                            />

                            {/* Icon Wrapper */}
                            <foreignObject x="-10" y="-10" width="20" height="20">
                                <node.icon
                                    className={`transition-all duration-500 ${isActive || isHovered ? 'text-white' : 'text-slate-400'}`}
                                    size={20}
                                />
                            </foreignObject>

                            {/* Label */}
                            <text
                                y="45"
                                textAnchor="middle"
                                className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${isActive ? 'fill-slate-900' : 'fill-slate-400'
                                    }`}
                            >
                                {node.label}
                            </text>

                            {/* Description Tooltip (Simplified for SVG) */}
                            {(isActive || isHovered) && (
                                <g transform="translate(35, -20)">
                                    <rect
                                        width="140"
                                        height="35"
                                        rx="10"
                                        fill="#0f172a"
                                        className="animate-fadeIn"
                                    />
                                    <text x="12" y="20" fill="white" className="text-[9px] font-medium italic opacity-80">
                                        {node.description}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Cross-Module Data Flow Indicators */}
            <div className="absolute top-12 right-12 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-lg">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-3">Cross-Module Links</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-medium text-slate-700">People (Dept/Custodian)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[9px] font-medium text-slate-700">Projects (Usage Requests)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-[9px] font-medium text-slate-700">Finance (Read-Only)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-[9px] font-medium text-slate-700">Operations (Usage Requests)</span>
                    </div>
                </div>
            </div>

            {/* Visual Stream Metadata */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Governance Pulse</p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter">Active Data Flow</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full border border-slate-200 shadow-inner" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Latent Dimension</span>
                        </div>
                    </div>
                </div>

                <div className="text-right max-w-xs">
                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-1 italic">Structural Linkage.</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Nodes automatically synchronize state via the cross-module data ribbon. Lifecycle: Get → Write → Lock → Use → Care → Check → Value → Close
                    </p>
                </div>
            </div>
        </div>
    );
}
