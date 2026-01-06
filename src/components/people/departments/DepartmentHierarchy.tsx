import React from 'react';
import { ChevronRight, Building2 } from 'lucide-react';
import { DepartmentHierarchy as DepartmentHierarchyType } from '@/types/department';

interface DepartmentHierarchyProps {
    hierarchy: DepartmentHierarchyType[];
    onSelect?: (departmentId: string) => void;
}

const DepartmentNode = ({ dept, level, onSelect }: { dept: DepartmentHierarchyType; level: number; onSelect?: (id: string) => void }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);

    return (
        <div>
            <div
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer ${level > 0 ? 'ml-6' : ''}`}
                onClick={() => onSelect?.(dept.id)}
            >
                {dept.children.length > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-0.5 hover:bg-neutral-100 rounded transition-colors"
                    >
                        <ChevronRight size={14} className={`text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                )}
                {dept.children.length === 0 && <div className="w-4" />}
                <Building2 size={16} className="text-neutral-400" />
                <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-900">{dept.name}</div>
                    <div className="text-xs text-neutral-500">{dept.code}</div>
                </div>
                {!dept.isActive && (
                    <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded">Inactive</span>
                )}
            </div>
            {isExpanded && dept.children.length > 0 && (
                <div className="ml-2 border-l border-neutral-200">
                    {dept.children.map((child) => (
                        <DepartmentNode key={child.id} dept={child} level={level + 1} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function DepartmentHierarchy({ hierarchy, onSelect }: DepartmentHierarchyProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">Department Hierarchy</h3>
            <div className="space-y-1">
                {hierarchy.length === 0 ? (
                    <div className="text-center py-8 text-sm text-neutral-500">
                        No departments found.
                    </div>
                ) : (
                    hierarchy.map((dept) => (
                        <DepartmentNode key={dept.id} dept={dept} level={0} onSelect={onSelect} />
                    ))
                )}
            </div>
        </div>
    );
}

