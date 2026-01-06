
import {
    KitchenDailyPlan,
    KitchenBatch,
    QualityCheck,
    DistributionSession,
    CounterStock,
    WastageLog
} from '@/types/operations';

// 1. Daily Plan
export const mockDailyPlan: KitchenDailyPlan = {
    id: 'PLAN-2025-10-24',
    date: new Date().toISOString().split('T')[0], // Today
    dayType: 'Normal',
    expectedDevotees: 5000,
    headCookId: 'STAFF-001',
    status: 'Approved',
    approvedBy: 'ADMIN-01',
    approvedAt: '2025-10-24T06:00:00Z',
    plannedItems: [
        {
            id: 'ITEM-01',
            recipeId: 'REC-001',
            recipeName: 'Sweet Pongal',
            category: 'Prasad',
            targetQuantity: 200,
            unit: 'kg',
            batchCount: 4
        },
        {
            id: 'ITEM-02',
            recipeId: 'REC-002',
            recipeName: 'Puliyogare',
            category: 'Annadanam',
            targetQuantity: 500,
            unit: 'kg',
            batchCount: 10
        },
        {
            id: 'ITEM-03',
            recipeId: 'REC-003',
            recipeName: 'Curd Rice',
            category: 'Annadanam',
            targetQuantity: 300,
            unit: 'kg',
            batchCount: 6
        },
        {
            id: 'ITEM-04',
            recipeId: 'REC-004',
            recipeName: 'Laddu',
            category: 'Prasad',
            targetQuantity: 5000,
            unit: 'pcs',
            batchCount: 10
        }
    ]
};

// 2. Production Batches
export const mockBatches: KitchenBatch[] = [
    // Completed Batches
    {
        id: 'BATCH-001',
        planId: 'PLAN-2025-10-24',
        recipeId: 'REC-001',
        recipeName: 'Sweet Pongal',
        batchNumber: 1,
        startTime: '2025-10-24T06:30:00Z',
        endTime: '2025-10-24T07:15:00Z',
        cookId: 'COOK-01',
        cookName: 'Ramesh Bhat',
        status: 'Completed',
        yield: 52,
        unit: 'kg',
        qualityCheckId: 'QC-001'
    },
    {
        id: 'BATCH-002',
        planId: 'PLAN-2025-10-24',
        recipeId: 'REC-002',
        recipeName: 'Puliyogare',
        batchNumber: 1,
        startTime: '2025-10-24T07:00:00Z',
        endTime: '2025-10-24T08:00:00Z',
        cookId: 'COOK-02',
        cookName: 'Suresh Rao',
        status: 'Completed',
        yield: 55,
        unit: 'kg',
        qualityCheckId: 'QC-002'
    },
    // In Progress Batches
    {
        id: 'BATCH-003',
        planId: 'PLAN-2025-10-24',
        recipeId: 'REC-002',
        recipeName: 'Puliyogare',
        batchNumber: 2,
        startTime: '2025-10-24T08:15:00Z',
        cookId: 'COOK-02',
        cookName: 'Suresh Rao',
        status: 'Cooking',
        yield: 0,
        unit: 'kg'
    },
    {
        id: 'BATCH-004',
        planId: 'PLAN-2025-10-24',
        recipeId: 'REC-004',
        recipeName: 'Laddu',
        batchNumber: 3,
        startTime: '2025-10-24T08:30:00Z',
        cookId: 'COOK-03',
        cookName: 'Ganesh Acharya',
        status: 'Quality Check',
        yield: 510,
        unit: 'pcs'
    }
];

// 3. Quality Checks
export const mockQualityChecks: QualityCheck[] = [
    {
        id: 'QC-001',
        batchId: 'BATCH-001',
        recipeName: 'Sweet Pongal',
        inspectorId: 'SUP-01',
        inspectorName: 'Head Priest',
        timestamp: '2025-10-24T07:20:00Z',
        parameters: {
            taste: true,
            texture: true,
            aroma: true,
            appearance: true,
            hygiene: true
        },
        rating: 10,
        status: 'Passed'
    },
    {
        id: 'QC-002',
        batchId: 'BATCH-002',
        recipeName: 'Puliyogare',
        inspectorId: 'SUP-01',
        inspectorName: 'Head Priest',
        timestamp: '2025-10-24T08:05:00Z',
        parameters: {
            taste: true,
            texture: true,
            aroma: true,
            appearance: true,
            hygiene: true
        },
        rating: 9,
        status: 'Passed'
    }
];

// 4. Distribution Session
export const mockDistribution: DistributionSession = {
    id: 'DIST-001',
    planId: 'PLAN-2025-10-24',
    location: 'Main Hall',
    startTime: '2025-10-24T12:00:00Z',
    lastUpdated: '2025-10-24T12:30:00Z',
    status: 'Active',
    mealsPrepared: 1000, // Total so far
    mealsServed: 450,
    currentCrowdLevel: 'Moderate',
    alerts: []
};

// 5. Counter Stock
export const mockCounterStock: CounterStock[] = [
    {
        counterId: 'CNT-01',
        counterName: 'Main Entrance Counter',
        items: [
            {
                itemId: 'ITEM-04',
                itemName: 'Laddu',
                currentStock: 1500,
                totalIssued: 350
            },
            {
                itemId: 'ITEM-05',
                itemName: 'Wada',
                currentStock: 50,
                totalIssued: 450 // Low stock!
            }
        ]
    }
];

// 6. Wastage Log (Yesterday's Data for demo)
export const mockWastage: WastageLog[] = [
    {
        id: 'WST-001',
        date: '2025-10-23',
        itemId: 'ITEM-02',
        itemName: 'Puliyogare',
        quantity: 5,
        unit: 'kg',
        source: 'Distribution',
        reason: 'Excess Production',
        notes: 'Unexpected drop in evening crowd due to rain.'
    }
];

// 7. Menu Data
export interface KitchenMenu {
    type: 'prasad' | 'annadanam' | 'breakfast' | 'lunch' | 'dinner';
    items: MenuItem[];
    available: boolean;
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    category: string;
}

export const mockPrasadMenu: KitchenMenu = {
    type: 'prasad',
    items: [
        { id: 'prasad-001', name: 'Laddu', description: 'Traditional sweet prasad', category: 'sweet' },
        { id: 'prasad-002', name: 'Sweet Pongal', description: 'Sweet rice prasad', category: 'sweet' },
        { id: 'prasad-003', name: 'Payasam', description: 'Sweet milk prasad', category: 'sweet' },
        { id: 'prasad-004', name: 'Vada', description: 'Savory vada prasad', category: 'savory' },
        { id: 'prasad-005', name: 'Puliyogare', description: 'Tamarind rice prasad', category: 'savory' }
    ],
    available: true
};

export const mockAnnadanamMenu: KitchenMenu = {
    type: 'annadanam',
    items: [
        { id: 'annadanam-001', name: 'Puliyogare', description: 'Tamarind rice', category: 'main' },
        { id: 'annadanam-002', name: 'Curd Rice', description: 'Yogurt rice', category: 'main' },
        { id: 'annadanam-003', name: 'Sambar', description: 'Lentil curry', category: 'curry' },
        { id: 'annadanam-004', name: 'Rasam', description: 'Spiced soup', category: 'soup' },
        { id: 'annadanam-005', name: 'Pickle', description: 'Mango pickle', category: 'side' },
        { id: 'annadanam-006', name: 'Papad', description: 'Crispy papad', category: 'side' }
    ],
    available: true
};

export const mockBreakfastMenu: KitchenMenu = {
    type: 'breakfast',
    items: [
        { id: 'breakfast-001', name: 'Idli', description: 'Steamed rice cakes', category: 'main' },
        { id: 'breakfast-002', name: 'Dosa', description: 'Crispy crepe', category: 'main' },
        { id: 'breakfast-003', name: 'Upma', description: 'Semolina upma', category: 'main' },
        { id: 'breakfast-004', name: 'Sambar', description: 'Lentil curry', category: 'curry' },
        { id: 'breakfast-005', name: 'Coconut Chutney', description: 'Coconut dip', category: 'side' }
    ],
    available: true
};

export const mockLunchMenu: KitchenMenu = {
    type: 'lunch',
    items: [
        { id: 'lunch-001', name: 'Rice', description: 'Steamed rice', category: 'main' },
        { id: 'lunch-002', name: 'Sambar', description: 'Lentil curry', category: 'curry' },
        { id: 'lunch-003', name: 'Rasam', description: 'Spiced soup', category: 'soup' },
        { id: 'lunch-004', name: 'Vegetable Curry', description: 'Seasonal vegetables', category: 'curry' },
        { id: 'lunch-005', name: 'Curd', description: 'Yogurt', category: 'side' },
        { id: 'lunch-006', name: 'Pickle', description: 'Mango pickle', category: 'side' }
    ],
    available: true
};

export const mockDinnerMenu: KitchenMenu = {
    type: 'dinner',
    items: [
        { id: 'dinner-001', name: 'Rice', description: 'Steamed rice', category: 'main' },
        { id: 'dinner-002', name: 'Curd Rice', description: 'Yogurt rice', category: 'main' },
        { id: 'dinner-003', name: 'Rasam', description: 'Spiced soup', category: 'soup' },
        { id: 'dinner-004', name: 'Pickle', description: 'Mango pickle', category: 'side' }
    ],
    available: true
};

export const mockKitchenMenus: KitchenMenu[] = [
    mockPrasadMenu,
    mockAnnadanamMenu,
    mockBreakfastMenu,
    mockLunchMenu,
    mockDinnerMenu
];
