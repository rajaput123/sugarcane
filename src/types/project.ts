/**
 * Project Types
 * 
 * Rule: Projects are time-bound orchestrators.
 * Projects coordinate Operations, People, Finance, and Assets.
 * Projects do NOT own permanent data.
 */

export type ProjectType = 
    | 'festival'
    | 'utsavam'
    | 'event'
    | 'infrastructure'
    | 'renovation'
    | 'initiative'
    | 'campaign';

export type ProjectStatus = 
    | 'planning'
    | 'approved'
    | 'in-progress'
    | 'on-hold'
    | 'completed'
    | 'cancelled';

export interface Project {
    id: string;
    name: string;
    type: ProjectType;
    description: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    departmentId: string; // Reference to People module
    budgetId?: string; // Reference to Finance module
    coordinatorId: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface ProjectTask {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    assignedToDepartmentId: string;
    assignedToEmployeeId?: string;
    status: 'todo' | 'in-progress' | 'completed' | 'blocked';
    dueDate?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectAssetRequest {
    id: string;
    projectId: string;
    assetId: string;
    requestedBy: string;
    requestedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    usageStartDate?: string;
    usageEndDate?: string;
}

export interface ProjectFinancialAllocation {
    id: string;
    projectId: string;
    budgetId: string;
    allocatedAmount: number;
    spentAmount: number;
    allocatedAt: string;
    allocatedBy: string;
}

export interface SafetyCompliance {
    id: string;
    projectId: string;
    complianceType: 'safety' | 'legal' | 'permission' | 'environmental';
    requirement: string;
    status: 'pending' | 'submitted' | 'approved' | 'rejected';
    submittedAt?: string;
    approvedAt?: string;
    approvedBy?: string;
    documentUrl?: string;
}

