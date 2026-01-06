
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    InventoryItem,
    StockStatusItem,
    InventoryAlert,
    ReplenishmentRequest,
    StockAdjustment
} from '@/types/inventory';
import {
    mockInventoryItems,
    mockStockStatus,
    mockAlerts,
    mockReplenishmentRequests,
    mockStockAdjustments
} from '@/data/mockInventoryData';

interface InventoryContextType {
    // State
    items: InventoryItem[];
    stockStatus: StockStatusItem[];
    alerts: InventoryAlert[];
    replenishmentRequests: ReplenishmentRequest[];
    stockAdjustments: StockAdjustment[];

    // Item Actions
    addItem: (item: any) => void;
    updateItem: (id: string, updates: Partial<InventoryItem>) => void;
    deleteItem: (id: string) => void;

    // Stock Actions
    adjustStock: (itemId: string, quantity: number, reason: string, notes?: string) => void;

    // Reorder Actions
    createReorder: (itemId: string, quantity: number) => void;
    updateReorderStatus: (requestId: string, status: any) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
    const [stockStatus, setStockStatus] = useState<StockStatusItem[]>(mockStockStatus);
    const [alerts, setAlerts] = useState<InventoryAlert[]>(mockAlerts);
    const [replenishmentRequests, setReplenishmentRequests] = useState<ReplenishmentRequest[]>(mockReplenishmentRequests);
    const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>(mockStockAdjustments);

    // Item Actions
    const addItem = (item: any) => {
        const newItem: InventoryItem = {
            ...item,
            id: `ITEM-${Date.now()}`,
            name: item.name || item.itemName // Handle both since mismatch exists
        };
        setItems(prev => [...prev, newItem]);

        // Also add to stock status
        const newStockStatus: StockStatusItem = {
            itemId: newItem.id,
            itemName: newItem.name,
            category: newItem.category,
            sacredStatus: newItem.sacredStatus,
            currentStock: item.currentStock || 0,
            unit: newItem.unit,
            minimumRequired: item.minimumRequired || 10,
            reservedQuantity: 0,
            availableBalance: item.currentStock || 0,
            status: (item.currentStock || 0) < (item.minimumRequired || 10) ? 'Low' : 'OK',
            lastUpdated: new Date().toISOString()
        };
        setStockStatus(prev => [...prev, newStockStatus]);
    };

    const updateItem = (id: string, updates: Partial<InventoryItem>) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        setStockStatus(prev => prev.filter(s => s.itemId !== id));
        setAlerts(prev => prev.filter(alert => alert.itemId !== id));
    };

    // Stock Actions
    const adjustStock = (itemId: string, quantity: number, reason: string, notes?: string) => {
        let itemName = '';
        setStockStatus(prev => prev.map(s => {
            if (s.itemId !== itemId) return s;
            itemName = s.itemName;
            const newStock = s.currentStock + quantity;
            return {
                ...s,
                currentStock: newStock,
                availableBalance: newStock - s.reservedQuantity,
                status: newStock < s.minimumRequired ? (newStock < s.minimumRequired / 2 ? 'Critical' : 'Low') : 'OK',
                lastUpdated: new Date().toISOString()
            };
        }));

        // Log adjustment
        const newAdjustment: StockAdjustment = {
            id: `ADJ-${Date.now()}`,
            itemId,
            itemName: itemName,
            adjustmentType: quantity > 0 ? 'Addition' : 'Deduction',
            quantity: Math.abs(quantity),
            reason,
            performedBy: 'ADMIN-01',
            date: new Date().toISOString().split('T')[0],
            notes
        };
        setStockAdjustments(prev => [...prev, newAdjustment]);
    };

    // Reorder Actions
    const createReorder = (itemId: string, quantity: number) => {
        const stock = stockStatus.find(s => s.itemId === itemId);
        if (!stock) return;

        const newRequest: ReplenishmentRequest = {
            id: `REQ-${Date.now()}`,
            itemId,
            itemName: stock.itemName,
            requestedQuantity: quantity,
            unit: stock.unit,
            priority: 'high',
            reason: 'Low stock replenishment',
            requestedBy: 'ADMIN-01',
            requestedAt: new Date().toISOString(),
            status: 'pending'
        };
        setReplenishmentRequests(prev => [...prev, newRequest]);
    };

    const updateReorderStatus = (requestId: string, status: any) => {
        setReplenishmentRequests(prev => prev.map(req => {
            if (req.id !== requestId) return req;

            // If received, add stock
            if (status === 'received' && req.status !== 'received') {
                adjustStock(req.itemId, req.requestedQuantity, 'Reorder received');
            }

            return { ...req, status };
        }));
    };

    const value: InventoryContextType = {
        items,
        stockStatus,
        alerts,
        replenishmentRequests,
        stockAdjustments,
        addItem,
        updateItem,
        deleteItem,
        adjustStock,
        createReorder,
        updateReorderStatus
    };

    return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
}
