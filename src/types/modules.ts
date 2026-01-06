/**
 * Temple Management System - Module Definitions
 * 
 * Core principle: Modules are independent with controlled integrations
 */

export type ModuleName = 
    | 'Dashboard'
    | 'Operations'
    | 'People'
    | 'Finance'
    | 'Assets'
    | 'Projects';

export interface ModuleConfig {
    name: ModuleName;
    label: string;
    description: string;
    canModifyDepartments: boolean;
    canModifyAssets: boolean;
    canModifyFinancialRecords: boolean;
}

export const MODULE_CONFIG: Record<ModuleName, ModuleConfig> = {
    Dashboard: {
        name: 'Dashboard',
        label: 'Dashboard',
        description: 'Overview and cross-module insights',
        canModifyDepartments: false,
        canModifyAssets: false,
        canModifyFinancialRecords: false,
    },
    Operations: {
        name: 'Operations',
        label: 'Operations & Workflow',
        description: 'Daily, real-time execution of temple activities',
        canModifyDepartments: false,
        canModifyAssets: false, // Can only request asset usage
        canModifyFinancialRecords: false,
    },
    People: {
        name: 'People',
        label: 'People',
        description: 'Organizational core - departments live here',
        canModifyDepartments: true, // Only People module can modify departments
        canModifyAssets: false,
        canModifyFinancialRecords: false,
    },
    Finance: {
        name: 'Finance',
        label: 'Finance',
        description: 'Transparent, auditable financial governance',
        canModifyDepartments: false,
        canModifyAssets: false,
        canModifyFinancialRecords: true, // But immutable after audit closure
    },
    Assets: {
        name: 'Assets',
        label: 'Asset Governance',
        description: 'Independent core - custodial responsibilities',
        canModifyDepartments: false,
        canModifyAssets: true, // Only Asset Governance can modify assets
        canModifyFinancialRecords: false,
    },
    Projects: {
        name: 'Projects',
        label: 'Projects & Initiatives',
        description: 'Time-bound orchestration across modules',
        canModifyDepartments: false,
        canModifyAssets: false, // Can only request asset usage
        canModifyFinancialRecords: false,
    },
};

