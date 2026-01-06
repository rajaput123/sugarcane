/**
 * VIP Visit Types
 * 
 * Defines types for VIP visit management, including protocol levels,
 * visit information, and related structures.
 */

export type VIPProtocolLevel = 'maximum' | 'high' | 'standard';

export interface VIPVisit {
    id: string;
    visitor: string; // Full name of the visitor
    title?: string; // Title/position (e.g., "Prime Minister", "Chief Minister")
    date: string; // ISO date string (YYYY-MM-DD)
    time: string; // Time string (e.g., "09:00 AM", "2:00 PM")
    location?: string; // Location of visit (e.g., "Sringeri", "Main Temple")
    protocolLevel: VIPProtocolLevel;
    assignedEscort?: string; // Assigned escort/coordinator
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
    createdBy: string;
    updatedBy: string;
}

export interface ParsedVIPVisit {
    visitor: string;
    title?: string;
    date: Date;
    time: string;
    location?: string;
    protocolLevel: VIPProtocolLevel;
    confidence: number; // 0-1, parsing confidence score
}

