/**
 * Temples State Management Hook
 * 
 * Manages temple state with CRUD operations
 * and localStorage persistence for images and data.
 */

import { useState, useEffect, useCallback } from 'react';
import { Temple } from '@/types/temple';

const STORAGE_KEY = 'temple_management_temples';

export function useTemples(initialTemples: Temple[] = []) {
    const [temples, setTemples] = useState<Temple[]>(initialTemples);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with initial temples, prioritizing stored data
                if (parsed && parsed.length > 0) {
                    setTemples(parsed);
                } else if (initialTemples.length > 0) {
                    setTemples(initialTemples);
                }
            } else if (initialTemples.length > 0) {
                // First time - save initial temples
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTemples));
                setTemples(initialTemples);
            }
        } catch (error) {
            console.error('Error loading temples from localStorage:', error);
            if (initialTemples.length > 0) {
                setTemples(initialTemples);
            }
        } finally {
            setIsLoaded(true);
        }
    }, []); // Only run on mount

    // Save to localStorage whenever temples change
    useEffect(() => {
        if (isLoaded && temples.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(temples));
            } catch (error) {
                console.error('Error saving temples to localStorage:', error);
            }
        }
    }, [temples, isLoaded]);

    /**
     * Update temple images
     */
    const updateTempleImages = useCallback((templeId: string, images: string[]) => {
        setTemples(prev => prev.map(t => 
            t.id === templeId ? { ...t, images, updatedAt: new Date().toISOString() } : t
        ));
    }, []);

    /**
     * Update temple data
     */
    const updateTemple = useCallback((templeId: string, updates: Partial<Temple>) => {
        setTemples(prev => prev.map(t => 
            t.id === templeId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        ));
    }, []);

    /**
     * Add new temple
     */
    const addTemple = useCallback((temple: Omit<Temple, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
        const newTemple: Temple = {
            ...temple,
            id: `temple-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            updatedBy: 'current-user',
        };
        setTemples(prev => [...prev, newTemple]);
        return newTemple;
    }, []);

    return {
        temples,
        isLoaded,
        updateTempleImages,
        updateTemple,
        addTemple,
        setTemples,
    };
}

