/**
 * Universal NLP Parser Service
 * 
 * Provides core parsing functions for extracting structured data
 * from natural language: dates, times, persons, locations, amounts.
 */

import { ParsedDate, ParsedTime, ParsedPerson, ParsedLocation, ParsedAmount } from '@/types/nlp';

export class NLPParserService {
    /**
     * Parse date from natural language
     * Handles relative dates (tomorrow, next week) and absolute dates
     */
    static parseDate(dateString: string): ParsedDate | null {
        if (!dateString || dateString.trim().length === 0) return null;

        const lower = dateString.toLowerCase().trim();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Relative dates
        if (lower.includes('tomorrow')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return { date: tomorrow, isRelative: true, originalText: dateString };
        }

        if (lower.includes('today')) {
            return { date: today, isRelative: true, originalText: dateString };
        }

        if (lower.includes('next week')) {
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            return { date: nextWeek, isRelative: true, originalText: dateString };
        }

        // Day of week (next occurrence)
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        for (let i = 0; i < daysOfWeek.length; i++) {
            if (lower.includes(daysOfWeek[i])) {
                const targetDay = i;
                const currentDay = today.getDay();
                let daysToAdd = (targetDay - currentDay + 7) % 7;
                if (daysToAdd === 0) daysToAdd = 7; // Next week if today
                const result = new Date(today);
                result.setDate(result.getDate() + daysToAdd);
                return { date: result, isRelative: true, originalText: dateString };
            }
        }

        // Absolute date formats
        // Format: "January 15" or "Jan 15"
        const monthDayMatch = dateString.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})/i);
        if (monthDayMatch) {
            const months: { [key: string]: number } = {
                'january': 0, 'jan': 0, 'february': 1, 'feb': 1, 'march': 2, 'mar': 2,
                'april': 3, 'apr': 3, 'may': 4, 'june': 5, 'jun': 5, 'july': 6, 'jul': 6,
                'august': 7, 'aug': 7, 'september': 8, 'sep': 8, 'october': 9, 'oct': 9,
                'november': 10, 'nov': 10, 'december': 11, 'dec': 11
            };
            const month = months[monthDayMatch[1].toLowerCase()];
            const day = parseInt(monthDayMatch[2]);
            const year = today.getFullYear();
            const result = new Date(year, month, day);
            if (result < today) {
                result.setFullYear(year + 1); // Next year if date passed
            }
            return { date: result, isRelative: false, originalText: dateString };
        }

        // Format: "15/01/2024" or "15-01-2024"
        const ddmmyyyyMatch = dateString.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (ddmmyyyyMatch) {
            const day = parseInt(ddmmyyyyMatch[1]);
            const month = parseInt(ddmmyyyyMatch[2]) - 1;
            const year = parseInt(ddmmyyyyMatch[3]);
            return { date: new Date(year, month, day), isRelative: false, originalText: dateString };
        }

        // Format: "2024-01-15"
        const yyyymmddMatch = dateString.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
        if (yyyymmddMatch) {
            const year = parseInt(yyyymmddMatch[1]);
            const month = parseInt(yyyymmddMatch[2]) - 1;
            const day = parseInt(yyyymmddMatch[3]);
            return { date: new Date(year, month, day), isRelative: false, originalText: dateString };
        }

        return null;
    }

    /**
     * Parse time from natural language
     * Handles formats: "9 AM", "09:00", "9:00 AM", "evening", etc.
     */
    static parseTime(timeString: string): ParsedTime | null {
        if (!timeString || timeString.trim().length === 0) return null;

        const lower = timeString.toLowerCase().trim();

        // Time of day keywords
        if (lower.includes('morning')) {
            return { hour: 9, minute: 0, period: 'AM', originalText: timeString };
        }
        if (lower.includes('afternoon')) {
            return { hour: 2, minute: 0, period: 'PM', originalText: timeString };
        }
        if (lower.includes('evening')) {
            return { hour: 6, minute: 0, period: 'PM', originalText: timeString };
        }
        if (lower.includes('night')) {
            return { hour: 8, minute: 0, period: 'PM', originalText: timeString };
        }

        // Format: "9 AM" or "9 PM"
        const hourPeriodMatch = timeString.match(/(\d{1,2})\s*(am|pm)/i);
        if (hourPeriodMatch) {
            const hour = parseInt(hourPeriodMatch[1]);
            const period = hourPeriodMatch[2].toUpperCase() as 'AM' | 'PM';
            return { hour, minute: 0, period, originalText: timeString };
        }

        // Format: "9:00 AM" or "09:00 PM"
        const hourMinutePeriodMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
        if (hourMinutePeriodMatch) {
            const hour = parseInt(hourMinutePeriodMatch[1]);
            const minute = parseInt(hourMinutePeriodMatch[2]);
            const period = hourMinutePeriodMatch[3].toUpperCase() as 'AM' | 'PM';
            return { hour, minute, period, originalText: timeString };
        }

        // Format: "09:00" (24-hour)
        const hourMinuteMatch = timeString.match(/(\d{1,2}):(\d{2})/);
        if (hourMinuteMatch) {
            const hour = parseInt(hourMinuteMatch[1]);
            const minute = parseInt(hourMinuteMatch[2]);
            const period = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            return { hour: hour12, minute, period, originalText: timeString };
        }

        return null;
    }

    /**
     * Parse person information from query
     * Extracts titles and names
     */
    static parsePerson(query: string): ParsedPerson | null {
        if (!query || query.trim().length === 0) return null;

        // Common titles
        const titles = [
            'prime minister', 'chief minister', 'minister', 'president', 'governor',
            'judge', 'justice', 'dr.', 'doctor', 'mr.', 'mrs.', 'ms.', 'prof.', 'professor'
        ];

        // Known locations to exclude from names
        const knownLocations = ['sringeri', 'temple', 'sanctum', 'bangalore', 'mysore', 'delhi', 'mumbai'];

        let title: string | undefined;
        let titleMatch: RegExpMatchArray | null = null;

        for (const t of titles) {
            const regex = new RegExp(`\\b${t.replace('.', '\\.')}\\b`, 'i');
            const match = query.match(regex);
            if (match) {
                title = match[0];
                titleMatch = match;
                break;
            }
        }

        // Extract name (capitalized words, typically after title)
        const words = query.split(/\s+/);
        const nameWords: string[] = [];
        let startIndex = 0;

        if (titleMatch && titleMatch.index !== undefined) {
            // Find the word index where the title starts
            let charCount = 0;
            for (let i = 0; i < words.length; i++) {
                if (charCount >= titleMatch.index) {
                    startIndex = i;
                    break;
                }
                charCount += words[i].length + 1; // +1 for space
            }
            // Add the number of words in the title
            const titleWords = titleMatch[0].split(/\s+/).length;
            startIndex += titleWords;
        }

        for (let i = startIndex; i < words.length; i++) {
            let word = words[i];
            // Remove punctuation from word
            word = word.replace(/[.,;:!?]/g, '');

            // Skip common words and known locations
            if (['is', 'are', 'visiting', 'visit', 'arriving', 'coming', 'the', 'a', 'an', 'at', 'to', 'from'].includes(word.toLowerCase()) ||
                knownLocations.includes(word.toLowerCase())) {
                continue;
            }

            // Capitalized word likely part of name
            if (word[0] && word[0] === word[0].toUpperCase() && word.length > 1) {
                nameWords.push(word);
            } else if (nameWords.length > 0) {
                break; // Stop if we hit non-capitalized after finding name
            }
        }

        if (nameWords.length === 0) {
            // Try to find any capitalized words as name (excluding locations)
            for (const word of words) {
                const cleanWord = word.replace(/[.,;:!?]/g, '');
                if (cleanWord[0] && cleanWord[0] === cleanWord[0].toUpperCase() && cleanWord.length > 2 &&
                    !titles.some(t => cleanWord.toLowerCase().includes(t)) &&
                    !knownLocations.includes(cleanWord.toLowerCase())) {
                    nameWords.push(cleanWord);
                    if (nameWords.length >= 2) break; // Take first 2 capitalized words
                }
            }
        }

        if (nameWords.length === 0) return null;

        const fullName = nameWords.join(' ');
        const firstName = nameWords[0];
        const lastName = nameWords.length > 1 ? nameWords.slice(1).join(' ') : undefined;

        return {
            title,
            firstName,
            lastName,
            fullName
        };
    }

    /**
     * Parse location from query
     */
    static parseLocation(query: string): ParsedLocation | null {
        if (!query || query.trim().length === 0) return null;

        const lower = query.toLowerCase();

        // Known locations
        const knownLocations: { [key: string]: { location: string; type: 'temple' | 'city' | 'venue' } } = {
            'sringeri': { location: 'Sringeri', type: 'city' },
            'temple': { location: 'Temple', type: 'temple' },
            'sanctum': { location: 'Sanctum', type: 'temple' },
            'main temple': { location: 'Main Temple', type: 'temple' },
        };

        for (const [key, value] of Object.entries(knownLocations)) {
            if (lower.includes(key)) {
                return value;
            }
        }

        // Try to extract capitalized location words
        const words = query.split(/\s+/);
        for (const word of words) {
            if (word[0] && word[0] === word[0].toUpperCase() && word.length > 2) {
                // Check if it's not a person name (common names)
                const commonNames = ['modi', 'sharma', 'reddy', 'kumar', 'singh'];
                if (!commonNames.some(name => word.toLowerCase().includes(name))) {
                    return { location: word, type: 'other' };
                }
            }
        }

        return null;
    }

    /**
     * Parse amount from query
     */
    static parseAmount(query: string): ParsedAmount | null {
        if (!query || query.trim().length === 0) return null;

        // Currency symbols
        const currencyMatch = query.match(/(₹|rs\.?|rupee|rupees|inr)/i);
        const currency = currencyMatch ? (currencyMatch[1].toLowerCase().includes('rupee') ? 'INR' : 'INR') : 'INR';

        // Amount patterns
        // Format: "50,000" or "50000" or "50K" or "50 thousand"
        const amountPatterns = [
            /(\d{1,3}(?:,\d{2,3})*(?:\.\d{2})?)\s*(?:k|thousand|lakh|crore)?/i,
            /(\d+)\s*(k|thousand|lakh|crore)/i,
        ];

        for (const pattern of amountPatterns) {
            const match = query.match(pattern);
            if (match) {
                let amountStr = match[1].replace(/,/g, '');
                const multiplier = match[2]?.toLowerCase();

                let amount = parseFloat(amountStr);

                if (multiplier === 'k' || multiplier === 'thousand') {
                    amount *= 1000;
                } else if (multiplier === 'lakh') {
                    amount *= 100000;
                } else if (multiplier === 'crore') {
                    amount *= 10000000;
                }

                return {
                    amount: Math.round(amount),
                    currency,
                    originalText: match[0]
                };
            }
        }

        return null;
    }
}

