
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    KitchenDailyPlan,
    KitchenBatch,
    QualityCheck,
    DistributionSession,
    CounterStock,
    WastageLog,
    PlannedItem
} from '@/types/operations';
import {
    mockDailyPlan,
    mockBatches,
    mockQualityChecks,
    mockDistribution,
    mockCounterStock,
    mockWastage
} from '@/data/mockKitchenData';

interface KitchenContextType {
    // State
    dailyPlan: KitchenDailyPlan;
    batches: KitchenBatch[];
    qualityChecks: QualityCheck[];
    distribution: DistributionSession;
    counterStock: CounterStock[];
    wastage: WastageLog[];

    // Plan Actions
    addPlannedItem: (item: Omit<PlannedItem, 'id'>) => void;
    updatePlannedItem: (id: string, updates: Partial<PlannedItem>) => void;
    deletePlannedItem: (id: string) => void;
    approvePlan: () => void;

    // Batch Actions
    startBatch: (batchId: string, cookId: string, cookName: string) => void;
    completeBatch: (batchId: string, yieldAmount: number) => void;

    // Quality Actions
    submitQualityCheck: (check: Omit<QualityCheck, 'id'>) => void;

    // Distribution Actions
    updateMealsServed: (count: number) => void;

    // Counter Actions
    issueStock: (counterId: string, itemId: string, quantity: number) => void;

    // Wastage Actions
    addWastageLog: (log: Omit<WastageLog, 'id'>) => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export function KitchenProvider({ children }: { children: ReactNode }) {
    const [dailyPlan, setDailyPlan] = useState<KitchenDailyPlan>(mockDailyPlan);
    const [batches, setBatches] = useState<KitchenBatch[]>(mockBatches);
    const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(mockQualityChecks);
    const [distribution, setDistribution] = useState<DistributionSession>(mockDistribution);
    const [counterStock, setCounterStock] = useState<CounterStock[]>(mockCounterStock);
    const [wastage, setWastage] = useState<WastageLog[]>(mockWastage);

    // Plan Actions
    const addPlannedItem = (item: Omit<PlannedItem, 'id'>) => {
        const newItem: PlannedItem = {
            ...item,
            id: `ITEM-${Date.now()}`
        };
        setDailyPlan(prev => ({
            ...prev,
            plannedItems: [...prev.plannedItems, newItem]
        }));
    };

    const updatePlannedItem = (id: string, updates: Partial<PlannedItem>) => {
        setDailyPlan(prev => ({
            ...prev,
            plannedItems: prev.plannedItems.map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        }));
    };

    const deletePlannedItem = (id: string) => {
        setDailyPlan(prev => ({
            ...prev,
            plannedItems: prev.plannedItems.filter(item => item.id !== id)
        }));
    };

    const approvePlan = () => {
        setDailyPlan(prev => ({
            ...prev,
            status: 'Approved',
            approvedBy: 'ADMIN-01',
            approvedAt: new Date().toISOString()
        }));
    };

    // Batch Actions
    const startBatch = (batchId: string, cookId: string, cookName: string) => {
        setBatches(prev => prev.map(batch =>
            batch.id === batchId
                ? { ...batch, cookId, cookName, status: 'Cooking', startTime: new Date().toISOString() }
                : batch
        ));
    };

    const completeBatch = (batchId: string, yieldAmount: number) => {
        setBatches(prev => prev.map(batch =>
            batch.id === batchId
                ? { ...batch, yield: yieldAmount, endTime: new Date().toISOString(), status: 'Quality Check' }
                : batch
        ));
    };

    // Quality Actions
    const submitQualityCheck = (check: Omit<QualityCheck, 'id'>) => {
        const newCheck: QualityCheck = {
            ...check,
            id: `QC-${Date.now()}`
        };
        setQualityChecks(prev => [...prev, newCheck]);

        // Update batch status based on quality result
        setBatches(prev => prev.map(batch =>
            batch.id === check.batchId
                ? { ...batch, status: check.status === 'Passed' ? 'Completed' : 'Failed', qualityCheckId: newCheck.id }
                : batch
        ));
    };

    // Distribution Actions
    const updateMealsServed = (count: number) => {
        setDistribution(prev => ({
            ...prev,
            mealsServed: prev.mealsServed + count,
            lastUpdated: new Date().toISOString()
        }));
    };

    // Counter Actions
    const issueStock = (counterId: string, itemId: string, quantity: number) => {
        setCounterStock(prev => prev.map(counter => {
            if (counter.counterId !== counterId) return counter;

            return {
                ...counter,
                items: counter.items.map(item =>
                    item.itemId === itemId
                        ? {
                            ...item,
                            currentStock: item.currentStock - quantity,
                            totalIssued: item.totalIssued + quantity
                        }
                        : item
                )
            };
        }));
    };

    // Wastage Actions
    const addWastageLog = (log: Omit<WastageLog, 'id'>) => {
        const newLog: WastageLog = {
            ...log,
            id: `WST-${Date.now()}`
        };
        setWastage(prev => [...prev, newLog]);
    };

    const value: KitchenContextType = {
        dailyPlan,
        batches,
        qualityChecks,
        distribution,
        counterStock,
        wastage,
        addPlannedItem,
        updatePlannedItem,
        deletePlannedItem,
        approvePlan,
        startBatch,
        completeBatch,
        submitQualityCheck,
        updateMealsServed,
        issueStock,
        addWastageLog
    };

    return <KitchenContext.Provider value={value}>{children}</KitchenContext.Provider>;
}

export function useKitchen() {
    const context = useContext(KitchenContext);
    if (context === undefined) {
        throw new Error('useKitchen must be used within a KitchenProvider');
    }
    return context;
}
