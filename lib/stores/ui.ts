import { create } from 'zustand';

export type NavGroupId = 'workspace' | 'agents' | 'config' | 'intelligence' | 'tools';
export type SettingsCategory = 'appearance' | 'behavior' | 'agent' | 'integrations' | 'privacy' | 'developer';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface UIState {
  // Navigation state
  navOpen: boolean;
  expandedNavGroups: Set<NavGroupId>;
  
  // Settings state
  settingsOpen: boolean;
  activeSettingsCategory: SettingsCategory;
  
  // Device state
  deviceType: DeviceType;
  screenWidth: number;
  
  // Sound preferences
  soundEnabled: boolean;
  animationsEnabled: boolean;
  
  // Panel collapse state
  navCollapsed: boolean;
  settingsCollapsed: boolean;
  
  // Actions
  toggleNav: () => void;
  toggleNavGroup: (groupId: NavGroupId) => void;
  expandNavGroup: (groupId: NavGroupId) => void;
  collapseNavGroup: (groupId: NavGroupId) => void;
  toggleSettings: () => void;
  setActiveSettingsCategory: (category: SettingsCategory) => void;
  setDeviceType: (type: DeviceType) => void;
  setScreenWidth: (width: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  toggleNavCollapsed: () => void;
  toggleSettingsCollapsed: () => void;
  setNavCollapsed: (collapsed: boolean) => void;
  setSettingsCollapsed: (collapsed: boolean) => void;
  closeAllPanels: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  navOpen: false,
  expandedNavGroups: new Set(['workspace', 'agents']),
  settingsOpen: false,
  activeSettingsCategory: 'appearance',
  deviceType: 'desktop',
  screenWidth: 1024,
  soundEnabled: false,
  animationsEnabled: true,
  navCollapsed: false,
  settingsCollapsed: false,

  toggleNav: () =>
    set((state) => ({
      navOpen: !state.navOpen,
    })),

  toggleNavGroup: (groupId) =>
    set((state) => {
      const newGroups = new Set(state.expandedNavGroups);
      if (newGroups.has(groupId)) {
        newGroups.delete(groupId);
      } else {
        newGroups.add(groupId);
      }
      return { expandedNavGroups: newGroups };
    }),

  expandNavGroup: (groupId) =>
    set((state) => {
      const newGroups = new Set(state.expandedNavGroups);
      newGroups.add(groupId);
      return { expandedNavGroups: newGroups };
    }),

  collapseNavGroup: (groupId) =>
    set((state) => {
      const newGroups = new Set(state.expandedNavGroups);
      newGroups.delete(groupId);
      return { expandedNavGroups: newGroups };
    }),

  toggleSettings: () =>
    set((state) => ({
      settingsOpen: !state.settingsOpen,
    })),

  setActiveSettingsCategory: (category) =>
    set({ activeSettingsCategory: category }),

  setDeviceType: (type) =>
    set({ deviceType: type }),

  setScreenWidth: (width) => {
    const deviceType: DeviceType =
      width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';

    set({
      screenWidth: width,
      deviceType,
      // Auto-collapse nav on mobile
      navOpen: width >= 1024 ? get().navOpen : false,
    });
  },

  setSoundEnabled: (enabled) =>
    set({ soundEnabled: enabled }),

  setAnimationsEnabled: (enabled) =>
    set({ animationsEnabled: enabled }),

  toggleNavCollapsed: () =>
    set((state) => ({
      navCollapsed: !state.navCollapsed,
    })),

  toggleSettingsCollapsed: () =>
    set((state) => ({
      settingsCollapsed: !state.settingsCollapsed,
    })),

  setNavCollapsed: (collapsed) =>
    set({ navCollapsed: collapsed }),

  setSettingsCollapsed: (collapsed) =>
    set({ settingsCollapsed: collapsed }),

  closeAllPanels: () =>
    set({
      navOpen: false,
      settingsOpen: false,
    }),
}));
