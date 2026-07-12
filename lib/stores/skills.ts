import { create } from 'zustand';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'tool' | 'skill' | 'mcp';
  source: 'built-in' | 'github' | 'uploaded' | 'web-scrape' | 'mcp-marketplace';
  sourceUrl?: string;
  code?: string;
  documentation?: string;
  parameters?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  verified: boolean;
}

export interface SkillState {
  skills: Skill[];
  favorites: string[];
  
  // Actions
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getSkill: (id: string) => Skill | undefined;
  getSkillsByCategory: (category: Skill['category']) => Skill[];
  getSkillsBySource: (source: Skill['source']) => Skill[];
  searchSkills: (query: string) => Skill[];
}

export const useSkillStore = create<SkillState>((set, get) => ({
  skills: [
    // Built-in skills
    {
      id: 'web-search',
      name: 'Web Search',
      description: 'Search the internet for information',
      category: 'tool',
      source: 'built-in',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['search', 'internet', 'information'],
      verified: true,
    },
    {
      id: 'code-interpreter',
      name: 'Code Interpreter',
      description: 'Execute Python code and analyze results',
      category: 'tool',
      source: 'built-in',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['code', 'python', 'execution'],
      verified: true,
    },
    {
      id: 'file-handler',
      name: 'File Handler',
      description: 'Upload, download, and manipulate files',
      category: 'tool',
      source: 'built-in',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['file', 'upload', 'download'],
      verified: true,
    },
    {
      id: 'python-skill',
      name: 'Python Programming',
      description: 'Write and execute Python scripts',
      category: 'skill',
      source: 'built-in',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['programming', 'python', 'scripting'],
      verified: true,
    },
    {
      id: 'javascript-skill',
      name: 'JavaScript Programming',
      description: 'Write and execute JavaScript code',
      category: 'skill',
      source: 'built-in',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['programming', 'javascript', 'web'],
      verified: true,
    },
  ],
  favorites: [],
  
  addSkill: (skill) =>
    set((state) => ({
      skills: [...state.skills, skill],
    })),
    
  updateSkill: (id, updates) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
      ),
    })),
    
  deleteSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((s) => s.id !== id),
      favorites: state.favorites.filter((f) => f !== id),
    })),
    
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    })),
    
  getSkill: (id) => {
    const state = get();
    return state.skills.find((s) => s.id === id);
  },
  
  getSkillsByCategory: (category) => {
    const state = get();
    return state.skills.filter((s) => s.category === category);
  },
  
  getSkillsBySource: (source) => {
    const state = get();
    return state.skills.filter((s) => s.source === source);
  },
  
  searchSkills: (query) => {
    const state = get();
    const lowerQuery = query.toLowerCase();
    return state.skills.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  },
}));
