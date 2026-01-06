/**
 * Finance Types
 * 
 * Rule: Financial records are immutable after audit closure.
 * All transactions must reference Department ID for accountability.
 */

export type TransactionType = 
    | 'donation'
    | 'event-donation'
    | 'initiative-donation'
    | 'seva-payment'
    | 'expense'
    | 'revenue'
    | 'transfer';

export type TransactionStatus = 
    | 'draft'
    | 'pending-approval'
    | 'approved'
    | 'rejected'
    | 'completed'
    | 'audit-closed'; // Immutable after this

export interface FinancialTransaction {
    id: string;
    type: TransactionType;
    amount: number;
    currency: string;
    departmentId: string; // Reference to People module
    projectId?: string; // Reference to Projects module
    description: string;
    status: TransactionStatus;
    transactionDate: string;
    receiptNumber?: string;
    receiptIssued: boolean;
    eightyGCertificateIssued: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditClosedAt?: string;
    auditClosedBy?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface Donation extends FinancialTransaction {
    type: 'donation' | 'event-donation' | 'initiative-donation';
    donorName: string;
    donorContact?: string;
    donorEmail?: string;
    donorAddress?: string;
    panNumber?: string;
    eventId?: string;
    initiativeId?: string;
}

export interface Expense extends FinancialTransaction {
    type: 'expense';
    vendorId: string;
    vendorName: string;
    category: string;
    invoiceNumber?: string;
    invoiceDate?: string;
}

export interface Budget {
    id: string;
    departmentId: string;
    projectId?: string;
    fiscalYear: string;
    category: string;
    allocatedAmount: number;
    spentAmount: number;
    remainingAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface EightyGCertificate {
    id: string;
    transactionId: string;
    certificateNumber: string;
    issuedDate: string;
    issuedBy: string;
    donorName: string;
    amount: number;
    financialYear: string;
}

