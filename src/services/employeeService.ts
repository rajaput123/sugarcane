/**
 * Employee Service - People Module Only
 * 
 * Handles employee creation with:
 * - Email uniqueness validation
 * - Password hashing
 * - Mandatory department assignment
 * - Optional role assignment
 */

import { Employee, EmployeeWithRole } from '@/types/employee';
import { Department } from '@/types/department';
import { RoleAssignment } from '@/types/role';

export class EmployeeService {
    /**
     * Create employee with email, password, and mandatory department
     */
    static async createEmployee(
        employeeData: Omit<Employee, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
        password: string,
        createdBy: string,
        roleAssignment?: Omit<RoleAssignment, 'id' | 'createdAt' | 'updatedAt' | 'assignedBy' | 'isActive'>
    ): Promise<Employee> {
        // Validate email uniqueness
        const existingEmployee = await this.getEmployeeByEmail(employeeData.email);
        if (existingEmployee) {
            throw new Error(`Employee with email ${employeeData.email} already exists`);
        }

        // Validate password strength
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        }

        // Hash password (in production, use bcrypt or similar)
        const passwordHash = await this.hashPassword(password);

        // Validate department exists and is active
        const department = await this.validateDepartment(employeeData.departmentId);
        if (!department || !department.isActive) {
            throw new Error(`Department ${employeeData.departmentId} does not exist or is not active`);
        }

        // Create employee
        const employee: Employee = {
            id: `emp-${Date.now()}`,
            ...employeeData,
            passwordHash,
            isActive: employeeData.isActive ?? true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy,
            updatedBy: createdBy,
        };

        // If role assignment provided, validate and assign
        if (roleAssignment) {
            // Role assignment will be handled by RoleService
            // This is just for validation during employee creation
            if (roleAssignment.departmentId !== employeeData.departmentId) {
                throw new Error('Role assignment department must match employee department');
            }
        }

        // In production, save to database
        // For now, return the employee object
        return employee;
    }

    /**
     * Get employee by email (for authentication)
     */
    static async getEmployeeByEmail(email: string): Promise<Employee | null> {
        // In production, query database
        return null;
    }

    /**
     * Get employee by ID
     */
    static async getEmployeeById(id: string): Promise<Employee | null> {
        // In production, query database
        return null;
    }

    /**
     * Update employee
     */
    static async updateEmployee(
        id: string,
        updates: Partial<Omit<Employee, 'id' | 'passwordHash' | 'createdAt' | 'createdBy'>>,
        updatedBy: string
    ): Promise<Employee> {
        const employee = await this.getEmployeeById(id);
        if (!employee) {
            throw new Error('Employee not found');
        }

        // If email is being updated, validate uniqueness
        if (updates.email && updates.email !== employee.email) {
            const existing = await this.getEmployeeByEmail(updates.email);
            if (existing) {
                throw new Error(`Email ${updates.email} is already in use`);
            }
        }

        // In production, update in database
        return {
            ...employee,
            ...updates,
            updatedAt: new Date().toISOString(),
            updatedBy,
        };
    }

    /**
     * Validate department exists and is active
     */
    static async validateDepartment(departmentId: string): Promise<Department | null> {
        // In production, query department service
        return null;
    }

    /**
     * Hash password (placeholder - use bcrypt in production)
     */
    private static async hashPassword(password: string): Promise<string> {
        // In production, use bcrypt or similar
        // For now, return a placeholder hash
        return `hashed_${password}`;
    }

    /**
     * Verify password
     */
    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        // In production, use bcrypt.compare
        return hash === `hashed_${password}`;
    }

    /**
     * Get employee with roles
     */
    static async getEmployeeWithRoles(employeeId: string): Promise<EmployeeWithRole | null> {
        const employee = await this.getEmployeeById(employeeId);
        if (!employee) {
            return null;
        }

        // In production, fetch role assignments
        return {
            ...employee,
            currentRoleAssignments: [],
        };
    }
}

