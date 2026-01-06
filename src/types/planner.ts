/**
 * Planner Action Types - MainCanvas Planner Actions
 * 
 * Planner actions are interactive items that can be:
 * - Edited
 * - Assigned to employees with dates
 * - Added
 * - Deleted
 */

export interface PlannerAction {
    id: string;
    content: string; // The action text
    assignedToEmployeeId?: string; // Optional employee assignment
    assignedToEmployeeName?: string; // Employee name for display
    dueDate?: string; // Due date for the action
    startDate?: string; // Start date for the action
    isCompleted: boolean;
    isDirective?: boolean; // If true, treated as CEO directive
    priority?: 'critical' | 'high' | 'medium' | 'low';
    departmentId?: string; // Owning department
    status?: 'pending' | 'in-progress' | 'completed' | 'blocked';
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface PlannerActionAssignment {
    actionId: string;
    employeeId: string;
    employeeName: string;
    startDate: string;
    dueDate?: string;
    assignedBy: string;
    assignedAt: string;
}

export interface CEOCard {
    id: string;
    type: 'appointment' | 'ritual' | 'review' | 'event';
    subject: string;
    dateTime: string;
    intent: string;
    plannedBy: string;
    visibility: string;
}

