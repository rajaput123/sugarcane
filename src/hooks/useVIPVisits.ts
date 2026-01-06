/**
 * VIP Visits State Management Hook
 * 
 * Manages VIP visit state with CRUD operations
 * and localStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { VIPVisit } from '@/types/vip';

const STORAGE_KEY = 'temple_vip_visits';

export function useVIPVisits() {
    const [vipVisits, setVIPVisits] = useState<VIPVisit[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setVIPVisits(parsed);
            }
        } catch (error) {
            console.error('Error loading VIP visits from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage whenever visits change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(vipVisits));
            } catch (error) {
                console.error('Error saving VIP visits to localStorage:', error);
            }
        }
    }, [vipVisits, isLoaded]);

    /**
     * Add a new VIP visit (with duplicate detection)
     */
    const addVIPVisit = useCallback((visit: Omit<VIPVisit, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
        let resultVisit: VIPVisit | null = null;

        setVIPVisits(prev => {
            // Check if visit already exists (duplicate detection)
            const existingVisit = prev.find(v => 
                v.visitor === visit.visitor && 
                v.date === visit.date && 
                v.time === visit.time
            );

            if (existingVisit) {
                // Update existing visit instead of creating duplicate
                const updatedVisit: VIPVisit = {
                    ...existingVisit,
                    ...visit,
                    updatedAt: new Date().toISOString(),
                    updatedBy: 'current-user',
                };
                resultVisit = updatedVisit;
                return prev.map(v => v.id === existingVisit.id ? updatedVisit : v);
            }

            // Create new visit if no duplicate found
            const newVisit: VIPVisit = {
                ...visit,
                id: `vip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'current-user',
                updatedBy: 'current-user',
            };
            resultVisit = newVisit;
            return [...prev, newVisit];
        });
        
        // Return the visit (either updated or newly created)
        // Note: This will be the visit object we set above
        return resultVisit || {
            ...visit,
            id: `vip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            updatedBy: 'current-user',
        } as VIPVisit;
    }, []);

    /**
     * Update an existing VIP visit
     */
    const updateVIPVisit = useCallback((id: string, updates: Partial<VIPVisit>) => {
        setVIPVisits(prev =>
            prev.map(visit =>
                visit.id === id
                    ? { ...visit, ...updates, updatedAt: new Date().toISOString(), updatedBy: 'current-user' }
                    : visit
            )
        );
    }, []);

    /**
     * Delete a VIP visit
     */
    const deleteVIPVisit = useCallback((id: string) => {
        setVIPVisits(prev => prev.filter(visit => visit.id !== id));
    }, []);

    /**
     * Get VIP visit by ID
     */
    const getVIPVisitById = useCallback((id: string): VIPVisit | undefined => {
        return vipVisits.find(visit => visit.id === id);
    }, [vipVisits]);

    /**
     * Get upcoming VIP visits (sorted by date/time)
     */
    const getUpcomingVisits = useCallback((): VIPVisit[] => {
        const now = new Date();
        return vipVisits
            .filter(visit => {
                const visitDate = new Date(`${visit.date}T${visit.time}`);
                return visitDate >= now;
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA.getTime() - dateB.getTime();
            });
    }, [vipVisits]);

    return {
        vipVisits,
        isLoaded,
        addVIPVisit,
        updateVIPVisit,
        deleteVIPVisit,
        getVIPVisitById,
        getUpcomingVisits,
    };
}

