/**
 * Mock Data for Devotees - Sringeri Sharada Peetham
 * 
 * Devotee records and related information
 */

export interface Devotee {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    sevaBookings: SevaBooking[];
    darshanHistory: DarshanRecord[];
    donations?: number;
    visitFrequency: 'regular' | 'occasional' | 'first-time';
    createdAt: string;
}

export interface SevaBooking {
    id: string;
    sevaType: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    amount: number;
}

export interface DarshanRecord {
    id: string;
    date: string;
    time: string;
    queueType: 'free' | 'paid' | 'vip';
    waitTime?: number;
}

export const mockDevotees: Devotee[] = [
    {
        id: 'dev-001',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh.kumar@email.com',
        address: 'Bangalore, Karnataka',
        sevaBookings: [
            {
                id: 'seva-booking-001',
                sevaType: 'Rudrabhishekam',
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '09:00',
                status: 'confirmed',
                amount: 500
            }
        ],
        darshanHistory: [
            {
                id: 'darshan-001',
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '10:00',
                queueType: 'free',
                waitTime: 45
            }
        ],
        donations: 5000,
        visitFrequency: 'regular',
        createdAt: '2023-01-15T10:00:00Z'
    },
    {
        id: 'dev-002',
        name: 'Priya Sharma',
        phone: '+91 98765 43211',
        address: 'Mysore, Karnataka',
        sevaBookings: [
            {
                id: 'seva-booking-002',
                sevaType: 'Laksharchana',
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '11:00',
                status: 'pending',
                amount: 1000
            }
        ],
        darshanHistory: [
            {
                id: 'darshan-002',
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '14:00',
                queueType: 'paid',
                waitTime: 20
            }
        ],
        visitFrequency: 'occasional',
        createdAt: '2023-06-20T10:00:00Z'
    },
    {
        id: 'dev-003',
        name: 'Suresh Reddy',
        phone: '+91 98765 43212',
        email: 'suresh.reddy@email.com',
        address: 'Hyderabad, Telangana',
        sevaBookings: [],
        darshanHistory: [
            {
                id: 'darshan-003',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '08:00',
                queueType: 'free',
                waitTime: 30
            }
        ],
        donations: 2000,
        visitFrequency: 'first-time',
        createdAt: '2024-01-10T10:00:00Z'
    },
    {
        id: 'dev-004',
        name: 'Lakshmi Nair',
        phone: '+91 98765 43213',
        address: 'Chennai, Tamil Nadu',
        sevaBookings: [
            {
                id: 'seva-booking-003',
                sevaType: 'Sahasranama Archana',
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '10:30',
                status: 'confirmed',
                amount: 300
            }
        ],
        darshanHistory: [
            {
                id: 'darshan-004',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '09:30',
                queueType: 'paid',
                waitTime: 15
            }
        ],
        visitFrequency: 'regular',
        createdAt: '2022-11-05T10:00:00Z'
    },
    {
        id: 'dev-005',
        name: 'Venkatesh Iyer',
        phone: '+91 98765 43214',
        email: 'venkatesh.iyer@email.com',
        address: 'Coimbatore, Tamil Nadu',
        sevaBookings: [],
        darshanHistory: [
            {
                id: 'darshan-005',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '16:00',
                queueType: 'free',
                waitTime: 50
            }
        ],
        donations: 10000,
        visitFrequency: 'regular',
        createdAt: '2021-08-12T10:00:00Z'
    }
];

