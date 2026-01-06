/**
 * Intent Detection Service
 * 
 * Detects user intent from natural language queries using
 * pattern matching, keyword detection, and confidence scoring.
 */

import { QueryIntent, QueryIntentResult } from '@/types/nlp';

export class IntentDetector {
    /**
     * Detect intent from user query
     */
    static detectIntent(query: string): QueryIntentResult {
        const lowercaseQuery = query.toLowerCase();
        const keywords: string[] = [];
        
        // VIP Visit Detection
        const vipPatterns = [
            /(?:prime\s+minister|chief\s+minister|minister|president|governor|judge|vip)/i,
            /(?:visiting|visit|arriving|arrival|coming)/i,
            /(?:tomorrow|today|next\s+week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
        ];
        const vipScore = this.calculatePatternScore(lowercaseQuery, vipPatterns);
        if (vipScore > 0.4) {
            keywords.push(...this.extractKeywords(lowercaseQuery, ['visit', 'visiting', 'arriving', 'vip', 'minister', 'prime']));
            return {
                intent: 'vip-visit',
                confidence: Math.min(vipScore, 0.95),
                keywords
            };
        }

        // Appointment Detection
        const appointmentPatterns = [
            /(?:schedule|meeting|appointment|book|arrange)/i,
            /(?:with|between|and)/i,
            /(?:team|department|person)/i,
        ];
        const appointmentScore = this.calculatePatternScore(lowercaseQuery, appointmentPatterns);
        if (appointmentScore > 0.4) {
            keywords.push(...this.extractKeywords(lowercaseQuery, ['schedule', 'meeting', 'appointment', 'book']));
            return {
                intent: 'appointment',
                confidence: Math.min(appointmentScore, 0.9),
                keywords
            };
        }

        // Task Detection
        const taskPatterns = [
            /(?:create\s+task|add\s+task|new\s+task|task:)/i,
            /(?:do|complete|finish|work\s+on)/i,
            /(?:by|due|deadline)/i,
        ];
        const taskScore = this.calculatePatternScore(lowercaseQuery, taskPatterns);
        if (taskScore > 0.4) {
            keywords.push(...this.extractKeywords(lowercaseQuery, ['task', 'todo', 'do', 'complete']));
            return {
                intent: 'task',
                confidence: Math.min(taskScore, 0.9),
                keywords
            };
        }

        // Approval Detection
        const approvalPatterns = [
            /(?:approval|approve|authorize|permission)/i,
            /(?:need|required|request)/i,
        ];
        const approvalScore = this.calculatePatternScore(lowercaseQuery, approvalPatterns);
        if (approvalScore > 0.4) {
            keywords.push(...this.extractKeywords(lowercaseQuery, ['approval', 'approve', 'authorize']));
            return {
                intent: 'approval',
                confidence: Math.min(approvalScore, 0.9),
                keywords
            };
        }

        // Finance Detection
        const financePatterns = [
            /(?:donation|donate|payment|transaction|amount|rupee|₹|rs\.?)/i,
            /(?:record|enter|add|log)/i,
            /\d+[,\d]*(?:k|thousand|lakh|crore)?/i, // Amount patterns
        ];
        const financeScore = this.calculatePatternScore(lowercaseQuery, financePatterns);
        if (financeScore > 0.4) {
            keywords.push(...this.extractKeywords(lowercaseQuery, ['donation', 'payment', 'finance', 'amount']));
            return {
                intent: 'finance',
                confidence: Math.min(financeScore, 0.9),
                keywords
            };
        }

        // Event Detection
        const eventPatterns = [
            /(?:event|festival|celebration|ceremony|function)/i,
            /(?:plan|organize|arrange)/i,
        ];
        const eventScore = this.calculatePatternScore(lowercaseQuery, eventPatterns);
        if (eventScore > 0.4) {
            keywords.push(...this.extractKeywords(lowercaseQuery, ['event', 'festival', 'celebration']));
            return {
                intent: 'event',
                confidence: Math.min(eventScore, 0.9),
                keywords
            };
        }

        // Planner Detection
        const plannerPatterns = [
            /(?:plan|planner|action|todo|add\s+to\s+plan)/i,
            /(?:create|make|add)/i,
        ];
        const plannerScore = this.calculatePatternScore(lowercaseQuery, plannerPatterns);
        if (plannerScore > 0.4 && !lowercaseQuery.includes('approval') && !lowercaseQuery.includes('vip') && !lowercaseQuery.includes('finance')) {
            keywords.push(...this.extractKeywords(lowercaseQuery, ['plan', 'planner', 'action', 'todo']));
            return {
                intent: 'planner',
                confidence: Math.min(plannerScore, 0.9),
                keywords
            };
        }

        // Unknown intent
        return {
            intent: 'unknown',
            confidence: 0.1,
            keywords: []
        };
    }

    /**
     * Calculate pattern matching score (0-1)
     */
    private static calculatePatternScore(query: string, patterns: RegExp[]): number {
        let matches = 0;
        for (const pattern of patterns) {
            if (pattern.test(query)) {
                matches++;
            }
        }
        return matches / patterns.length;
    }

    /**
     * Extract relevant keywords from query
     */
    private static extractKeywords(query: string, keywords: string[]): string[] {
        const found: string[] = [];
        for (const keyword of keywords) {
            if (query.includes(keyword)) {
                found.push(keyword);
            }
        }
        return found;
    }
}

