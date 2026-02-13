import type { AppData } from '../types';

const STORAGE_KEY = 'studylog_data_v1';

const INITIAL_DATA: AppData = {
    appVersion: '1.0.0',
    user: {
        name: 'User',
    },
    themes: [],
    items: [],
    records: [],
    plans: [],
};

export const storage = {
    loadData: (): AppData => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                return JSON.parse(data) as AppData;
            }
        } catch (error) {
            console.error('Failed to load data', error);
        }
        return INITIAL_DATA;
    },

    saveData: (data: AppData): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save data', error);
        }
    },

    clearData: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    },

    exportBackup: (): string => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data || JSON.stringify(INITIAL_DATA);
    }
};
