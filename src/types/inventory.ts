/**
 * Inventory Management Types
 * 
 * Types for Temple Inventory Management module following core principles:
 * - Inventory exists to support rituals, not commerce
 * - Sacred items have higher priority
 * - Festival demand is fundamentally different
 * - Donation-in-kind items must be respected
 */

export type ItemCategory = 'ritual' | 'kitchen' | 'cleaning' | 'safety' | 'festival';
export type SacredStatus = 'sacred' | 'non-sacred';
export type StockStatus = 'OK' | 'Low' | 'Critical';
export type ConsumptionType = 'ritual' | 'kitchen' | 'festival' | 'cleaning' | 'safety';
export type SourceType = 'vendor' | 'donation';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type FestivalReadinessStatus = 'ready' | 'partial' | 'not-ready';

// Tab 2: Items
export interface InventoryItem {
    id: string;
    name: string;
    category: ItemCategory;
    unit: string; // e.g., 'kg', 'liters', 'pieces', 'packets'
    sacredStatus: SacredStatus;
    shelfLife?: number; // days (if applicable)
    description?: string;
    createdAt: string;
    updatedAt: string;
    // Sacred marking cannot be changed casually
    // Units cannot be altered without approval
}

// Tab 3: Stock Status
export interface StockStatusItem {
    itemId: string;
    itemName: string;
    category: ItemCategory;
    sacredStatus: SacredStatus;
    currentStock: number;
    unit: string;
    minimumRequired: number; // Minimum required for uninterrupted operations
    reservedQuantity: number; // Reserved from approved plans (Kitchen, Festival)
    availableBalance: number; // currentStock - reservedQuantity (must never go negative)
    status: StockStatus;
    lastUpdated: string;
}

// Tab 4: Consumption
export interface ConsumptionRecord {
    id: string;
    itemId: string;
    itemName: string;
    category: ItemCategory;
    consumptionType: ConsumptionType;
    quantity: number;
    unit: string;
    date: string; // ISO date
    referenceId?: string; // Reference to ritual, kitchen plan, festival plan
    referenceType?: 'ritual' | 'kitchen-plan' | 'festival-plan' | 'cleaning-schedule';
    plannedQuantity?: number; // If from a plan
    actualQuantity: number;
    deviation?: number; // actual - planned
    notes?: string;
}

// Tab 5: Sources (Vendors & Donations)
export interface Vendor {
    id: string;
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    itemsSupplied: string[]; // Item IDs
    reliabilityScore?: number; // 1-10 based on history
    lastOrderDate?: string;
    notes?: string;
}

export interface DonationEntry {
    id: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unit: string;
    donorName: string;
    donorContact?: string;
    receivedDate: string; // ISO date
    receivedBy: string; // Employee ID
    notes?: string;
    // Donation does not imply unrestricted usage
    usageRestrictions?: string;
}

// Tab 6: Alerts & Replenishment
export interface InventoryAlert {
    id: string;
    itemId: string;
    itemName: string;
    category: ItemCategory;
    sacredStatus: SacredStatus;
    severity: AlertSeverity;
    type: 'low-stock' | 'critical-stock' | 'reservation-conflict' | 'consumption-deviation' | 'expiry-warning';
    message: string;
    currentStock?: number;
    minimumRequired?: number;
    reservedQuantity?: number;
    availableBalance?: number;
    createdAt: string;
    acknowledged?: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
}

export interface StockAdjustment {
    id: string;
    itemId: string;
    itemName: string;
    adjustmentType: 'Addition' | 'Deduction';
    quantity: number;
    reason: string;
    performedBy: string;
    date: string;
    notes?: string;
}

export interface ReplenishmentRequest {
    id: string;
    itemId: string;
    itemName: string;
    requestedQuantity: number;
    unit: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    reason: string;
    requestedBy: string;
    requestedAt: string;
    status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
    approvedBy?: string;
    approvedAt?: string;
    vendorId?: string;
    expectedDeliveryDate?: string;
}

// Tab 7: Festival Readiness
export interface FestivalRequirement {
    festivalId: string;
    festivalName: string;
    startDate: string;
    endDate: string;
    items: FestivalItemRequirement[];
}

export interface FestivalItemRequirement {
    itemId: string;
    itemName: string;
    category: ItemCategory;
    sacredStatus: SacredStatus;
    requiredQuantity: number;
    unit: string;
    currentStock: number;
    reservedQuantity: number;
    shortfall: number; // requiredQuantity - (currentStock - reservedQuantity)
    status: FestivalReadinessStatus;
    priority: 'critical' | 'high' | 'medium'; // Based on sacred status and shortfall
}

// Tab 8: Review & Audit
export interface InventoryAudit {
    id: string;
    auditDate: string;
    conductedBy: string;
    items: AuditItem[];
    discrepancies: AuditDiscrepancy[];
    notes?: string;
    status: 'draft' | 'completed' | 'approved';
}

export interface AuditItem {
    itemId: string;
    itemName: string;
    recordedStock: number; // System recorded
    physicalStock: number; // Actually counted
    variance: number; // physical - recorded
    unit: string;
}

export interface AuditDiscrepancy {
    itemId: string;
    itemName: string;
    variance: number;
    severity: 'minor' | 'significant' | 'critical';
    explanation?: string;
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: string;
}

export interface ConsumptionReview {
    id: string;
    reviewPeriod: string; // e.g., "January 2024"
    items: ConsumptionReviewItem[];
    totalDeviations: number;
    flaggedItems: string[]; // Item IDs with significant deviations
    reviewedBy?: string;
    reviewedAt?: string;
}

export interface ConsumptionReviewItem {
    itemId: string;
    itemName: string;
    plannedConsumption: number;
    actualConsumption: number;
    deviation: number;
    deviationPercentage: number;
    unit: string;
}

