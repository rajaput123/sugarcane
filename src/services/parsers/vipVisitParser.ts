/**
 * VIP Visit Parser
 * 
 * Parses VIP visit information from natural language queries
 * using universal NLP parsers.
 */

import { NLPParserService } from '../nlpParserService';
import { ParsedVIPVisit, VIPProtocolLevel } from '@/types/vip';

export class VIPVisitParser {
    /**
     * Parse VIP visit from natural language query
     */
    static parseVIPVisit(query: string): ParsedVIPVisit | null {
        if (!query || query.trim().length === 0) return null;

        // Parse person
        const person = NLPParserService.parsePerson(query);
        if (!person) return null;

        // Parse date
        const date = NLPParserService.parseDate(query);
        if (!date) return null;

        // Parse time
        const time = NLPParserService.parseTime(query);
        if (!time) return null;

        // Parse location
        const location = NLPParserService.parseLocation(query);

        // Determine protocol level based on title
        const protocolLevel = this.determineProtocolLevel(person.title || '');

        // Format time string
        const timeString = this.formatTime(time);

        // Calculate confidence score
        const confidence = this.calculateConfidence(person, date, time, location);

        return {
            visitor: person.fullName,
            title: person.title,
            date: date.date,
            time: timeString,
            location: location?.location,
            protocolLevel,
            confidence
        };
    }

    /**
     * Determine protocol level from person title
     */
    private static determineProtocolLevel(title: string): VIPProtocolLevel {
        if (!title) return 'standard';

        const lowerTitle = title.toLowerCase();

        // Maximum protocol
        if (
            lowerTitle.includes('prime minister') ||
            lowerTitle.includes('president') ||
            lowerTitle.includes('governor')
        ) {
            return 'maximum';
        }

        // High protocol
        if (
            lowerTitle.includes('minister') ||
            lowerTitle.includes('chief minister') ||
            lowerTitle.includes('judge') ||
            lowerTitle.includes('justice')
        ) {
            return 'high';
        }

        return 'standard';
    }

    /**
     * Format time object to ISO-compatible 24-hour string (HH:MM)
     */
    private static formatTime(time: { hour: number; minute: number; period?: 'AM' | 'PM' }): string {
        // Convert to 24-hour format for ISO compatibility
        let hour24 = time.hour;
        if (time.period === 'PM' && time.hour !== 12) {
            hour24 = time.hour + 12;
        } else if (time.period === 'AM' && time.hour === 12) {
            hour24 = 0;
        }

        const hourStr = hour24.toString().padStart(2, '0');
        const minuteStr = time.minute.toString().padStart(2, '0');
        return `${hourStr}:${minuteStr}`;
    }

    /**
     * Calculate parsing confidence score (0-1)
     */
    private static calculateConfidence(
        person: { fullName: string; title?: string },
        date: { date: Date; isRelative: boolean },
        time: { hour: number; minute: number },
        location: { location: string } | null
    ): number {
        let score = 0.5; // Base score

        // Person name found
        if (person.fullName && person.fullName.length > 2) {
            score += 0.2;
        }

        // Title found
        if (person.title) {
            score += 0.1;
        }

        // Date found
        if (date.date) {
            score += 0.1;
        }

        // Time found
        if (time.hour >= 0 && time.hour <= 23) {
            score += 0.05;
        }

        // Location found
        if (location) {
            score += 0.05;
        }

        return Math.min(score, 1.0);
    }
}

