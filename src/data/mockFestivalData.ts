/**
 * Mock Data for Festivals - Sringeri Sharada Peetham
 * 
 * Festival preparation data including Navaratri with Sharada worship
 */

export interface FestivalPreparation {
    id: string;
    festivalName: string;
    startDate: string;
    endDate: string;
    status: 'planning' | 'in-progress' | 'ready' | 'completed';
    progress: number; // 0-100
    actions: FestivalAction[];
    requirements: FestivalRequirement[];
    specialRituals: string[];
}

export interface FestivalAction {
    id: string;
    description: string;
    assignedTo?: string;
    dueDate?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface FestivalRequirement {
    itemId: string;
    itemName: string;
    requiredQuantity: number;
    unit: string;
    currentStock: number;
    shortfall: number;
    status: 'ready' | 'pending' | 'critical';
}

// Navaratri Festival Data
export const mockNavaratriPreparation: FestivalPreparation = {
    id: 'fest-navaratri-2024',
    festivalName: 'Navaratri',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 39 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in-progress',
    progress: 65,
    actions: [
        {
            id: 'nav-act-001',
            description: 'Prepare Sharada Temple for special Navaratri worship',
            assignedTo: 'Priest Venkatesh',
            dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'in-progress',
            priority: 'critical'
        },
        {
            id: 'nav-act-002',
            description: 'Arrange special flowers and garlands for Sharada Devi',
            assignedTo: 'Ritual Department',
            dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            priority: 'high'
        },
        {
            id: 'nav-act-003',
            description: 'Prepare special prasad for Navaratri (Laddu, Payasam)',
            assignedTo: 'Kitchen Department',
            dueDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            priority: 'high'
        },
        {
            id: 'nav-act-004',
            description: 'Decorate temple premises with Navaratri decorations',
            assignedTo: 'Operations Department',
            dueDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            priority: 'medium'
        },
        {
            id: 'nav-act-005',
            description: 'Coordinate special discourses during Navaratri',
            assignedTo: 'Veda Pathashala',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            priority: 'medium'
        },
        {
            id: 'nav-act-006',
            description: 'Arrange accommodation for visiting devotees',
            assignedTo: 'Operations Department',
            dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'in-progress',
            priority: 'high'
        }
    ],
    requirements: [
        {
            itemId: 'inv-rit-001',
            itemName: 'Sandalwood Paste',
            requiredQuantity: 50,
            unit: 'kg',
            currentStock: 25,
            shortfall: 25,
            status: 'pending'
        },
        {
            itemId: 'inv-fest-001',
            itemName: 'Flower Garlands',
            requiredQuantity: 200,
            unit: 'pieces',
            currentStock: 0,
            shortfall: 200,
            status: 'critical'
        },
        {
            itemId: 'inv-kit-002',
            itemName: 'Ghee',
            requiredQuantity: 20,
            unit: 'liters',
            currentStock: 5,
            shortfall: 15,
            status: 'critical'
        },
        {
            itemId: 'inv-rit-002',
            itemName: 'Camphor',
            requiredQuantity: 15,
            unit: 'kg',
            currentStock: 8,
            shortfall: 7,
            status: 'pending'
        }
    ],
    specialRituals: [
        'Sharada Devi Special Puja (All 9 days)',
        'Lalitha Sahasranama Parayana',
        'Devi Mahatmyam Recitation',
        'Special Aarti with 108 lamps',
        'Homa for Sharada Devi'
    ]
};

// Other Festivals
export const mockSankrantiPreparation: FestivalPreparation = {
    id: 'fest-sankranti-2024',
    festivalName: 'Sankranti',
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'planning',
    progress: 30,
    actions: [
        {
            id: 'sank-act-001',
            description: 'Prepare special Sankranti prasad (Pongal, Ellu Bella)',
            status: 'pending',
            priority: 'high'
        },
        {
            id: 'sank-act-002',
            description: 'Arrange special puja at Sharada Temple',
            status: 'pending',
            priority: 'medium'
        }
    ],
    requirements: [
        {
            itemId: 'inv-kit-001',
            itemName: 'Rice',
            requiredQuantity: 100,
            unit: 'kg',
            currentStock: 500,
            shortfall: 0,
            status: 'ready'
        }
    ],
    specialRituals: [
        'Special Puja at Sharada Temple',
        'Annadanam for devotees'
    ]
};

export const mockGuruPurnimaPreparation: FestivalPreparation = {
    id: 'fest-gurupurnima-2024',
    festivalName: 'Guru Purnima',
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'planning',
    progress: 20,
    actions: [
        {
            id: 'guru-act-001',
            description: 'Prepare for Jagadguru Puja and blessings',
            status: 'pending',
            priority: 'critical'
        },
        {
            id: 'guru-act-002',
            description: 'Arrange special discourse by Jagadguru',
            status: 'pending',
            priority: 'high'
        }
    ],
    requirements: [],
    specialRituals: [
        'Jagadguru Puja',
        'Guru Vandana',
        'Special Discourse'
    ]
};

export const mockFestivalData: FestivalPreparation[] = [
    mockNavaratriPreparation,
    mockSankrantiPreparation,
    mockGuruPurnimaPreparation
];

