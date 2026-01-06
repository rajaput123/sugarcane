/**
 * Asset Relationship Service
 * 
 * Validates and manages cross-module relationships for assets
 */

import { Asset } from '@/types/asset';
import { Department } from '@/types/department';
import { Project } from '@/types/project';
import { RelationshipValidation } from '@/types/assetRelationships';

export class AssetRelationshipService {
    /**
     * Validate department reference
     */
    static async validateDepartmentReference(
        departmentId: string | null
    ): Promise<RelationshipValidation> {
        if (!departmentId) {
            return {
                isValid: true, // Null is allowed (unassigned)
                errors: [],
                warnings: ['Asset has no department assignment']
            };
        }

        // In production, this would check if department exists
        // For now, return valid
        return {
            isValid: true,
            errors: [],
            warnings: []
        };
    }

    /**
     * Validate custodian reference
     */
    static async validateCustodianReference(
        custodianId: string | null,
        departmentId: string | null
    ): Promise<RelationshipValidation> {
        if (!custodianId) {
            return {
                isValid: true,
                errors: [],
                warnings: []
            };
        }

        // In production, validate custodian exists and belongs to department
        return {
            isValid: true,
            errors: [],
            warnings: []
        };
    }

    /**
     * Validate asset can be used by requesting module
     */
    static async validateModuleRequest(
        asset: Asset,
        requestingModule: 'Operations' | 'Projects' | 'Finance',
        requestingDepartmentId: string
    ): Promise<RelationshipValidation> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Asset must be in a usable state
        if (!['use', 'lock'].includes(asset.lifecycleState)) {
            errors.push(`Asset must be in 'use' or 'lock' state. Current state: ${asset.lifecycleState}`);
        }

        // Department must be valid
        const deptValidation = await this.validateDepartmentReference(requestingDepartmentId);
        if (!deptValidation.isValid) {
            errors.push(...deptValidation.errors);
        }

        // Asset should have a department assignment
        if (!asset.departmentId) {
            warnings.push('Asset has no department assignment');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Get all relationships for an asset
     */
    static async getAssetRelationships(assetId: string): Promise<{
        department?: Department;
        projectUsages: any[];
        financialRecords: any[];
        operationalUsages: any[];
    }> {
        // In production, fetch from API
        return {
            projectUsages: [],
            financialRecords: [],
            operationalUsages: []
        };
    }
}

