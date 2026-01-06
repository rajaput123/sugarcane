/**
 * Quick Action Handler Service
 * 
 * Handles "Show" queries (alerts, appointments, approvals, finance)
 * that replace the default info card with relevant component views.
 */

export interface QuickActionResult {
    sectionId: string;
    sectionTitle: string;
    responseMessage: string;
}

export class QuickActionHandler {
    /**
     * Main entry point - handles quick action queries
     */
    static handleQuery(query: string): QuickActionResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a quick action query (Show, View, List, Check)
        const isQuickAction = lowercaseQuery.startsWith('show') || 
                             lowercaseQuery.includes('view') || 
                             lowercaseQuery.includes('list') ||
                             lowercaseQuery.includes('check');
        
        if (!isQuickAction) return null;

        // Date detection
        const isFuture = lowercaseQuery.includes('tomorrow') ||
                        lowercaseQuery.includes('next week') ||
                        lowercaseQuery.includes('future') ||
                        lowercaseQuery.includes('upcoming');
        const datePrefix = isFuture ? 'Tomorrow\'s' : 'Today\'s';

        // Handle VIP visits (check before appointments to avoid conflicts)
        if (lowercaseQuery.includes('vip') && (lowercaseQuery.includes('visit') || lowercaseQuery.includes('visits'))) {
            return {
                sectionId: 'focus-vip',
                sectionTitle: `${datePrefix} VIP Visits`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} VIP visits.`
            };
        }

        // Handle appointments/calendar/schedule (explicit "Show appointments" support)
        if (lowercaseQuery.includes('appointment') || lowercaseQuery.includes('calendar') || lowercaseQuery.includes('schedule')) {
            return {
                sectionId: 'focus-appointments',
                sectionTitle: `${datePrefix} Appointments`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} appointments and schedule.`
            };
        }

        // Handle approvals
        if (lowercaseQuery.includes('approval')) {
            return {
                sectionId: 'focus-approvals',
                sectionTitle: `${datePrefix} Approvals`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} pending approvals.`
            };
        }

        // Handle alerts/reminders/notifications
        if (lowercaseQuery.includes('alert') || lowercaseQuery.includes('reminder') || lowercaseQuery.includes('notification')) {
            return {
                sectionId: 'focus-alert',
                sectionTitle: `${datePrefix} Alerts`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} alerts and reminders.`
            };
        }

        // Handle finance/summary/collection/payment/revenue/hundi
        if (lowercaseQuery.includes('finance') || 
            lowercaseQuery.includes('summary') || 
            lowercaseQuery.includes('collection') || 
            lowercaseQuery.includes('payment') || 
            lowercaseQuery.includes('revenue') || 
            lowercaseQuery.includes('hundi')) {
            
            // Check if it's an actionable finance query
            const isActionable = lowercaseQuery.includes('approve') || 
                               lowercaseQuery.includes('pay') || 
                               lowercaseQuery.includes('transfer') || 
                               lowercaseQuery.includes('create');
            
            if (isActionable) {
                return {
                    sectionId: 'focus-finance',
                    sectionTitle: 'Morning Revenue Analysis',
                    responseMessage: 'Processing your finance request...'
                };
            } else {
                return {
                    sectionId: 'focus-finance',
                    sectionTitle: `${datePrefix} Finance Summary`,
                    responseMessage: `Showing ${datePrefix.toLowerCase()} financial summary.`
                };
            }
        }

        return null;
    }
}

