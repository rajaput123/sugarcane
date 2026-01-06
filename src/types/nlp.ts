/**
 * Natural Language Parsing Types
 * 
 * Defines types for NLP parsing results, intent detection,
 * and parsed data structures.
 */

export type QueryIntent = 
    | 'vip-visit' 
    | 'appointment' 
    | 'task' 
    | 'approval' 
    | 'finance' 
    | 'event' 
    | 'planner' 
    | 'unknown';

export interface ParsedDate {
    date: Date;
    isRelative: boolean;
    originalText: string;
}

export interface ParsedTime {
    hour: number;
    minute: number;
    period?: 'AM' | 'PM';
    originalText: string;
}

export interface ParsedPerson {
    title?: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
}

export interface ParsedLocation {
    location: string;
    type?: 'temple' | 'city' | 'venue' | 'other';
}

export interface ParsedAmount {
    amount: number;
    currency: string;
    originalText: string;
}

export interface QueryIntentResult {
    intent: QueryIntent;
    confidence: number; // 0-1
    keywords: string[];
}

export interface ParsedQueryResult {
    intent: QueryIntent;
    confidence: number; // 0-1
    data: any; // VIPVisit | Appointment | Task | FinanceTransaction | null
    errors?: string[];
    suggestions?: string[]; // If parsing incomplete
}

