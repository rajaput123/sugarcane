/**
 * Department Types - People Module Only
 * 
 * Rule: Departments exist ONLY inside the People module.
 * All other modules must reference Department ID for ownership,
 * accountability, approvals, and reporting.
 */

export interface Department {
    id: string;
    name: string;
    code: string;
    parentId: string | null; // For hierarchy
    headEmployeeId: string | null; // Department head assignment
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface DepartmentHierarchy extends Department {
    children: DepartmentHierarchy[];
    level: number;
}

export interface DepartmentHead {
    departmentId: string;
    employeeId: string;
    assignedAt: string;
    assignedBy: string;
}

export interface ApprovalMapping {
    departmentId: string;
    roleId: string;
    approvalType: 'financial' | 'asset' | 'operational' | 'project';
    requiresDualApproval: boolean;
    createdAt: string;
}

export interface DepartmentKPI {
    departmentId: string;
    metric: string;
    value: number;
    target: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recordedAt: string;
}

