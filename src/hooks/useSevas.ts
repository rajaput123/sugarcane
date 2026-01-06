/**
 * Sevas State Management Hook
 * 
 * Manages seva state with CRUD operations
 * and localStorage persistence for images and data.
 */

import { useState, useEffect, useCallback } from 'react';
import { Seva } from '@/types/seva';

const STORAGE_KEY = 'temple_management_sevas';

export function useSevas(initialSevas: Seva[] = []) {
    const [sevas, setSevas] = useState<Seva[]>(initialSevas);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with initial sevas, prioritizing stored data
                if (parsed && parsed.length > 0) {
                    setSevas(parsed);
                } else if (initialSevas.length > 0) {
                    setSevas(initialSevas);
                }
            } else if (initialSevas.length > 0) {
                // First time - save initial sevas
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSevas));
                setSevas(initialSevas);
            }
        } catch (error) {
            console.error('Error loading sevas from localStorage:', error);
            if (initialSevas.length > 0) {
                setSevas(initialSevas);
            }
        } finally {
            setIsLoaded(true);
        }
    }, []); // Only run on mount

    // Save to localStorage whenever sevas change
    useEffect(() => {
        if (isLoaded && sevas.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sevas));
            } catch (error) {
                console.error('Error saving sevas to localStorage:', error);
            }
        }
    }, [sevas, isLoaded]);

    /**
     * Update seva images
     */
    const updateSevaImages = useCallback((sevaId: string, images: string[]) => {
        setSevas(prev => prev.map(s => 
            s.id === sevaId ? { ...s, images, updatedAt: new Date().toISOString() } : s
        ));
    }, []);

    /**
     * Update seva data
     */
    const updateSeva = useCallback((sevaId: string, updates: Partial<Seva>) => {
        setSevas(prev => prev.map(s => 
            s.id === sevaId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        ));
    }, []);

    /**
     * Add new seva
     */
    const addSeva = useCallback((seva: Omit<Seva, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
        const newSeva: Seva = {
            ...seva,
            id: `seva-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            updatedBy: 'current-user',
        };
        setSevas(prev => [...prev, newSeva]);
        return newSeva;
    }, []);

    return {
        sevas,
        isLoaded,
        updateSevaImages,
        updateSeva,
        addSeva,
        setSevas,
    };
}

