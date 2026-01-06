/**
 * Mock Data for Events - Sringeri Sharada Peetham
 * 
 * Sringeri events including Sahasra Chandi Yaga, rituals, Guruvijaya Yatras
 */

export interface TempleEvent {
    id: string;
    name: string;
    type: 'yaga' | 'ritual' | 'yatra' | 'consecration' | 'anniversary' | 'other';
    description: string;
    date: string;
    time?: string;
    location: string;
    associatedWithVIP?: boolean;
    vipProtocolLevel?: 'maximum' | 'high' | 'standard';
    status: 'planned' | 'confirmed' | 'in-progress' | 'completed';
    specialRequirements?: string[];
    estimatedAttendees?: number;
}

export const mockEvents: TempleEvent[] = [
    // Sahasra Chandi Yaga
    {
        id: 'event-yaga-001',
        name: 'Sahasra Chandi Yaga',
        type: 'yaga',
        description: 'Special Sahasra Chandi Yaga with VIP participation',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days from now
        time: '09:00',
        location: 'Sringeri Main Temple Complex',
        associatedWithVIP: true,
        vipProtocolLevel: 'high',
        status: 'planned',
        specialRequirements: [
            'Special arrangements for VIP dignitaries',
            'Enhanced security protocols',
            'Media coverage arrangements',
            'Special prasad preparation'
        ],
        estimatedAttendees: 5000
    },
    {
        id: 'event-yaga-002',
        name: 'Sahasra Chandi Yaga Purnahuti',
        type: 'yaga',
        description: 'Purnahuti (conclusion) of Sahasra Chandi Yaga',
        date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '11:00',
        location: 'Sringeri Main Temple Complex',
        associatedWithVIP: true,
        vipProtocolLevel: 'high',
        status: 'planned',
        estimatedAttendees: 3000
    },
    // Ritual Events
    {
        id: 'event-ritual-001',
        name: 'Special Puja at Sharada Temple',
        type: 'ritual',
        description: 'Special puja ceremony at Sharada Temple',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00',
        location: 'Sharada Temple',
        status: 'confirmed',
        estimatedAttendees: 500
    },
    {
        id: 'event-ritual-002',
        name: 'Homa for Sharada Devi',
        type: 'ritual',
        description: 'Special homa ceremony dedicated to Sharada Devi',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '08:00',
        location: 'Sharada Temple',
        status: 'planned',
        estimatedAttendees: 300
    },
    {
        id: 'event-ritual-003',
        name: 'Temple Consecration',
        type: 'consecration',
        description: 'Consecration ceremony for newly renovated temple section',
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:30',
        location: 'Vidyashankara Temple',
        associatedWithVIP: true,
        vipProtocolLevel: 'high',
        status: 'planned',
        estimatedAttendees: 2000
    },
    // Guruvijaya Yatra Events
    {
        id: 'event-yatra-001',
        name: 'Guruvijaya Yatra - Bangalore',
        type: 'yatra',
        description: 'Jagadguru visit to Bangalore as part of Guruvijaya Yatra',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Bangalore, Karnataka',
        status: 'planned',
        specialRequirements: [
            'Travel arrangements for Jagadguru',
            'Accommodation arrangements',
            'Security protocols',
            'Devotee darshan arrangements'
        ],
        estimatedAttendees: 10000
    },
    {
        id: 'event-yatra-002',
        name: 'Guruvijaya Yatra - Mysore',
        type: 'yatra',
        description: 'Jagadguru visit to Mysore as part of Guruvijaya Yatra',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Mysore, Karnataka',
        status: 'planned',
        estimatedAttendees: 8000
    },
    // Special Occasions
    {
        id: 'event-anniversary-001',
        name: 'Peetham Foundation Day',
        type: 'anniversary',
        description: 'Celebration of Sringeri Sharada Peetham foundation day',
        date: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Sringeri Main Temple Complex',
        associatedWithVIP: true,
        vipProtocolLevel: 'maximum',
        status: 'planned',
        estimatedAttendees: 15000
    },
    // Regular Rituals
    {
        id: 'event-ritual-004',
        name: 'Morning Aarti',
        type: 'ritual',
        description: 'Daily morning aarti at Sharada Temple',
        date: new Date().toISOString().split('T')[0],
        time: '06:00',
        location: 'Sharada Temple',
        status: 'confirmed',
        estimatedAttendees: 200
    },
    {
        id: 'event-ritual-005',
        name: 'Evening Aarti',
        type: 'ritual',
        description: 'Daily evening aarti at Sharada Temple',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        location: 'Sharada Temple',
        status: 'confirmed',
        estimatedAttendees: 300
    },
    {
        id: 'event-ritual-006',
        name: 'Veda Chanting Session',
        type: 'ritual',
        description: 'Regular Veda chanting by pathashala students',
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
        location: 'Veda Pathashala',
        status: 'confirmed',
        estimatedAttendees: 50
    }
];

