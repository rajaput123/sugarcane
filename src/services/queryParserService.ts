/**
 * Query Parser Service
 * 
 * Main entry point for parsing user queries.
 * Detects intent and routes to appropriate parsers.
 */

import { IntentDetector } from './intentDetector';
import { VIPVisitParser } from './parsers/vipVisitParser';
import { QueryIntent, ParsedQueryResult } from '@/types/nlp';
import { ParsedVIPVisit } from '@/types/vip';

export class QueryParserService {
    /**
     * Parse user query and return structured result
     */
    static parseQuery(query: string): ParsedQueryResult {
        if (!query || query.trim().length === 0) {
            return {
                intent: 'unknown',
                confidence: 0,
                data: null,
                errors: ['Empty query'],
                suggestions: ['Please provide a query to parse']
            };
        }

        // Step 1: Detect intent
        const intentResult = IntentDetector.detectIntent(query);

        // Step 2: Route to appropriate parser based on intent
        let data: any = null;
        const errors: string[] = [];
        const suggestions: string[] = [];

        switch (intentResult.intent) {
            case 'vip-visit':
                const vipResult = VIPVisitParser.parseVIPVisit(query);
                if (vipResult) {
                    data = vipResult;
                } else {
                    errors.push('Could not parse VIP visit details');
                    suggestions.push('Please include: visitor name, date, and time (e.g., "Tomorrow 9 AM, Prime Minister Modi is visiting Sringeri")');
                }
                break;

            case 'appointment':
                // TODO: Implement appointment parser
                errors.push('Appointment parsing not yet implemented');
                suggestions.push('Please use format: "Schedule meeting with [person/team] on [date] at [time]"');
                break;

            case 'task':
                // TODO: Implement task parser
                errors.push('Task parsing not yet implemented');
                suggestions.push('Please use format: "Create task: [description] by [date]"');
                break;

            case 'approval':
                // TODO: Implement approval parser
                errors.push('Approval parsing not yet implemented');
                break;

            case 'finance':
                // TODO: Implement finance parser
                errors.push('Finance parsing not yet implemented');
                suggestions.push('Please use format: "Record donation of ₹[amount] from [person]"');
                break;

            case 'event':
                // TODO: Implement event parser
                errors.push('Event parsing not yet implemented');
                break;

            case 'planner':
                // Planner actions are handled separately in useSimulation
                // This is just for detection
                break;

            case 'unknown':
                errors.push('Could not determine query intent');
                suggestions.push('Try phrases like: "VIP visit", "Schedule meeting", "Create task", "Record donation"');
                break;
        }

        return {
            intent: intentResult.intent,
            confidence: data ? Math.max(intentResult.confidence, 0.7) : intentResult.confidence * 0.5,
            data,
            errors: errors.length > 0 ? errors : undefined,
            suggestions: suggestions.length > 0 ? suggestions : undefined
        };
    }
}

