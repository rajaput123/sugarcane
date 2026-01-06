/**
 * Mock Data for Operations Modules
 * 
 * Centralized mock data generators for all Operations sub-modules
 */

import {
    ScheduledActivity,
    Resource,
    Task,
    Workflow,
    Booking,
    ProductionSchedule,
    Recipe,
    InventoryItem,
    InventoryTransaction,
    Facility,
    MaintenanceRecord,
    FacilityIssue,
    Token,
    QueueStatus,
    Zone,
    CrowdSnapshot,
} from '@/types/operations';

// Resources - Sringeri Sharada Peetham
export const mockResources: Resource[] = [
    { id: 'res-001', name: 'Priest Venkatesh Purohit', type: 'priest', availability: 'available' },
    { id: 'res-002', name: 'Priest Ramesh Archaka', type: 'priest', availability: 'busy', currentAssignment: 'act-001' },
    { id: 'res-003', name: 'Sharada Temple', type: 'facility', availability: 'available' },
    { id: 'res-004', name: 'Vidyashankara Temple', type: 'facility', availability: 'available' },
    { id: 'res-005', name: 'Kitchen Staff Team A', type: 'staff', availability: 'available' },
    { id: 'res-006', name: 'Veda Pathashala Teachers', type: 'staff', availability: 'available' },
    { id: 'res-007', name: 'Main Hall', type: 'facility', availability: 'available' },
    { id: 'res-008', name: 'Annadanam Hall', type: 'facility', availability: 'available' },
    { id: 'res-009', name: 'Sound System', type: 'equipment', availability: 'available' },
];

// Scheduled Activities - Sringeri Sharada Peetham
export const mockActivities: ScheduledActivity[] = [
    {
        id: 'act-001',
        title: 'Morning Aarti at Sharada Temple',
        type: 'ritual',
        startTime: new Date().toISOString().split('T')[0] + 'T06:00:00',
        endTime: new Date().toISOString().split('T')[0] + 'T07:00:00',
        location: 'Sharada Temple',
        assignedResources: ['res-001', 'res-003'],
        dependencies: [],
        status: 'scheduled',
        priority: 'high',
    },
    {
        id: 'act-002',
        title: 'Veda Chanting Session',
        type: 'ritual',
        startTime: new Date().toISOString().split('T')[0] + 'T08:00:00',
        endTime: new Date().toISOString().split('T')[0] + 'T09:00:00',
        location: 'Veda Pathashala',
        assignedResources: ['res-001'],
        dependencies: [],
        status: 'scheduled',
        priority: 'high',
    },
    {
        id: 'act-003',
        title: 'Prasad Distribution',
        type: 'seva',
        startTime: new Date().toISOString().split('T')[0] + 'T08:00:00',
        endTime: new Date().toISOString().split('T')[0] + 'T10:00:00',
        location: 'Prasad Distribution Hall',
        assignedResources: ['res-004'],
        dependencies: ['act-001'],
        status: 'scheduled',
        priority: 'medium',
    },
    {
        id: 'act-004',
        title: 'Discourse by Jagadguru',
        type: 'ritual',
        startTime: new Date().toISOString().split('T')[0] + 'T10:30:00',
        endTime: new Date().toISOString().split('T')[0] + 'T11:30:00',
        location: 'Main Hall',
        assignedResources: ['res-001'],
        dependencies: [],
        status: 'scheduled',
        priority: 'high',
    },
    {
        id: 'act-005',
        title: 'Annadanam Service',
        type: 'seva',
        startTime: new Date().toISOString().split('T')[0] + 'T12:00:00',
        endTime: new Date().toISOString().split('T')[0] + 'T14:00:00',
        location: 'Annadanam Hall',
        assignedResources: ['res-004'],
        dependencies: [],
        status: 'scheduled',
        priority: 'medium',
    },
    {
        id: 'act-006',
        title: 'Evening Aarti at Sharada Temple',
        type: 'ritual',
        startTime: new Date().toISOString().split('T')[0] + 'T18:00:00',
        endTime: new Date().toISOString().split('T')[0] + 'T19:00:00',
        location: 'Sharada Temple',
        assignedResources: ['res-002', 'res-003'],
        dependencies: [],
        status: 'scheduled',
        priority: 'high',
    },
    {
        id: 'act-007',
        title: 'Special Puja at Vidyashankara Temple',
        type: 'ritual',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T10:00:00',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T11:00:00',
        location: 'Vidyashankara Temple',
        assignedResources: ['res-001'],
        dependencies: [],
        status: 'scheduled',
        priority: 'high',
    },
];

// Tasks
export const mockTasks: Task[] = [
    {
        id: 'task-001',
        title: 'Prepare VIP visit protocol',
        description: 'Review and prepare protocol checklist for upcoming VIP visit',
        assigneeId: 'emp-001',
        assigneeName: 'Keshav Bhat',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
        status: 'in-progress',
        dependencies: [],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'task-002',
        title: 'Update inventory records',
        description: 'Verify and update all inventory items for monthly audit',
        assigneeId: 'emp-002',
        assigneeName: 'Arjun Das',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending',
        dependencies: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'task-003',
        title: 'Schedule facility maintenance',
        description: 'Coordinate maintenance for Main Hall air conditioning',
        assigneeId: 'emp-001',
        assigneeName: 'Keshav Bhat',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending',
        dependencies: ['task-001'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Workflows
export const mockWorkflows: Workflow[] = [
    {
        id: 'wf-001',
        name: 'VIP Visit Protocol',
        description: 'Standard workflow for VIP visit preparation',
        steps: [
            { id: 'step-001', name: 'Security Briefing', order: 1, dependencies: [] },
            { id: 'step-002', name: 'Protocol Review', order: 2, dependencies: ['step-001'] },
            { id: 'step-003', name: 'Resource Allocation', order: 3, dependencies: ['step-002'] },
        ],
        status: 'active',
    },
];

// Bookings
export const mockBookings: Booking[] = [
    {
        id: 'book-001',
        bookingType: 'accommodation',
        resourceId: 'fac-001',
        resourceName: 'Guest House Room 101',
        guestName: 'Rajesh Kumar',
        contactNumber: '+91 98765 43210',
        checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        numberOfGuests: 2,
        status: 'confirmed',
        amount: 2000,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'book-002',
        bookingType: 'event',
        resourceId: 'fac-003',
        resourceName: 'Conference Hall',
        guestName: 'Community Group',
        contactNumber: '+91 98765 43211',
        eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        eventTime: '14:00',
        numberOfGuests: 50,
        status: 'confirmed',
        amount: 5000,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Recipes
export const mockRecipes: Recipe[] = [
    {
        id: 'rec-001',
        name: 'Laddu Prasad',
        description: 'Traditional sweet prasad',
        ingredients: [
            { ingredientId: 'inv-001', ingredientName: 'Besan', quantity: 2, unit: 'kg' },
            { ingredientId: 'inv-002', ingredientName: 'Sugar', quantity: 1.5, unit: 'kg' },
            { ingredientId: 'inv-003', ingredientName: 'Ghee', quantity: 0.5, unit: 'kg' },
        ],
        instructions: ['Mix ingredients', 'Shape into laddus', 'Fry until golden'],
        servingSize: 100,
    },
];

// Production Schedules
export const mockProductionSchedules: ProductionSchedule[] = [
    {
        id: 'prod-001',
        date: new Date().toISOString().split('T')[0],
        recipeId: 'rec-001',
        recipeName: 'Laddu Prasad',
        plannedQuantity: 500,
        actualQuantity: 480,
        status: 'completed',
        qualityScore: 9,
    },
    {
        id: 'prod-002',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recipeId: 'rec-001',
        recipeName: 'Laddu Prasad',
        plannedQuantity: 600,
        status: 'planned',
    },
];

// Inventory Items
export const mockInventoryItems: InventoryItem[] = [
    {
        id: 'inv-001',
        name: 'Besan',
        category: 'non-perishable',
        currentStock: 50,
        unit: 'kg',
        reorderPoint: 20,
        reorderQuantity: 50,
        supplierName: 'ABC Provisions',
        lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        consumptionRate: 2.5,
    },
    {
        id: 'inv-002',
        name: 'Sugar',
        category: 'non-perishable',
        currentStock: 30,
        unit: 'kg',
        reorderPoint: 15,
        reorderQuantity: 40,
        supplierName: 'XYZ Suppliers',
        lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        consumptionRate: 1.8,
    },
    {
        id: 'inv-003',
        name: 'Ghee',
        category: 'perishable',
        currentStock: 8,
        unit: 'kg',
        reorderPoint: 5,
        reorderQuantity: 10,
        supplierName: 'Local Dairy',
        lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        consumptionRate: 0.5,
    },
];

// Inventory Transactions
export const mockInventoryTransactions: InventoryTransaction[] = [
    {
        id: 'trans-001',
        itemId: 'inv-001',
        itemName: 'Besan',
        type: 'consumption',
        quantity: 2,
        date: new Date().toISOString().split('T')[0],
        notes: 'Used for prasad production',
    },
    {
        id: 'trans-002',
        itemId: 'inv-002',
        itemName: 'Sugar',
        type: 'purchase',
        quantity: 40,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Monthly restock',
    },
];

// Facilities
export const mockFacilities: Facility[] = [
    {
        id: 'fac-001',
        name: 'Guest House Room 101',
        type: 'room',
        capacity: 2,
        location: 'Guest House, First Floor',
        status: 'operational',
        lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
        id: 'fac-002',
        name: 'Main Hall',
        type: 'hall',
        capacity: 500,
        location: 'Main Building, Ground Floor',
        status: 'operational',
        lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
        id: 'fac-003',
        name: 'Conference Hall',
        type: 'hall',
        capacity: 100,
        location: 'Main Building, Second Floor',
        status: 'operational',
        lastMaintenance: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
];

// Maintenance Records
export const mockMaintenanceRecords: MaintenanceRecord[] = [
    {
        id: 'maint-001',
        facilityId: 'fac-002',
        facilityName: 'Main Hall',
        type: 'scheduled',
        scheduledDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'scheduled',
        description: 'AC system maintenance',
        technician: 'HVAC Services',
    },
    {
        id: 'maint-002',
        facilityId: 'fac-001',
        facilityName: 'Guest House Room 101',
        type: 'scheduled',
        scheduledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'completed',
        description: 'Regular cleaning and inspection',
        technician: 'Housekeeping Team',
        cost: 500,
    },
];

// Facility Issues
export const mockFacilityIssues: FacilityIssue[] = [
    {
        id: 'issue-001',
        facilityId: 'fac-002',
        facilityName: 'Main Hall',
        reportedBy: 'Keshav Bhat',
        reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'AC not cooling properly',
        severity: 'medium',
        status: 'in-progress',
    },
];

// Tokens
export const mockTokens: Token[] = [
    {
        id: 'token-001',
        tokenNumber: 'D-001',
        queueType: 'darshan',
        issuedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedWaitTime: 45,
        status: 'waiting',
    },
    {
        id: 'token-002',
        tokenNumber: 'D-002',
        queueType: 'darshan',
        issuedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        estimatedWaitTime: 35,
        status: 'waiting',
    },
    {
        id: 'token-003',
        tokenNumber: 'S-001',
        queueType: 'seva',
        issuedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        estimatedWaitTime: 30,
        actualWaitTime: 25,
        status: 'completed',
        completedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
];

// Queue Status
export const mockQueueStatus: QueueStatus[] = [
    { queueType: 'darshan', currentPosition: 15, averageWaitTime: 40, totalWaiting: 25, totalProcessing: 5 },
    { queueType: 'seva', currentPosition: 8, averageWaitTime: 30, totalWaiting: 12, totalProcessing: 3 },
    { queueType: 'prasad', currentPosition: 5, averageWaitTime: 15, totalWaiting: 8, totalProcessing: 2 },
];

// Zones
export const mockZones: Zone[] = [
    {
        id: 'zone-001',
        name: 'Main Darshan Area',
        type: 'darshan',
        maxCapacity: 200,
        currentCount: 150,
        status: 'normal',
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 'zone-002',
        name: 'Seva Hall',
        type: 'seva',
        maxCapacity: 100,
        currentCount: 85,
        status: 'normal',
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 'zone-003',
        name: 'Prasad Distribution',
        type: 'prasad',
        maxCapacity: 50,
        currentCount: 45,
        status: 'normal',
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 'zone-004',
        name: 'Parking Area',
        type: 'parking',
        maxCapacity: 150,
        currentCount: 120,
        status: 'normal',
        lastUpdated: new Date().toISOString(),
    },
];

// Crowd Snapshots
export const mockCrowdSnapshots: CrowdSnapshot[] = [
    {
        id: 'snap-001',
        timestamp: new Date().toISOString(),
        zones: mockZones,
        totalCount: 400,
        totalCapacity: 500,
    },
];

