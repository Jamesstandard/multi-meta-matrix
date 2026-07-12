'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Check } from '@/lib/icons';
import { useLLMConfigStore, LLMConfig, LLMProvider as LLMProviderType } from '@/lib/stores/llm-config';

interface LLMSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConfig?: (configId: string) => void;
}

export function LLMSettings({ isOpen, onClose, onSelectConfig }: LLMSettingsProps) {
  const { configs, addConfig, updateConfig, deleteConfig, availableProviders, testConnection } = useLLMConfigStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<LLMProviderType>('openai');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<Partial<LLMConfig>>({
    name: '',
    provider: 'openai',
    models: [],
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    topK: 0,
  });

  const handleProviderChange = (provider: LLMProviderType) => {
    setSelectedProvider(provider);
    const providerConfig = availableProviders[provider];
    setFormData({
      ...formData,
      provider,
      models: providerConfig.supportedModels,
      defaultModel: providerConfig.supportedModels[0],
      ...providerConfig.defaultParams,
    });
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert('Please enter a configuration name');
      return;
    }

    if (editingId) {
      updateConfig(editingId, formData);
      setEditingId(null);
    } else {
      const newConfig: LLMConfig = {
        id: `llm-${Date.now()}`,
        name: formData.name,
        provider: selectedProvider,
        models: formData.models || [],
        temperature: formData.temperature || 0.7,
        maxTokens: formData.maxTokens || 2048,
        topP: formData.topP,
        topK: formData.topK,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: true,
        ...formData,
      };
      addConfig(newConfig);
    }

    setFormData({
      name: '',
      provider: 'openai',
      models: [],
      temperature: 0.7,
      maxTokens: 2048,
    });
  };

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    const result = await testConnection(id);
    setTestResult({ ...testResult, [id]: result });
    setTestingId(null);
  };

  if (!isOpen) return null;

  const providerInfo = availableProviders[selectedProvider];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-3xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">LLM Configuration</h2>
            <p className="text-sm text-muted-foreground">Add and manage LLM providers and models</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Select Provider</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.values(availableProviders) as any[]).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleProviderChange(provider.name)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedProvider === provider.name
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-foreground">{provider.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{provider.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="font-semibold text-foreground">Configuration</h3>

            {/* Config Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Configuration Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={`e.g., ${providerInfo.label} Production`}
                className="input-lobe w-full"
              />
            </div>

            {/* API Key */}
            {providerInfo.requiredParams.includes('apiKey') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  API Key *
                </label>
                <input
                  type="password"
                  value={formData.apiKey || ''}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="input-lobe w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is encrypted and never shared
                </p>
              </div>
            )}

            {/* API Endpoint (for Azure, custom providers) */}
            {providerInfo.requiredParams.includes('apiEndpoint') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  API Endpoint *
                </label>
                <input
                  type="text"
                  value={formData.apiEndpoint || ''}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  placeholder="https://..."
                  className="input-lobe w-full"
                />
              </div>
            )}

            {/* Custom Endpoint */}
            {providerInfo.requiredParams.includes('customEndpoint') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Custom Endpoint *
                </label>
                <input
                  type="text"
                  value={formData.customEndpoint || ''}
                  onChange={(e) => setFormData({ ...formData, customEndpoint: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="input-lobe w-full"
                />
              </div>
            )}

            {/* Temperature */}
            {providerInfo.optionalParams.includes('temperature') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Temperature: {formData.temperature?.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature || 0.7}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                  }
                  className="input-lobe w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower = focused, Higher = creative
                </p>
              </div>
            )}

            {/* Top P */}
            {providerInfo.optionalParams.includes('topP') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Top P: {formData.topP?.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.topP || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, topP: parseFloat(e.target.value) })
                  }
                  className="input-lobe w-full"
                />
              </div>
            )}

            {/* Top K */}
            {providerInfo.optionalParams.includes('topK') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Top K
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.topK || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, topK: parseInt(e.target.value) })
                  }
                  className="input-lobe w-full"
                />
              </div>
            )}

            {/* Max Tokens */}
            {providerInfo.optionalParams.includes('maxTokens') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  min="256"
                  max="32000"
                  step="256"
                  value={formData.maxTokens || 2048}
                  onChange={(e) =>
                    setFormData({ ...formData, maxTokens: parseInt(e.target.value) })
                  }
                  className="input-lobe w-full"
                />
              </div>
            )}

            <button onClick={handleSave} className="btn-lobe-primary w-full">
              {editingId ? 'Update Configuration' : 'Add Configuration'}
            </button>
          </div>

          {/* Existing Configurations */}
          {configs.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-3">Active Configurations</h3>
              <div className="space-y-2">
                {configs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{config.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {availableProviders[config.provider].label} • {config.models?.length || 0} models
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {testResult[config.id] !== undefined && (
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            testResult[config.id]
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {testResult[config.id] ? 'Connected' : 'Failed'}
                        </div>
                      )}
                      <button
                        onClick={() => handleTestConnection(config.id)}
                        disabled={testingId === config.id}
                        className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                      >
                        {testingId === config.id ? 'Testing...' : 'Test'}
                      </button>
                      <button
                        onClick={() => deleteConfig(config.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
