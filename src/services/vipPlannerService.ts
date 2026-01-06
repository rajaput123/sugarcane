/**
 * VIP Planner Service
 * 
 * Generates context-aware planner actions based on VIP visit details
 * and protocol level.
 */

import { VIPVisit, VIPProtocolLevel } from '@/types/vip';

export class VIPPlannerService {
    /**
     * Generate planner actions based on VIP visit
     */
    static generateVIPPlannerActions(visit: VIPVisit): string[] {
        const actions: string[] = [];

        switch (visit.protocolLevel) {
            case 'maximum':
                actions.push(...this.getMaximumProtocolActions(visit));
                break;
            case 'high':
                actions.push(...this.getHighProtocolActions(visit));
                break;
            case 'standard':
                actions.push(...this.getStandardProtocolActions(visit));
                break;
        }

        return actions;
    }

    /**
     * Maximum protocol actions (Prime Minister, President, etc.)
     */
    private static getMaximumProtocolActions(visit: VIPVisit): string[] {
        return [
            'Coordinate with security agencies for high-level security briefing',
            'Clear and secure VIP route from entry point to sanctum',
            'Arrange media management and press coordination',
            'Prepare special prasadam arrangements for VIP delegation',
            'Reserve exclusive VIP parking area with security',
            'Coordinate sanctum access with head priest',
            'Brief all security staff on protocol requirements',
            'Arrange executive officer as lead escort',
            'Prepare welcome ceremony at main entrance',
            'Coordinate with local administration if required'
        ];
    }

    /**
     * High protocol actions (Ministers, Judges, etc.)
     */
    private static getHighProtocolActions(visit: VIPVisit): string[] {
        return [
            'Coordinate security arrangements with temple security team',
            'Reserve VIP parking space',
            'Arrange special prasadam for visitor and delegation',
            'Assign designated escort from temple staff',
            'Brief sanctum security on visitor arrival',
            'Prepare welcome at main entrance',
            'Coordinate with relevant department heads'
        ];
    }

    /**
     * Standard protocol actions (Other VIPs)
     */
    private static getStandardProtocolActions(visit: VIPVisit): string[] {
        return [
            'Notify security team of VIP visit',
            'Reserve standard VIP parking',
            'Arrange standard prasadam',
            'Assign temple staff as escort',
            'Prepare basic welcome arrangements'
        ];
    }

    /**
     * Format actions for planner component
     */
    static formatActionsForPlanner(actions: string[]): string {
        return actions.map(action => `[·] ${action}`).join('\n');
    }
}

