import { create } from 'zustand';

export interface AppState {
  sidebarOpen: boolean;
  currentView: 'home' | 'chat' | 'swarms' | 'skills' | 'memory' | 'inspect';
  theme: 'light' | 'dark' | 'auto';
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setTheme: (theme: AppState['theme']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  currentView: 'home',
  theme: 'light',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
  setTheme: (theme) => set({ theme }),
}));
