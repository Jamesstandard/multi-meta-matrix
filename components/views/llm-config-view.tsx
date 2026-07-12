'use client';

import React, { useState } from 'react';
import { useLLMConfigStore } from '@/lib/stores/llm-config';
import { LLMSettings } from '@/components/modals/llm-settings';
import { Zap, Settings } from '@/lib/icons';

export function LLMConfigView() {
  const { configs, availableProviders, deleteConfig } = useLLMConfigStore();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<keyof typeof availableProviders | null>(null);

  const providerEntries = Object.entries(availableProviders);
  const configsByProvider: Record<string, any[]> = {};

  configs.forEach((config) => {
    if (!configsByProvider[config.provider]) {
      configsByProvider[config.provider] = [];
    }
    configsByProvider[config.provider].push(config);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="h-full px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">LLM Configurations</h1>
          <button onClick={() => setShowSettings(true)} className="btn-lobe-primary flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Add Configuration
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {configs.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No LLM Configurations</h2>
            <p className="text-muted-foreground mb-6">
              Create your first LLM configuration to get started
            </p>
            <button onClick={() => setShowSettings(true)} className="btn-lobe-primary">
              Create Configuration
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {providerEntries.map(([providerKey, providerInfo]) => {
              const configs = configsByProvider[providerKey] || [];
              if (configs.length === 0) return null;

              return (
                <div key={providerKey}>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                    <Zap className="w-5 h-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{providerInfo.label}</h2>
                      <p className="text-sm text-muted-foreground">{providerInfo.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {configs.map((config) => (
                      <div key={config.id} className="card-lobe">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{config.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {config.models?.length || 0} models available
                            </p>
                          </div>
                          {config.isActive && (
                            <div className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-medium">
                              Active
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                          {config.temperature !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Temperature:</span>
                              <span className="text-foreground font-medium">{config.temperature.toFixed(2)}</span>
                            </div>
                          )}
                          {config.maxTokens !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Max Tokens:</span>
                              <span className="text-foreground font-medium">{config.maxTokens}</span>
                            </div>
                          )}
                          {config.topP !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Top P:</span>
                              <span className="text-foreground font-medium">{config.topP.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 border-t border-border pt-3">
                          <button
                            onClick={() => {
                              setSelectedProvider(providerKey as keyof typeof availableProviders);
                              setShowSettings(true);
                            }}
                            className="flex-1 text-xs py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteConfig(config.id)}
                            className="flex-1 text-xs py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Provider Reference */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Available Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providerEntries.map(([key, provider]) => (
              <div key={key} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">{provider.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                <div className="flex gap-2 text-xs">
                  {provider.website && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Website
                    </a>
                  )}
                  {provider.docs && (
                    <a
                      href={provider.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Docs
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LLM Settings Modal */}
      <LLMSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
