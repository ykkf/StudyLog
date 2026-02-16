import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppData, Theme, LearningItem, StudyRecord, StudyPlan, User } from '../types';
import { storage } from '../utils/storage';

interface DataContextType {
    data: AppData;
    isLoading: boolean;
    save: () => void;
    updateUser: (user: Partial<User>) => void;
    addTheme: (theme: Theme) => void;
    updateTheme: (theme: Theme) => void;
    deleteTheme: (themeId: string) => void;
    addItem: (item: LearningItem) => void;
    updateItem: (item: LearningItem) => void;
    deleteItem: (itemId: string) => void;
    addRecord: (record: StudyRecord) => void;
    updateRecord: (record: StudyRecord) => void;
    deleteRecord: (recordId: string) => void;
    addPlan: (plan: StudyPlan) => void;
    updatePlan: (plan: StudyPlan) => void;
    deletePlan: (planId: string) => void;
    toggleTheme: () => void;
    importData: (jsonData: string) => boolean;
    resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData>(storage.loadData());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial load simulation (if needed) or just setting loaded state
        setIsLoading(false);
    }, []);

    const save = () => {
        storage.saveData(data);
    };

    // Auto-save whenever data changes
    useEffect(() => {
        if (!isLoading) {
            storage.saveData(data);
        }
    }, [data, isLoading]);

    const updateUser = (userUpdates: Partial<User>) => {
        setData(prev => ({ ...prev, user: { ...prev.user, ...userUpdates } }));
    };

    const addTheme = (theme: Theme) => {
        setData(prev => ({ ...prev, themes: [...prev.themes, theme] }));
    };

    const updateTheme = (updatedTheme: Theme) => {
        setData(prev => ({
            ...prev,
            themes: prev.themes.map(t => t.id === updatedTheme.id ? updatedTheme : t)
        }));
    };

    const deleteTheme = (themeId: string) => {
        setData(prev => ({
            ...prev,
            themes: prev.themes.filter(t => t.id !== themeId),
            // Also delete related items? Or keep them orphaned?
            // For simplicity, let's keep them (or filter them out in UI)
            // Ideally should cascade delete
            items: prev.items.filter(i => i.themeId !== themeId)
        }));
    };

    const addItem = (item: LearningItem) => {
        setData(prev => ({ ...prev, items: [...prev.items, item] }));
    };

    const updateItem = (updatedItem: LearningItem) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map(i => i.id === updatedItem.id ? updatedItem : i)
        }));
    };

    const deleteItem = (itemId: string) => {
        setData(prev => ({
            ...prev,
            items: prev.items.filter(i => i.id !== itemId)
        }));
    };

    const addRecord = (record: StudyRecord) => {
        setData(prev => ({ ...prev, records: [...prev.records, record] }));
    };

    const addPlan = (plan: StudyPlan) => {
        setData(prev => ({ ...prev, plans: [...prev.plans, plan] }));
    };

    const updatePlan = (updatedPlan: StudyPlan) => {
        setData(prev => ({
            ...prev,
            plans: prev.plans.map(p => p.id === updatedPlan.id ? updatedPlan : p)
        }));
    };

    const deletePlan = (planId: string) => {
        setData(prev => ({
            ...prev,
            plans: prev.plans.filter(p => p.id !== planId)
        }));
    };

    const updateRecord = (updatedRecord: StudyRecord) => {
        setData(prev => ({
            ...prev,
            records: prev.records.map(r => r.id === updatedRecord.id ? updatedRecord : r)
        }));
    };

    const deleteRecord = (recordId: string) => {
        setData(prev => ({
            ...prev,
            records: prev.records.filter(r => r.id !== recordId)
        }));
    };

    const toggleTheme = () => {
        setData(prev => ({
            ...prev,
            themeMode: prev.themeMode === 'dark' ? 'light' : 'dark'
        }));
    };

    const importData = (jsonData: string): boolean => {
        try {
            const parsed = JSON.parse(jsonData) as AppData;
            // Basic validation could be added here
            if (!parsed.appVersion) return false;
            setData(parsed);
            return true;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    };

    const resetData = () => {
        storage.clearData();
        setData(storage.loadData()); // Reloads initial data
    };

    return (
        <DataContext.Provider value={{
            data,
            isLoading,
            save,
            updateUser,
            addTheme,
            updateTheme,
            deleteTheme,
            addItem,
            updateItem,
            deleteItem,
            addRecord,
            updateRecord,
            deleteRecord,
            addPlan,
            updatePlan,
            deletePlan,
            toggleTheme,
            importData,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
