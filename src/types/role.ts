/**
 * Role & Authority Types - People Module
 * 
 * Core Principles:
 * 1. Roles define authority, not identity
 * 2. Roles are always assigned to employees, never standalone
 * 3. Role authority is scoped by Department
 * 4. Only one PRIMARY role per department per employee
 * 5. Every role assignment must be time-bound and auditable
 * 6. No task, approval, or override without a role
 */

export type RoleCategory = 
    | 'operational'
    | 'supervisory'
    | 'administrative'
    | 'audit';

export type PermissionType = 
    | 'view'
    | 'create'
    | 'assign'
    | 'approve'
    | 'modify'
    | 'close'
    | 'override';

export type RoleAssignmentType = 
    | 'primary'
    | 'secondary';

export type ApprovalType = 
    | 'task-assignment'
    | 'task-closure'
    | 'department-override'
    | 'emergency-override';

export interface Role {
    id: string;
    name: string; // Unique
    category: RoleCategory;
    description?: string;
    isActive: boolean;
    permissions: RolePermission[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface RoleDepartmentMapping {
    id: string;
    roleId: string;
    departmentId: string;
    isValid: boolean;
    createdAt: string;
    createdBy: string;
}

export interface RolePermission {
    id: string;
    roleId: string;
    permissionType: PermissionType;
    scope: 'Operations' | 'Finance' | 'Assets' | 'Projects' | 'People' | 'All';
    createdAt: string;
    createdBy: string;
}

export interface RoleAssignment {
    id: string;
    employeeId: string;
    departmentId: string;
    roleId: string;
    assignmentType: RoleAssignmentType;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    assignedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApprovalAuthority {
    id: string;
    roleId: string;
    approvalType: ApprovalType;
    approvalLevel: number; // Hierarchy level (1 = highest)
    requiresDualApproval: boolean;
    canOverride: boolean;
    createdAt: string;
    createdBy: string;
}

export interface EmployeeReadiness {
    employeeId: string;
    departmentId: string;
    isReady: boolean;
    readinessReasons: string[]; // Reasons why ready/not ready
    lastCheckedAt: string;
    checkedBy: string;
}
