import { create } from 'zustand';

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'pdf' | 'text' | 'url' | 'code';
  sourceUrl?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface LearnedMemory {
  id: string;
  agent_id: string;
  insight: string;
  confidence: number; // 0-100
  source: string;
  relatedSkills: string[];
  discoveredAt: number;
  lastUsed: number;
}

export interface MemoryState {
  // Knowledge Base
  knowledgeBase: KnowledgeBaseItem[];
  
  // Learned Memory
  learnedMemory: LearnedMemory[];
  
  // Actions - Knowledge Base
  addKnowledgeItem: (item: KnowledgeBaseItem) => void;
  updateKnowledgeItem: (id: string, updates: Partial<KnowledgeBaseItem>) => void;
  deleteKnowledgeItem: (id: string) => void;
  getKnowledgeItem: (id: string) => KnowledgeBaseItem | undefined;
  searchKnowledgeBase: (query: string) => KnowledgeBaseItem[];
  
  // Actions - Learned Memory
  addLearnedMemory: (memory: LearnedMemory) => void;
  updateLearnedMemory: (id: string, updates: Partial<LearnedMemory>) => void;
  deleteLearnedMemory: (id: string) => void;
  getLearnedMemory: (agentId: string) => LearnedMemory[];
  getHighConfidenceMemories: (threshold: number) => LearnedMemory[];
  recordMemoryUsage: (id: string) => void;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  knowledgeBase: [],
  learnedMemory: [],
  
  // Knowledge Base Actions
  addKnowledgeItem: (item) =>
    set((state) => ({
      knowledgeBase: [...state.knowledgeBase, item],
    })),
    
  updateKnowledgeItem: (id, updates) =>
    set((state) => ({
      knowledgeBase: state.knowledgeBase.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
      ),
    })),
    
  deleteKnowledgeItem: (id) =>
    set((state) => ({
      knowledgeBase: state.knowledgeBase.filter((item) => item.id !== id),
    })),
    
  getKnowledgeItem: (id) => {
    const state = get();
    return state.knowledgeBase.find((item) => item.id === id);
  },
  
  searchKnowledgeBase: (query) => {
    const state = get();
    const lowerQuery = query.toLowerCase();
    return state.knowledgeBase.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  },
  
  // Learned Memory Actions
  addLearnedMemory: (memory) =>
    set((state) => ({
      learnedMemory: [...state.learnedMemory, memory],
    })),
    
  updateLearnedMemory: (id, updates) =>
    set((state) => ({
      learnedMemory: state.learnedMemory.map((memory) =>
        memory.id === id ? { ...memory, ...updates } : memory
      ),
    })),
    
  deleteLearnedMemory: (id) =>
    set((state) => ({
      learnedMemory: state.learnedMemory.filter((memory) => memory.id !== id),
    })),
    
  getLearnedMemory: (agentId) => {
    const state = get();
    return state.learnedMemory.filter((memory) => memory.agent_id === agentId);
  },
  
  getHighConfidenceMemories: (threshold) => {
    const state = get();
    return state.learnedMemory.filter((memory) => memory.confidence >= threshold);
  },
  
  recordMemoryUsage: (id) =>
    set((state) => ({
      learnedMemory: state.learnedMemory.map((memory) =>
        memory.id === id ? { ...memory, lastUsed: Date.now() } : memory
      ),
    })),
}));
