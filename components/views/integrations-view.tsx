'use client';

import React, { useState } from 'react';
import { useIntegrationStore } from '@/lib/stores/integrations';
import { Plus, Trash2, Clock, Zap } from '@/lib/icons';

interface IntegrationProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  free: boolean;
  oauth: boolean;
}

const PROVIDERS: IntegrationProvider[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '🔵',
    description: 'Store and sync your files and knowledge base',
    free: true,
    oauth: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '⚫',
    description: 'Import repositories and collaborate on code',
    free: true,
    oauth: true,
  },
  {
    id: 'email',
    name: 'Gmail & Outlook',
    icon: '📧',
    description: 'Connect your email for agent communication',
    free: true,
    oauth: true,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '🔵',
    description: 'Access and backup your files',
    free: false,
    oauth: true,
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    description: 'Microsoft cloud storage integration',
    free: true,
    oauth: true,
  },
  {
    id: 's3',
    name: 'AWS S3',
    icon: '🟠',
    description: 'Enterprise cloud storage solution',
    free: false,
    oauth: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '⚡',
    description: 'Send agent notifications to Slack',
    free: false,
    oauth: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '⬜',
    description: 'Sync knowledge with Notion databases',
    free: true,
    oauth: true,
  },
];

export function IntegrationsView() {
  const { integrations, addIntegration, removeIntegration, syncIntegration } = useIntegrationStore();
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});

  const connectedIntegrations = integrations.map((i) => i.type);

  const handleConnect = (provider: IntegrationProvider) => {
    // Simulate OAuth flow
    const integration = {
      id: `${provider.id}-${Date.now()}`,
      name: provider.name,
      type: provider.id as any,
      connected: true,
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      scope: ['read', 'write'],
      config: {},
    };
    addIntegration(integration);
  };

  const handleSync = async (type: string) => {
    setSyncing((prev) => ({ ...prev, [type]: true }));
    try {
      await syncIntegration(type as any);
    } finally {
      setSyncing((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDisconnect = (id: string) => {
    removeIntegration(id);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your tools and services to enhance agent capabilities
        </p>
      </div>

      {/* Filter Toggle */}
      <div className="mb-6 flex gap-2">
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium">
          All Services
        </button>
        <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium">
          Connected
        </button>
        <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium">
          Free Only
        </button>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROVIDERS.map((provider) => {
          const isConnected = connectedIntegrations.includes(provider.id as any);
          const integration = integrations.find((i) => i.type === provider.id);
          const isSyncing = syncing[provider.id] || false;

          return (
            <div
              key={provider.id}
              className="card-lobe flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{provider.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{provider.name}</h3>
                    {provider.free && (
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded">
                        Free
                      </span>
                    )}
                  </div>
                </div>
                {isConnected && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Zap className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {provider.description}
              </p>

              {/* Status and Actions */}
              {isConnected && integration ? (
                <div className="space-y-3">
                  {/* Last Sync */}
                  {integration.lastSyncedAt && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Last synced {new Date(integration.lastSyncedAt).toLocaleDateString()}
                    </div>
                  )}

                  {/* Connection Details */}
                  {integration.email && (
                    <div className="text-xs text-muted-foreground p-2 bg-secondary rounded">
                      Connected as: {integration.email}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSync(provider.id)}
                      disabled={isSyncing}
                      className="flex-1 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      {isSyncing ? 'Syncing...' : 'Sync'}
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(provider)}
                  className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Integrations List */}
      {integrations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Connections</h2>
          <div className="space-y-2">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="card-lobe p-4 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium text-foreground">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {integration.email || 'Connected'}
                  </p>
                </div>
                <button
                  onClick={() => handleDisconnect(integration.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
