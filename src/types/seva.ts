/**
 * Seva & Darshan Types
 * 
 * Defines types for seva (service) offerings and darshan (viewing) management.
 */

export type SevaType = 
    | 'archana'
    | 'abhishekam'
    | 'puja'
    | 'homam'
    | 'special-seva'
    | 'festival-seva';

export type DarshanType = 
    | 'free'
    | 'paid'
    | 'vip'
    | 'special';

export type SevaStatus = 
    | 'available'
    | 'booked'
    | 'completed'
    | 'cancelled';

export interface Seva {
    id: string;
    name: string;
    type: SevaType;
    description?: string;
    templeId: string; // Which temple this seva is offered at
    duration: number; // Duration in minutes
    price: number; // Price in INR
    maxParticipants?: number; // Maximum number of participants
    isActive: boolean;
    availableDays?: string[]; // Days of week when available
    availableTimeSlots?: string[]; // Time slots (e.g., ["06:00 AM", "09:00 AM"])
    images?: string[]; // Array of image URLs
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface Darshan {
    id: string;
    name: string;
    type: DarshanType;
    templeId: string; // Which temple this darshan is for
    price: number; // Price in INR (0 for free)
    duration?: number; // Estimated duration in minutes
    queueCapacity?: number; // Maximum queue capacity
    currentQueueLength?: number; // Current queue length
    isActive: boolean;
    availableTimeSlots?: string[]; // Time slots when available
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface SevaBooking {
    id: string;
    sevaId: string;
    templeId: string;
    devoteeName: string;
    devoteePhone?: string;
    devoteeEmail?: string;
    bookingDate: string; // ISO date
    timeSlot: string; // e.g., "09:00 AM"
    numberOfParticipants: number;
    totalAmount: number;
    status: SevaStatus;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface DarshanEntry {
    id: string;
    darshanId: string;
    templeId: string;
    devoteeName?: string; // Optional for free darshan
    entryTime: string; // ISO timestamp
    exitTime?: string; // ISO timestamp
    tokenNumber?: string; // For paid/VIP darshan
    amount?: number; // Amount paid
    status: 'in-queue' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

