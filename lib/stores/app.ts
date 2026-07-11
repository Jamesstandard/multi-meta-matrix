import { create } from 'zustand';

export interface AppState {
  sidebarOpen: boolean;
  settingsOpen: boolean;
  currentView: 'home' | 'chat' | 'swarms' | 'skills' | 'memory' | 'inspect';
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  autoSave: boolean;
  notifications: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setTheme: (theme: AppState['theme']) => void;
  toggleSound: () => void;
  toggleAutoSave: () => void;
  toggleNotifications: () => void;
  toggleCompactMode: () => void;
  toggleAnimations: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  settingsOpen: false,
  currentView: 'home',
  theme: 'light',
  soundEnabled: false,
  autoSave: true,
  notifications: true,
  compactMode: false,
  animationsEnabled: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
  setTheme: (theme) => set({ theme }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
  toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
  toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
  toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
}));
