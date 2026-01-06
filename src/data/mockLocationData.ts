/**
 * Mock Data for Locations - Sringeri Sharada Peetham
 * 
 * Temple locations including Sringeri main complex and Kigga
 */

export interface TempleLocation {
    id: string;
    name: string;
    type: 'temple' | 'facility' | 'accommodation' | 'educational' | 'other';
    description: string;
    address?: string;
    capacity?: number;
    status: 'operational' | 'under-maintenance' | 'closed';
    associatedWith?: string; // Associated deity, purpose, etc.
}

export const mockLocations: TempleLocation[] = [
    {
        id: 'loc-sringeri-main',
        name: 'Sringeri Main Temple Complex',
        type: 'temple',
        description: 'Main temple complex housing Sharada Temple and Vidyashankara Temple',
        address: 'Sringeri, Chikkamagaluru district, Karnataka',
        status: 'operational',
        associatedWith: 'Sharada Devi, Vidyashankara'
    },
    {
        id: 'loc-sharada-temple',
        name: 'Sharada Temple',
        type: 'temple',
        description: 'Dedicated to Goddess Sharada (Saraswati) - the deity of knowledge and learning',
        address: 'Sringeri Main Complex',
        status: 'operational',
        associatedWith: 'Sharada Devi'
    },
    {
        id: 'loc-vidyashankara-temple',
        name: 'Vidyashankara Temple',
        type: 'temple',
        description: 'Famous for its astronomical and architectural design',
        address: 'Sringeri Main Complex',
        status: 'operational',
        associatedWith: 'Vidyashankara'
    },
    {
        id: 'loc-kigga',
        name: 'Kigga',
        type: 'temple',
        description: 'Associated temple location, often visited by Jagadguru',
        address: 'Kigga, near Sringeri',
        status: 'operational',
        associatedWith: 'Jagadguru visits'
    },
    {
        id: 'loc-guest-house',
        name: 'Guest House',
        type: 'accommodation',
        description: 'Accommodation facility for visiting devotees and dignitaries',
        capacity: 50,
        status: 'operational'
    },
    {
        id: 'loc-dining-hall',
        name: 'Annadanam Hall',
        type: 'facility',
        description: 'Dining hall for annadanam (free meals) to devotees',
        capacity: 500,
        status: 'operational'
    },
    {
        id: 'loc-veda-pathashala',
        name: 'Veda Pathashala',
        type: 'educational',
        description: 'Educational wing for teaching Vedas, Upanishads, and Vedanta',
        status: 'operational',
        associatedWith: 'Vedic Education'
    },
    {
        id: 'loc-prasad-hall',
        name: 'Prasad Distribution Hall',
        type: 'facility',
        description: 'Hall for distributing prasad to devotees',
        capacity: 200,
        status: 'operational'
    },
    {
        id: 'loc-main-hall',
        name: 'Main Hall',
        type: 'facility',
        description: 'Main hall for aarti, discourses, and gatherings',
        capacity: 1000,
        status: 'operational'
    },
    {
        id: 'loc-parking',
        name: 'Temple Parking Area',
        type: 'facility',
        description: 'Parking facility for devotees and VIP vehicles',
        capacity: 150,
        status: 'operational'
    }
];

