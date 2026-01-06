/**
 * Network Graph Component
 * 
 * Reusable network/graph visualization using react-flow
 */

'use client';

import React, { useCallback } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Background,
    Controls,
    MiniMap,
    Connection,
    addEdge,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface NetworkGraphProps {
    nodes: Node[];
    edges: Edge[];
    onNodeClick?: (node: Node) => void;
    className?: string;
    showControls?: boolean;
    showMinimap?: boolean;
}

export default function NetworkGraph({
    nodes: initialNodes,
    edges: initialEdges,
    onNodeClick,
    className = '',
    showControls = true,
    showMinimap = true,
}: NetworkGraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            if (onNodeClick) {
                onNodeClick(node);
            }
        },
        [onNodeClick]
    );

    return (
        <div className={`w-full h-[500px] rounded-lg ${className}`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                fitView
                className="bg-slate-50"
            >
                <Background />
                {showControls && <Controls />}
                {showMinimap && <MiniMap />}
            </ReactFlow>
        </div>
    );
}

