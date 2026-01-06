/**
 * Employee Types - People Module Only
 * 
 * Rule: Employees must have email, password, and department assignment.
 * Department assignment is mandatory during creation.
 * Role assignment is optional during creation.
 */

export interface Employee {
    id: string;
    name: string;
    email: string; // Unique, required for authentication
    passwordHash: string; // Hashed password
    departmentId: string; // Required - must be assigned during creation
    employeeId?: string; // Optional employee ID
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface EmployeeWithRole extends Employee {
    currentRoleAssignments: Array<{
        roleId: string;
        roleName: string;
        departmentId: string;
        assignmentType: 'primary' | 'secondary';
        startDate: string;
        endDate?: string;
        isActive: boolean;
    }>;
}

