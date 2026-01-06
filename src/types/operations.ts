/**
 * Operations Module Type Definitions
 * 
 * Type definitions for all Operations sub-modules
 */

// Operational Planning
export interface ScheduledActivity {
    id: string;
    title: string;
    type: 'ritual' | 'seva' | 'event' | 'maintenance';
    startTime: string; // ISO datetime
    endTime: string; // ISO datetime
    location: string;
    assignedResources: string[]; // Resource IDs
    dependencies: string[]; // Activity IDs this depends on
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
}

export interface Resource {
    id: string;
    name: string;
    type: 'priest' | 'staff' | 'facility' | 'equipment';
    availability: 'available' | 'busy' | 'unavailable';
    currentAssignment?: string; // Activity ID
}

// Task Management
export interface Task {
    id: string;
    title: string;
    description: string;
    assigneeId?: string;
    assigneeName?: string;
    dueDate: string; // ISO date
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in-progress' | 'completed' | 'blocked';
    dependencies: string[]; // Task IDs this depends on
    workflowId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    status: 'draft' | 'active' | 'archived';
}

export interface WorkflowStep {
    id: string;
    name: string;
    order: number;
    dependencies: string[]; // Step IDs
    assigneeRole?: string;
}

// Booking Management
export interface Booking {
    id: string;
    bookingType: 'accommodation' | 'event' | 'hall';
    resourceId: string;
    resourceName: string;
    guestName: string;
    contactNumber: string;
    checkInDate?: string; // ISO date (for accommodation)
    checkOutDate?: string; // ISO date (for accommodation)
    eventDate?: string; // ISO date (for events)
    eventTime?: string;
    numberOfGuests?: number;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    amount?: number;
    createdAt: string;
}

// Kitchen & Prasad
export interface ProductionSchedule {
    id: string;
    date: string; // ISO date
    recipeId: string;
    recipeName: string;
    plannedQuantity: number;
    actualQuantity?: number;
    status: 'planned' | 'in-progress' | 'completed';
    qualityScore?: number; // 1-10
    notes?: string;
}

export interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: RecipeIngredient[];
    instructions: string[];
    servingSize: number;
}

export interface RecipeIngredient {
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
}

// Inventory Management
export interface InventoryItem {
    id: string;
    name: string;
    category: 'perishable' | 'non-perishable' | 'ritual' | 'equipment';
    currentStock: number;
    unit: string;
    reorderPoint: number;
    reorderQuantity: number;
    supplierId?: string;
    supplierName?: string;
    lastRestocked?: string; // ISO date
    consumptionRate?: number; // per day
}

export interface InventoryTransaction {
    id: string;
    itemId: string;
    itemName: string;
    type: 'purchase' | 'consumption' | 'adjustment' | 'waste';
    quantity: number;
    date: string; // ISO date
    notes?: string;
}

// Facilities Management
export interface Facility {
    id: string;
    name: string;
    type: 'hall' | 'room' | 'area' | 'building';
    capacity?: number;
    location: string;
    status: 'operational' | 'maintenance' | 'closed';
    lastMaintenance?: string; // ISO date
    nextMaintenance?: string; // ISO date
}

export interface MaintenanceRecord {
    id: string;
    facilityId: string;
    facilityName: string;
    type: 'scheduled' | 'emergency' | 'repair';
    scheduledDate: string; // ISO date
    completedDate?: string; // ISO date
    status: 'scheduled' | 'in-progress' | 'completed';
    cost?: number;
    description: string;
    technician?: string;
}

export interface FacilityIssue {
    id: string;
    facilityId: string;
    facilityName: string;
    reportedBy: string;
    reportedDate: string; // ISO date
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    resolvedDate?: string; // ISO date
}

// Queue & Token Management
export interface Token {
    id: string;
    tokenNumber: string;
    queueType: 'darshan' | 'seva' | 'prasad' | 'accommodation';
    issuedAt: string; // ISO datetime
    estimatedWaitTime?: number; // minutes
    actualWaitTime?: number; // minutes
    status: 'waiting' | 'processing' | 'completed' | 'cancelled';
    completedAt?: string; // ISO datetime
}

export interface QueueStatus {
    queueType: string;
    currentPosition: number;
    averageWaitTime: number; // minutes
    totalWaiting: number;
    totalProcessing: number;
}

// Crowd & Capacity Management
export interface Zone {
    id: string;
    name: string;
    type: 'darshan' | 'seva' | 'prasad' | 'parking' | 'general';
    maxCapacity: number;
    currentCount: number;
    status: 'normal' | 'crowded' | 'full' | 'closed';
    lastUpdated: string; // ISO datetime
}

export interface CrowdSnapshot {
    id: string;
    timestamp: string; // ISO datetime
    zones: Zone[];
    totalCount: number;
    totalCapacity: number;
}

// ------------------------------------------------------------------
// NEW KITCHEN & PRASAD MODULE TYPES (Sacred Operations Logbook)
// ------------------------------------------------------------------

export type DayType = 'Normal' | 'Festival' | 'Special Ritual';
export type PlanStatus = 'Draft' | 'Approved' | 'Locked';
export type BatchStatus = 'Planned' | 'Cooking' | 'Quality Check' | 'Completed' | 'Failed';
export type QualityStatus = 'Pending' | 'Passed' | 'Attention' | 'Failed';
export type DistributionStatus = 'Active' | 'Paused' | 'Completed';

// Tab 2: Planning
export interface KitchenDailyPlan {
    id: string;
    date: string; // ISO date
    dayType: DayType;
    specialOccasion?: string;
    expectedDevotees: number;
    headCookId: string;
    plannedItems: PlannedItem[];
    status: PlanStatus;
    approvedBy?: string;
    approvedAt?: string; // ISO datetime
    notes?: string;
}

export interface PlannedItem {
    id: string;
    recipeId: string;
    recipeName: string;
    category: 'Prasad' | 'Annadanam' | 'Naivedya';
    targetQuantity: number;
    unit: string;
    batchCount: number; // How many batches needed
}

// Tab 4: Production (Cooking)
export interface KitchenBatch {
    id: string;
    planId: string;
    recipeId: string;
    recipeName: string;
    batchNumber: number; // e.g., Batch 1 of 4
    startTime?: string;
    endTime?: string;
    cookId: string;
    cookName: string;
    status: BatchStatus;
    yield: number; // Actual produced quantity
    unit: string;
    qualityCheckId?: string;
}

// Tab 5: Quality & Hygiene
export interface QualityCheck {
    id: string;
    batchId: string;
    recipeName: string;
    inspectorId: string;
    inspectorName: string;
    timestamp: string;
    parameters: {
        taste: boolean;
        texture: boolean;
        aroma: boolean;
        appearance: boolean;
        hygiene: boolean;
    };
    rating: number; // 1-10
    status: QualityStatus;
    remarks?: string;
}

// Tab 6: Distribution (Annadanam)
export interface DistributionSession {
    id: string;
    planId: string;
    location: 'Main Hall' | 'Dining Hall 1' | 'Dining Hall 2';
    startTime: string;
    lastUpdated: string;
    status: DistributionStatus;
    mealsPrepared: number;
    mealsServed: number;
    currentCrowdLevel: 'Low' | 'Moderate' | 'High' | 'Overflow';
    alerts: string[];
}

// Tab 7: Counter Prasad
export interface CounterTransaction {
    id: string;
    counterId: string;
    counterName: string;
    itemId: string;
    itemName: string;
    type: 'Opening Balance' | 'Restock' | 'Issue' | 'Closing Balance';
    quantity: number; // Positive for add, negative for issue
    unit: string;
    timestamp: string;
    authorizedBy?: string; // For overrides/VIP
}

export interface CounterStock {
    counterId: string;
    counterName: string;
    items: {
        itemId: string;
        itemName: string;
        currentStock: number;
        totalIssued: number;
    }[];
}

// Tab 8: Wastage & Review
export interface WastageLog {
    id: string;
    date: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unit: string;
    source: 'Production' | 'Distribution' | 'Counter' | 'Storage';
    reason: 'Spoilage' | 'Excess Production' | 'Spillage' | 'Quality Fail';
    notes: string;
    reviewedBy?: string;
}

