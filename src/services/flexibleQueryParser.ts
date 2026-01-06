/**
 * Flexible Query Parser - Sringeri Sharada Peetham
 * 
 * Handles various query formats for planning, progress, actions, etc.
 */

export interface ParsedPlanningQuery {
    type: 'adhoc-visit' | 'event-planning';
    person?: string; // Jagadgurugalu, Gurugalu, Swamiji
    location?: string; // Kigga, Sringeri, temple names
    date?: string;
    time?: string;
    eventType?: string; // Sahasra Chandi Yaga, ritual, etc.
    vipAssociation?: boolean;
}

export interface ParsedProgressQuery {
    festivalName?: string; // Navaratri, etc.
    eventName?: string;
    returnType: 'summary' | 'detailed';
}

export interface ParsedActionQuery {
    action: 'add' | 'extend' | 'invite' | 'ask';
    entityType?: string; // devotees, employees, tasks, items
    recipients?: string[]; // CM, LOP, Chief Minister, etc.
    target?: string; // kitchen dep, etc.
}

export interface ParsedKitchenQuery {
    requestType: 'menu' | 'clear-menu' | 'recipe' | 'batch-status';
    menuType?: 'prasad' | 'annadanam' | 'breakfast' | 'lunch' | 'dinner';
}

export class FlexibleQueryParser {
    /**
     * Parse planning queries (adhoc visits, event planning)
     */
    static parsePlanningQuery(query: string): ParsedPlanningQuery | null {
        const lowerQuery = query.toLowerCase();

        // Check for planning keywords
        const isPlanning = lowerQuery.includes('plan') || 
                          lowerQuery.includes('schedule') || 
                          lowerQuery.includes('arrange') ||
                          lowerQuery.includes('organize') ||
                          lowerQuery.includes('set up');

        if (!isPlanning) return null;

        // Check for adhoc visit
        const isAdhocVisit = lowerQuery.includes('adhoc') || 
                            lowerQuery.includes('visit') ||
                            (lowerQuery.includes('jagadgurugalu') || lowerQuery.includes('gurugalu') || lowerQuery.includes('swamiji'));

        if (isAdhocVisit) {
            return this.parseAdhocVisit(query);
        }

        // Check for event planning
        const isEventPlanning = lowerQuery.includes('yaga') || 
                               lowerQuery.includes('ritual') ||
                               lowerQuery.includes('ceremony') ||
                               lowerQuery.includes('event');

        if (isEventPlanning) {
            return this.parseEventPlanning(query);
        }

        return null;
    }

    private static parseAdhocVisit(query: string): ParsedPlanningQuery {
        const lowerQuery = query.toLowerCase();
        const result: ParsedPlanningQuery = { type: 'adhoc-visit' };

        // Extract person
        if (lowerQuery.includes('jagadgurugalu')) {
            result.person = 'Jagadgurugalu';
        } else if (lowerQuery.includes('gurugalu')) {
            result.person = 'Gurugalu';
        } else if (lowerQuery.includes('swamiji')) {
            result.person = 'Swamiji';
        }

        // Extract location
        if (lowerQuery.includes('kigga')) {
            result.location = 'Kigga';
        } else if (lowerQuery.includes('sringeri')) {
            result.location = 'Sringeri';
        }

        // Extract date/time
        const dateMatch = query.match(/(today|tomorrow|next week|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
        if (dateMatch) {
            result.date = dateMatch[1];
        }

        // Extract time - handle formats like "4:00 pm", "4 pm", "@ 4:00 pm", "at 4:00 pm"
        const timeMatch = query.match(/(?:@|at)?\s*(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)/i);
        if (timeMatch) {
            // Reconstruct time string
            const hour = timeMatch[1];
            const minutes = timeMatch[2] || '00';
            const period = timeMatch[3];
            result.time = `${hour}:${minutes} ${period}`;
        }

        return result;
    }

    private static parseEventPlanning(query: string): ParsedPlanningQuery {
        const lowerQuery = query.toLowerCase();
        const result: ParsedPlanningQuery = { type: 'event-planning' };

        // Extract event type
        if (lowerQuery.includes('sahasra chandi yaga') || lowerQuery.includes('chandi yaga')) {
            result.eventType = 'Sahasra Chandi Yaga';
        } else if (lowerQuery.includes('yaga')) {
            result.eventType = 'Yaga';
        } else if (lowerQuery.includes('ritual')) {
            result.eventType = 'Ritual';
        }

        // Check for VIP association
        result.vipAssociation = lowerQuery.includes('vip') || 
                               lowerQuery.includes('associated with vip');

        // Extract date - handle formats like "3rd Feb", "3rd Feb 2024", "3 February", etc.
        const dateMatch = query.match(/(\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\s+\d{2,4})?)/i);
        if (dateMatch) {
            result.date = dateMatch[1];
        } else {
            // Also check for "tomorrow", "today", etc.
            if (lowerQuery.includes('tomorrow')) {
                result.date = 'Tomorrow';
            } else if (lowerQuery.includes('today')) {
                result.date = 'Today';
            }
        }

        return result;
    }

    /**
     * Parse progress/summary queries
     */
    static parseProgressQuery(query: string): ParsedProgressQuery | null {
        const lowerQuery = query.toLowerCase();

        const isProgress = lowerQuery.includes('progress') || 
                          lowerQuery.includes('status') ||
                          lowerQuery.includes('summary') ||
                          lowerQuery.includes('how is') ||
                          lowerQuery.includes('update');

        if (!isProgress) return null;

        const result: ParsedProgressQuery = {
            returnType: lowerQuery.includes('summary') || lowerQuery.includes('--summary') ? 'summary' : 'detailed'
        };

        // Extract festival/event name
        if (lowerQuery.includes('navaratri')) {
            result.festivalName = 'Navaratri';
        } else if (lowerQuery.includes('sankranti')) {
            result.festivalName = 'Sankranti';
        } else if (lowerQuery.includes('yaga')) {
            result.eventName = 'Yaga';
        }

        return result;
    }

    /**
     * Parse action queries (add, extend invite, etc.)
     */
    static parseActionQuery(query: string): ParsedActionQuery | null {
        const lowerQuery = query.toLowerCase();

        // Check for add action
        if (lowerQuery.includes('add') && (lowerQuery.includes('devotee') || lowerQuery.includes('action panel'))) {
            return {
                action: 'add',
                entityType: lowerQuery.includes('devotee') ? 'devotees' : 'actions'
            };
        }

        // Check for extend invite
        if (lowerQuery.includes('extend invite') || lowerQuery.includes('send invitation') || lowerQuery.includes('invite')) {
            const recipients: string[] = [];
            
            if (lowerQuery.includes('cm') || lowerQuery.includes('chief minister')) {
                recipients.push('Chief Minister');
            }
            if (lowerQuery.includes('lop') || lowerQuery.includes('leader of opposition')) {
                recipients.push('Leader of Opposition');
            }

            return {
                action: 'extend',
                recipients: recipients.length > 0 ? recipients : undefined
            };
        }

        // Check for ask/request
        if (lowerQuery.includes('ask for') || lowerQuery.includes('request')) {
            if (lowerQuery.includes('menu') && lowerQuery.includes('kitchen')) {
                return {
                    action: 'ask',
                    target: 'kitchen department'
                };
            }
        }

        return null;
    }

    /**
     * Parse kitchen queries
     */
    static parseKitchenQuery(query: string): ParsedKitchenQuery | null {
        const lowerQuery = query.toLowerCase();

        if (!lowerQuery.includes('kitchen') && !lowerQuery.includes('menu') && !lowerQuery.includes('prasad')) {
            return null;
        }

        if (lowerQuery.includes('clear menu') || lowerQuery.includes('menu from kitchen')) {
            return {
                requestType: 'clear-menu'
            };
        }

        if (lowerQuery.includes('menu')) {
            const result: ParsedKitchenQuery = { requestType: 'menu' };
            
            if (lowerQuery.includes('prasad')) {
                result.menuType = 'prasad';
            } else if (lowerQuery.includes('annadanam')) {
                result.menuType = 'annadanam';
            } else if (lowerQuery.includes('breakfast')) {
                result.menuType = 'breakfast';
            } else if (lowerQuery.includes('lunch')) {
                result.menuType = 'lunch';
            } else if (lowerQuery.includes('dinner')) {
                result.menuType = 'dinner';
            }

            return result;
        }

        if (lowerQuery.includes('batch') || lowerQuery.includes('production')) {
            return {
                requestType: 'batch-status'
            };
        }

        return null;
    }
}

