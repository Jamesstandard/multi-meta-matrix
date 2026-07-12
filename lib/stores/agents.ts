import { create } from 'zustand';

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  framework: 'crewai' | 'autogen' | 'openclaw' | 'langgraph';
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet' | 'llama-2' | 'mixtral';
  role?: string;
  tools: string[];
  skills: string[];
  mcpTools: string[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

export interface AgentState {
  agents: Agent[];
  currentAgentId: string | null;
  
  // Actions
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  setCurrentAgent: (id: string | null) => void;
  getAgent: (id: string) => Agent | undefined;
  getAllAgents: () => Agent[];
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  currentAgentId: null,
  
  addAgent: (agent) =>
    set((state) => ({
      agents: [...state.agents, agent],
      currentAgentId: agent.id,
    })),
    
  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a
      ),
    })),
    
  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
      currentAgentId: state.currentAgentId === id ? null : state.currentAgentId,
    })),
    
  setCurrentAgent: (id) =>
    set({ currentAgentId: id }),
    
  getAgent: (id) => {
    const state = get();
    return state.agents.find((a) => a.id === id);
  },
  
  getAllAgents: () => {
    const state = get();
    return state.agents;
  },
}));
