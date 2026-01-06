/**
 * Temple Management Types
 * 
 * Defines types for temple hierarchy, child temples,
 * and temple-related operations.
 */

export interface Temple {
    id: string;
    name: string;
    code: string;
    parentTempleId: string | null; // null for main/parent temple
    location: string;
    description?: string;
    isActive: boolean;
    capacity?: number; // Maximum capacity
    currentOccupancy?: number; // Current occupancy
    openingTime?: string; // e.g., "06:00 AM"
    closingTime?: string; // e.g., "09:00 PM"
    images?: string[]; // Array of image URLs
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface TempleHierarchy extends Temple {
    children: TempleHierarchy[];
    level: number;
}

