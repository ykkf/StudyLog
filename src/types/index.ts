export interface User {
  name: string;
  icon?: string; // URL or base64
  message?: string;
}

export interface Theme {
  id: string;
  title: string;
  color: string; // Hex code
  createdAt: string; // ISO string
}

export interface LearningItem {
  id: string;
  themeId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string; // ISO string
}

export interface StudyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  themeId: string;
  itemId?: string;
  memo?: string;
  reflection?: string;
  createdAt: string; // ISO string
}

export interface StudyPlan {
  id: string;
  date: string; // YYYY-MM-DD
  themeId: string;
  content: string;
  isCompleted: boolean;
  createdAt: string; // ISO string
}

export interface AppData {
  appVersion: string;
  user: User;
  themes: Theme[];
  items: LearningItem[];
  records: StudyRecord[];
  plans: StudyPlan[];
  themeMode?: 'light' | 'dark';
}

export type Page = 'home' | 'items' | 'record' | 'plan' | 'settings' | 'history';
