import { create } from 'zustand';

export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'groq' | 'ollama' | 'together' | 'replicate' | 'azure' | 'huggingface' | 'custom';

export interface LLMConfig {
  id: string;
  name: string;
  provider: LLMProvider;
  apiKey?: string;
  apiEndpoint?: string;
  customEndpoint?: string;
  models: string[];
  defaultModel?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  additionalParams?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

export interface LLMProvider {
  name: string;
  label: string;
  description: string;
  website?: string;
  docs?: string;
  supportedModels: string[];
  requiredParams: string[];
  optionalParams: string[];
  defaultParams: Partial<LLMConfig>;
}

export interface LLMConfigState {
  configs: LLMConfig[];
  currentConfigId: string | null;
  availableProviders: Record<LLMProvider, LLMProvider>;
  
  // Config Actions
  addConfig: (config: LLMConfig) => void;
  updateConfig: (id: string, updates: Partial<LLMConfig>) => void;
  deleteConfig: (id: string) => void;
  setCurrentConfig: (id: string | null) => void;
  getConfig: (id: string) => LLMConfig | undefined;
  getAllConfigs: () => LLMConfig[];
  getConfigsByProvider: (provider: LLMProvider) => LLMConfig[];
  testConnection: (id: string) => Promise<boolean>;
  duplicateConfig: (id: string) => void;
}

const AVAILABLE_PROVIDERS: Record<LLMProvider, LLMProvider> = {
  openai: {
    name: 'openai',
    label: 'OpenAI',
    description: 'GPT-4, GPT-3.5 Turbo, and other OpenAI models',
    website: 'https://openai.com',
    docs: 'https://platform.openai.com/docs',
    supportedModels: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiredParams: ['apiKey'],
    optionalParams: ['temperature', 'topP', 'maxTokens', 'frequencyPenalty', 'presencePenalty'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  anthropic: {
    name: 'anthropic',
    label: 'Anthropic',
    description: 'Claude 3 Opus, Sonnet, and Haiku models',
    website: 'https://anthropic.com',
    docs: 'https://docs.anthropic.com',
    supportedModels: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    requiredParams: ['apiKey'],
    optionalParams: ['temperature', 'topP', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  google: {
    name: 'google',
    label: 'Google',
    description: 'Gemini, PaLM, and other Google AI models',
    website: 'https://google.com/ai',
    docs: 'https://ai.google.dev',
    supportedModels: ['gemini-pro', 'gemini-pro-vision', 'palm-2'],
    requiredParams: ['apiKey'],
    optionalParams: ['temperature', 'topP', 'topK', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  groq: {
    name: 'groq',
    label: 'Groq',
    description: 'Fast inference for LLaMA, Mixtral, and Gemma models',
    website: 'https://groq.com',
    docs: 'https://console.groq.com/docs',
    supportedModels: ['llama-2-70b', 'mixtral-8x7b', 'gemma-7b'],
    requiredParams: ['apiKey'],
    optionalParams: ['temperature', 'topP', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  ollama: {
    name: 'ollama',
    label: 'Ollama',
    description: 'Local LLM inference with Ollama',
    website: 'https://ollama.ai',
    docs: 'https://github.com/ollama/ollama',
    supportedModels: ['llama2', 'mistral', 'neural-chat', 'starling-lm'],
    requiredParams: ['customEndpoint'],
    optionalParams: ['temperature', 'topP', 'topK', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048, customEndpoint: 'http://localhost:11434' },
  },
  together: {
    name: 'together',
    label: 'Together AI',
    description: 'Open source and commercial models via Together AI',
    website: 'https://together.ai',
    docs: 'https://docs.together.ai',
    supportedModels: ['llama-2-70b', 'mistral-7b', 'phi-2'],
    requiredParams: ['apiKey'],
    optionalParams: ['temperature', 'topP', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  replicate: {
    name: 'replicate',
    label: 'Replicate',
    description: 'Run open source models with Replicate',
    website: 'https://replicate.com',
    docs: 'https://replicate.com/docs',
    supportedModels: ['llama-2-70b', 'mistral-7b', 'falcon-7b'],
    requiredParams: ['apiKey'],
    optionalParams: ['temperature', 'topP', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  azure: {
    name: 'azure',
    label: 'Azure OpenAI',
    description: 'OpenAI models hosted on Microsoft Azure',
    website: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
    docs: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
    supportedModels: ['gpt-4', 'gpt-35-turbo'],
    requiredParams: ['apiKey', 'apiEndpoint'],
    optionalParams: ['temperature', 'topP', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  huggingface: {
    name: 'huggingface',
    label: 'Hugging Face',
    description: 'Access 150k+ models from Hugging Face',
    website: 'https://huggingface.co',
    docs: 'https://huggingface.co/docs/api-inference',
    supportedModels: ['meta-llama/Llama-2-70b', 'mistralai/Mistral-7B', 'tiiuae/falcon-7b'],
    requiredParams: ['apiKey'],
    optionalParams: ['temperature', 'topP', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
  custom: {
    name: 'custom',
    label: 'Custom Provider',
    description: 'Connect to any custom LLM API endpoint',
    docs: 'https://example.com/docs',
    supportedModels: [],
    requiredParams: ['customEndpoint', 'apiKey'],
    optionalParams: ['temperature', 'topP', 'topK', 'maxTokens'],
    defaultParams: { temperature: 0.7, maxTokens: 2048 },
  },
};

export const useLLMConfigStore = create<LLMConfigState>((set, get) => ({
  configs: [],
  currentConfigId: null,
  availableProviders: AVAILABLE_PROVIDERS,

  addConfig: (config) =>
    set((state) => ({
      configs: [...state.configs, { ...config, createdAt: Date.now(), updatedAt: Date.now() }],
      currentConfigId: config.id,
    })),

  updateConfig: (id, updates) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
      ),
    })),

  deleteConfig: (id) =>
    set((state) => ({
      configs: state.configs.filter((c) => c.id !== id),
      currentConfigId: state.currentConfigId === id ? null : state.currentConfigId,
    })),

  setCurrentConfig: (id) =>
    set({ currentConfigId: id }),

  getConfig: (id) => {
    const state = get();
    return state.configs.find((c) => c.id === id);
  },

  getAllConfigs: () => {
    const state = get();
    return state.configs;
  },

  getConfigsByProvider: (provider) => {
    const state = get();
    return state.configs.filter((c) => c.provider === provider);
  },

  testConnection: async (id) => {
    const config = get().getConfig(id);
    if (!config) return false;

    try {
      // Simulate connection test
      console.log('[v0] Testing connection for config:', config.name);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('[v0] Connection test failed:', error);
      return false;
    }
  },

  duplicateConfig: (id) => {
    const config = get().getConfig(id);
    if (!config) return;

    const newConfig: LLMConfig = {
      ...config,
      id: `llm-${Date.now()}`,
      name: `${config.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    get().addConfig(newConfig);
  },
}));
