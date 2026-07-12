import { create } from 'zustand';

export interface Integration {
  id: string;
  name: string;
  type: 'google-drive' | 'github' | 'email' | 'slack' | 'discord' | 'dropbox' | 'onedrive' | 's3' | 'notion';
  connected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  email?: string;
  scope?: string[];
  config: Record<string, any>;
  lastSyncedAt?: number;
  createdAt?: number;
}

export interface IntegrationState {
  integrations: Integration[];
  syncInProgress: Record<string, boolean>;
  addIntegration: (integration: Integration) => void;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  removeIntegration: (id: string) => void;
  getIntegration: (type: Integration['type']) => Integration | undefined;
  getAllConnected: () => Integration[];
  setSyncInProgress: (type: string, inProgress: boolean) => void;
  syncIntegration: (type: Integration['type']) => Promise<void>;
}

export const useIntegrationStore = create<IntegrationState>((set, get) => ({
  integrations: [],
  syncInProgress: {},
  
  addIntegration: (integration) =>
    set((state) => ({
      integrations: [...state.integrations, { ...integration, createdAt: Date.now() }],
    })),
    
  updateIntegration: (id, updates) =>
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),
    
  removeIntegration: (id) =>
    set((state) => ({
      integrations: state.integrations.filter((i) => i.id !== id),
    })),
    
  getIntegration: (type) => {
    const state = get();
    return state.integrations.find((i) => i.type === type);
  },
  
  getAllConnected: () => {
    const state = get();
    return state.integrations.filter((i) => i.connected);
  },
  
  setSyncInProgress: (type, inProgress) =>
    set((state) => ({
      syncInProgress: { ...state.syncInProgress, [type]: inProgress },
    })),
  
  syncIntegration: async (type) => {
    const state = get();
    const integration = state.integrations.find((i) => i.type === type);
    
    if (!integration || !integration.connected) {
      return;
    }
    
    set((state) => ({
      syncInProgress: { ...state.syncInProgress, [type]: true },
    }));
    
    try {
      // Simulate sync operation - in production, call actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      state.updateIntegration(integration.id, {
        lastSyncedAt: Date.now(),
      });
    } finally {
      set((state) => ({
        syncInProgress: { ...state.syncInProgress, [type]: false },
      }));
    }
  },
}));
