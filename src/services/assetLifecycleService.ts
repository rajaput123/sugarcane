/**
 * Asset Lifecycle Service
 * 
 * Enforces the universal 8-state lifecycle with proper transitions
 */

import { Asset, AssetLifecycleState } from '@/types/asset';

const VALID_TRANSITIONS: Record<AssetLifecycleState, AssetLifecycleState[]> = {
    'get': ['write'], // Acquire → Register
    'write': ['lock', 'use'], // Register → Lock (for security) or Use (direct usage)
    'lock': ['use', 'check'], // Lock → Use (authorized) or Check (audit)
    'use': ['care', 'check', 'lock'], // Use → Care (maintenance) or Check (audit) or Lock (return to custody)
    'care': ['use', 'check'], // Care → Use (after maintenance) or Check (verification)
    'check': ['value', 'use', 'lock'], // Check → Value (after audit) or Use/Lock (continue)
    'value': ['use', 'lock', 'close'], // Value → Use/Lock (continue) or Close (dispose)
    'close': [], // Close is terminal (but can be 'continue' for some assets)
};

export class AssetLifecycleService {
    /**
     * Check if a lifecycle state transition is valid
     */
    static canTransition(
        currentState: AssetLifecycleState,
        targetState: AssetLifecycleState
    ): boolean {
        // Allow staying in same state
        if (currentState === targetState) return true;
        
        // Check valid transitions
        const validTargets = VALID_TRANSITIONS[currentState];
        return validTargets.includes(targetState);
    }

    /**
     * Get all valid next states for an asset
     */
    static getValidNextStates(currentState: AssetLifecycleState): AssetLifecycleState[] {
        return VALID_TRANSITIONS[currentState] || [];
    }

    /**
     * Transition asset to new state with validation
     */
    static transitionAsset(
        asset: Asset,
        newState: AssetLifecycleState,
        userId: string
    ): { success: boolean; asset?: Asset; error?: string } {
        if (!this.canTransition(asset.lifecycleState, newState)) {
            return {
                success: false,
                error: `Cannot transition from ${asset.lifecycleState} to ${newState}. Valid next states: ${this.getValidNextStates(asset.lifecycleState).join(', ')}`
            };
        }

        // Additional validation based on state
        if (newState === 'lock' && !asset.custodianId) {
            return {
                success: false,
                error: 'Cannot lock asset without assigning a custodian'
            };
        }

        if (newState === 'value' && asset.currentValue <= 0) {
            return {
                success: false,
                error: 'Cannot value asset without a valid value'
            };
        }

        // Transition successful
        return {
            success: true,
            asset: {
                ...asset,
                lifecycleState: newState,
                updatedAt: new Date().toISOString(),
                updatedBy: userId
            }
        };
    }

    /**
     * Get lifecycle flow description
     */
    static getLifecycleFlow(): string {
        return 'Get → Write → Lock → Use → Care → Check → Value → Close';
    }
}

