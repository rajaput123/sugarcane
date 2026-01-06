/**
 * Asset Types - Asset Governance Module Only
 * 
 * Rule: Asset Governance is sovereign and independent.
 * Other modules may REQUEST asset usage.
 * Only Asset Governance can authorize, lock, value, audit, or close assets.
 */

export type AssetLifecycleState = 
    | 'get'      // Acquire
    | 'write'    // Register
    | 'lock'     // Custody & Security
    | 'use'      // Authorized Usage
    | 'care'     // Maintenance & Preservation
    | 'check'    // Audit & Verification
    | 'value'    // Valuation
    | 'close';   // Dispose / Continue

export type AssetCategory = 
    | 'physical-general'
    | 'sacred-valuable'
    | 'property'
    | 'knowledge';

export type PhysicalAssetType = 
    | 'infrastructure'
    | 'fixed-installation'
    | 'movable'
    | 'furniture'
    | 'electronics'
    | 'decoration';

export type SacredAssetType = 
    | 'gold-jewelry'
    | 'silver-articles'
    | 'precious-stones'
    | 'mixed-artifacts'
    | 'sacred-regalia';

export interface Asset {
    id: string;
    name: string;
    category: AssetCategory;
    type: PhysicalAssetType | SacredAssetType | 'land' | 'building' | 'lease' | 'document' | 'image';
    lifecycleState: AssetLifecycleState;
    departmentId: string | null; // Reference to People module
    custodianId: string | null;
    vaultLocation?: string;
    currentValue: number;
    acquisitionDate: string;
    acquisitionCost: number;
    description?: string;
    images?: string[];
    documents?: string[];
    insurancePolicyId?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface AssetUsageRequest {
    id: string;
    assetId: string;
    requestingModule: 'Operations' | 'Projects' | 'Finance';
    requestingDepartmentId: string; // Reference to People module
    projectId?: string; // Reference to Projects module (if requestingModule is 'Projects')
    purpose: string;
    requestedBy: string;
    requestedAt: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    approvedBy?: string;
    approvedAt?: string;
    usageStartDate?: string;
    usageEndDate?: string;
    // Cross-module linkage
    financialTransactionId?: string; // Reference to Finance module (if applicable)
}

export interface AssetAudit {
    id: string;
    assetId: string;
    auditDate: string;
    auditorId: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
    wearLevel?: number; // 0-100
    damageDescription?: string;
    verificationStatus: 'verified' | 'discrepancy' | 'missing';
    notes?: string;
}

export interface AssetValuation {
    id: string;
    assetId: string;
    valuationDate: string;
    value: number;
    valuationMethod: 'market' | 'depreciation' | 'appraisal' | 'historical';
    valuatorId: string;
    notes?: string;
    // Cross-module linkage
    financialRecordId?: string; // Reference to Finance module for balance sheet integration
    eightyGCertificateId?: string; // Reference to Finance module for 80G benefits
}

// Asset Movement Tracking
export interface AssetMovement {
    id: string;
    assetId: string;
    fromLocation?: string;
    toLocation: string;
    fromCustodianId?: string;
    toCustodianId: string;
    movedBy: string;
    movedAt: string;
    reason: string;
    approvedBy?: string;
    // Links to other modules
    projectId?: string; // If movement is for a project
    operationId?: string; // If movement is for operations
}

// Asset Maintenance Record
export interface AssetMaintenance {
    id: string;
    assetId: string;
    maintenanceDate: string;
    maintenanceType: 'preventive' | 'corrective' | 'predictive';
    performedBy: string;
    cost?: number;
    nextMaintenanceDate?: string;
    notes?: string;
    // Links to Finance for cost tracking
    expenseTransactionId?: string;
}

