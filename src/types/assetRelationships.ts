/**
 * Asset Relationship Types
 * 
 * Documents all cross-module data linkages for assets
 */

import { Asset } from './asset';
import { Department } from './department';
import { Project } from './project';
import { FinancialTransaction } from './finance';

/**
 * Complete asset with all relationship data
 */
export interface AssetWithRelationships extends Asset {
    // People Module Relationships
    department?: Department | null;
    custodian?: {
        id: string;
        name: string;
        departmentId: string;
    } | null;
    
    // Projects Module Relationships
    activeProjectUsage?: {
        projectId: string;
        projectName: string;
        usageStartDate: string;
        usageEndDate?: string;
    } | null;
    
    // Finance Module Relationships
    financialRecords?: {
        acquisitionTransaction?: FinancialTransaction;
        valuationRecords: Array<{
            id: string;
            value: number;
            date: string;
        }>;
        maintenanceExpenses: Array<{
            id: string;
            amount: number;
            date: string;
        }>;
    };
    
    // Operations Module Relationships
    operationalUsage?: {
        operationType: string;
        lastUsed: string;
        usageCount: number;
    } | null;
}

/**
 * Relationship validation result
 */
export interface RelationshipValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Data flow between modules
 */
export interface AssetDataFlow {
    fromModule: 'People' | 'Finance' | 'Projects' | 'Operations' | 'Assets';
    toModule: 'People' | 'Finance' | 'Projects' | 'Operations' | 'Assets';
    flowType: 'read' | 'request' | 'reference' | 'notification';
    description: string;
    dataFields: string[];
}

