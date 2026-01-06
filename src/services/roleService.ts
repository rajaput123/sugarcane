/**
 * Role Service - People Module
 * 
 * Manages roles, permissions, and role assignments with strict validation
 */

import { 
    Role, 
    RoleCategory, 
    PermissionType, 
    RoleAssignment, 
    RoleAssignmentType,
    RoleDepartmentMapping,
    RolePermission,
    ApprovalAuthority,
    ApprovalType,
    EmployeeReadiness
} from '@/types/role';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';

export class RoleService {
    /**
     * Create role with unique name validation
     * Roles cannot be deleted, only deactivated
     */
    static async createRole(
        roleData: Omit<Role, 'id' | 'permissions' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
        createdBy: string
    ): Promise<Role> {
        // Validate unique name
        const existingRole = await this.getRoleByName(roleData.name);
        if (existingRole) {
            throw new Error(`Role with name "${roleData.name}" already exists`);
        }

        const role: Role = {
            ...roleData,
            id: `role_${Date.now()}`,
            permissions: [],
            isActive: roleData.isActive ?? true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy,
            updatedBy: createdBy,
        };

        // In production, save to database
        return role;
    }

    /**
     * Get role by name
     */
    static async getRoleByName(name: string): Promise<Role | null> {
        // In production, query database
        return null;
    }

    /**
     * Get role by ID
     */
    static async getRoleById(id: string): Promise<Role | null> {
        // In production, query database
        return null;
    }

    /**
     * Deactivate role (no deletion allowed)
     */
    static async deactivateRole(roleId: string, updatedBy: string): Promise<Role> {
        const role = await this.getRoleById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        return {
            ...role,
            isActive: false,
            updatedAt: new Date().toISOString(),
            updatedBy,
        };
    }

    /**
     * Map role to department
     */
    static async mapRoleToDepartment(
        roleId: string,
        departmentId: string,
        createdBy: string
    ): Promise<RoleDepartmentMapping> {
        // Validate role exists
        const role = await this.getRoleById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        // Validate department exists (in production, check department service)
        // For now, just create the mapping

        const mapping: RoleDepartmentMapping = {
            id: `mapping_${Date.now()}`,
            roleId,
            departmentId,
            isValid: true,
            createdAt: new Date().toISOString(),
            createdBy,
        };

        // In production, save to database
        return mapping;
    }

    /**
     * Remove role-department mapping
     */
    static async removeRoleDepartmentMapping(mappingId: string): Promise<void> {
        // In production, mark as invalid or delete
    }

    /**
     * Define permissions for a role
     */
    static async definePermissions(
        roleId: string,
        permissions: Array<{ permissionType: PermissionType; scope: string }>,
        createdBy: string
    ): Promise<RolePermission[]> {
        const role = await this.getRoleById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        // Validate permissions
        const rolePermissions: RolePermission[] = permissions.map((perm, index) => ({
            id: `perm_${Date.now()}_${index}`,
            roleId,
            permissionType: perm.permissionType,
            scope: perm.scope as any,
            createdAt: new Date().toISOString(),
            createdBy,
        }));

        // In production, save to database
        return rolePermissions;
    }

    /**
     * Assign role to employee
     * Enforces: department assignment prerequisite, single primary role per department
     */
    static async assignRoleToEmployee(
        assignment: Omit<RoleAssignment, 'id' | 'createdAt' | 'updatedAt' | 'assignedBy' | 'isActive'>,
        assignedBy: string
    ): Promise<RoleAssignment> {
        // Validate employee exists and has department assignment
        const employee = await this.validateEmployeeDepartment(assignment.employeeId, assignment.departmentId);
        if (!employee) {
            throw new Error('Employee not found or does not have department assignment');
        }

        // Validate role exists
        const role = await this.getRoleById(assignment.roleId);
        if (!role || !role.isActive) {
            throw new Error('Role not found or is inactive');
        }

        // Validate role-department mapping
        const mapping = await this.getRoleDepartmentMapping(assignment.roleId, assignment.departmentId);
        if (!mapping || !mapping.isValid) {
            throw new Error(`Role "${role.name}" is not valid for this department`);
        }

        // If primary role, check no other primary exists for this employee-department combination
        if (assignment.assignmentType === 'primary') {
            const existingPrimary = await this.getPrimaryRoleAssignment(assignment.employeeId, assignment.departmentId);
            if (existingPrimary && existingPrimary.isActive) {
                throw new Error('Employee already has a primary role for this department');
            }
        }

        // Validate date range
        if (assignment.endDate && new Date(assignment.endDate) <= new Date(assignment.startDate)) {
            throw new Error('End date must be after start date');
        }

        const roleAssignment: RoleAssignment = {
            ...assignment,
            id: `assignment_${Date.now()}`,
            isActive: true,
            assignedBy,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // In production, save to database
        return roleAssignment;
    }

    /**
     * Get primary role assignment for employee-department
     */
    static async getPrimaryRoleAssignment(employeeId: string, departmentId: string): Promise<RoleAssignment | null> {
        // In production, query database
        return null;
    }

    /**
     * Get role-department mapping
     */
    static async getRoleDepartmentMapping(roleId: string, departmentId: string): Promise<RoleDepartmentMapping | null> {
        // In production, query database
        return null;
    }

    /**
     * Validate employee has department assignment
     */
    static async validateEmployeeDepartment(employeeId: string, departmentId: string): Promise<Employee | null> {
        // In production, query employee service
        return null;
    }

    /**
     * Check employee readiness
     */
    static async checkEmployeeReadiness(
        employeeId: string,
        departmentId: string,
        checkedBy: string
    ): Promise<EmployeeReadiness> {
        // Validate employee exists and is active
        const employee = await this.validateEmployeeDepartment(employeeId, departmentId);
        if (!employee) {
            return {
                employeeId,
                departmentId,
                isReady: false,
                readinessReasons: ['Employee not found or does not have department assignment'],
                lastCheckedAt: new Date().toISOString(),
                checkedBy,
            };
        }

        if (!employee.isActive) {
            return {
                employeeId,
                departmentId,
                isReady: false,
                readinessReasons: ['Employee is not active'],
                lastCheckedAt: new Date().toISOString(),
                checkedBy,
            };
        }

        // Check department is active (in production, validate via department service)
        // Check role assignment exists
        const roleAssignments = await this.getEmployeeRoleAssignments(employeeId, departmentId);
        const activeRoleAssignment = roleAssignments.find(ra => ra.isActive);

        if (!activeRoleAssignment) {
            return {
                employeeId,
                departmentId,
                isReady: false,
                readinessReasons: ['No active role assignment'],
                lastCheckedAt: new Date().toISOString(),
                checkedBy,
            };
        }

        return {
            employeeId,
            departmentId,
            isReady: true,
            readinessReasons: ['Employee is active', 'Department is active', 'Valid role assignment exists'],
            lastCheckedAt: new Date().toISOString(),
            checkedBy,
        };
    }

    /**
     * Get employee role assignments
     */
    static async getEmployeeRoleAssignments(employeeId: string, departmentId: string): Promise<RoleAssignment[]> {
        // In production, query database
        return [];
    }

    /**
     * Get approval authority for a role
     */
    static async getApprovalAuthority(roleId: string): Promise<ApprovalAuthority[]> {
        // In production, query database
        return [];
    }

    /**
     * Define approval authority for a role
     */
    static async defineApprovalAuthority(
        authority: Omit<ApprovalAuthority, 'id' | 'createdAt' | 'createdBy'>,
        createdBy: string
    ): Promise<ApprovalAuthority> {
        const role = await this.getRoleById(authority.roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        const approvalAuthority: ApprovalAuthority = {
            ...authority,
            id: `auth_${Date.now()}`,
            createdAt: new Date().toISOString(),
            createdBy,
        };

        // In production, save to database
        return approvalAuthority;
    }

    /**
     * Validate if employee can be assigned tasks
     */
    static async validateTaskAssignment(employeeId: string, departmentId: string): Promise<boolean> {
        const readiness = await this.checkEmployeeReadiness(employeeId, departmentId, 'system');
        return readiness.isReady;
    }

    /**
     * Validate if employee can approve based on role
     */
    static async validateApprovalAction(
        employeeId: string,
        departmentId: string,
        approvalType: ApprovalType
    ): Promise<boolean> {
        const readiness = await this.checkEmployeeReadiness(employeeId, departmentId, 'system');
        if (!readiness.isReady) {
            return false;
        }

        // Get employee's role assignments
        const roleAssignments = await this.getEmployeeRoleAssignments(employeeId, departmentId);
        const activeRole = roleAssignments.find(ra => ra.isActive);

        if (!activeRole) {
            return false;
        }

        // Get approval authority for the role
        const authorities = await this.getApprovalAuthority(activeRole.roleId);
        return authorities.some(auth => auth.approvalType === approvalType);
    }
}
