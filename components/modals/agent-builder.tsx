'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Settings } from '@/lib/icons';
import { BookOpen } from 'lucide-react';
import { useLLMConfigStore } from '@/lib/stores/llm-config';
import { LLMSettings } from '@/components/modals/llm-settings';

interface AgentBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: any) => void;
}

export function AgentBuilder({ isOpen, onClose, onSave }: AgentBuilderProps) {
  const { configs } = useLLMConfigStore();
  const [activeTab, setActiveTab] = useState<'basic' | 'config' | 'tools' | 'integrations' | 'llm'>('basic');
  const [showLLMSettings, setShowLLMSettings] = useState(false);
  const [framework, setFramework] = useState<'crewai' | 'autogen' | 'openclaw' | 'langgraph'>('crewai');
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState('');
  const [selectedLLMConfig, setSelectedLLMConfig] = useState<string>(configs.length > 0 ? configs[0].id : '');
  const [customModel, setCustomModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [mcpTools, setMcpTools] = useState<string[]>([]);
  const [newMcpTool, setNewMcpTool] = useState('');

  const handleAddTool = () => {
    if (newTool.trim()) {
      setTools([...tools, newTool]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleAddMcpTool = () => {
    if (newMcpTool.trim()) {
      setMcpTools([...mcpTools, newMcpTool]);
      setNewMcpTool('');
    }
  };

  const handleRemoveMcpTool = (index: number) => {
    setMcpTools(mcpTools.filter((_, i) => i !== index));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedConfig = configs.find((c) => c.id === selectedLLMConfig);
  const actualModel = customModel || selectedConfig?.defaultModel || 'gpt-4';

  const handleSave = () => {
    onSave({
      id: `agent-${Date.now()}`,
      name: agentName,
      description,
      avatar,
      role,
      framework,
      model: actualModel,
      llmConfigId: selectedLLMConfig,
      tools,
      mcpTools,
      temperature,
      maxTokens,
      systemPrompt,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setAgentName('');
    setDescription('');
    setAvatar(null);
    setRole('');
    setTools([]);
    setMcpTools([]);
    setSystemPrompt('');
    setActiveTab('basic');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="card-lobe">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Create Agent</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-border pb-4 overflow-x-auto">
            {(['basic', 'config', 'llm', 'tools', 'integrations'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'config' ? 'Configuration' : tab === 'llm' ? 'LLM Settings' : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {/* Basic Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    {avatar ? (
                      <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden">
                        <img src={avatar} alt="Agent avatar" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="flex-1 input-lobe"
                    />
                  </div>
                </div>

                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Research Agent"
                    className="input-lobe"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your agent's purpose..."
                    className="input-lobe min-h-24 resize-none"
                  />
                </div>

                {/* Framework Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Framework
                  </label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as any)}
                    className="input-lobe"
                  >
                    <option value="crewai">CrewAI</option>
                    <option value="autogen">AutoGen</option>
                    <option value="openclaw">OpenClaw</option>
                    <option value="langgraph">LangGraph</option>
                  </select>
                </div>
              </div>
            )}

            {/* Configuration Tab */}
            {activeTab === 'config' && (
              <div className="space-y-4">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input-lobe"
                  >
                    <option value="">Select a role</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Writer">Writer</option>
                    <option value="Reviewer">Reviewer</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Developer">Developer</option>
                  </select>
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as any)}
                    className="input-lobe"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="llama-2">Llama 2</option>
                    <option value="mixtral">Mixtral</option>
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Temperature: {temperature.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="input-lobe"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower values = more focused, Higher values = more creative
                  </p>
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    min="256"
                    max="4096"
                    step="256"
                    className="input-lobe"
                  />
                </div>
              </div>
            )}

            {/* LLM Settings Tab */}
            {activeTab === 'llm' && (
              <div className="space-y-4">
                {/* LLM Configuration Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      LLM Configuration
                    </label>
                    <button
                      onClick={() => setShowLLMSettings(true)}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      Manage Configurations
                    </button>
                  </div>
                  <select
                    value={selectedLLMConfig}
                    onChange={(e) => setSelectedLLMConfig(e.target.value)}
                    className="input-lobe w-full"
                  >
                    <option value="">Select a configuration</option>
                    {configs.map((config) => (
                      <option key={config.id} value={config.id}>
                        {config.name} ({config.provider})
                      </option>
                    ))}
                  </select>
                  {!selectedLLMConfig && (
                    <p className="text-xs text-amber-600 mt-2">
                      ⚠️ Create an LLM configuration to proceed
                    </p>
                  )}
                </div>

                {/* Custom Model Override */}
                {selectedConfig && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Model (or override)
                    </label>
                    <select
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      className="input-lobe w-full"
                    >
                      <option value="">Use default: {selectedConfig.defaultModel}</option>
                      {selectedConfig.models?.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    System Prompt
                  </label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Define the behavior and instructions for this agent..."
                    className="input-lobe w-full min-h-32 resize-none"
                  />
                </div>

                {/* Advanced Parameters from Config */}
                {selectedConfig && (
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium text-foreground mb-3">Advanced Parameters</h4>
                    <div className="space-y-3">
                      {selectedConfig.temperature !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            Temperature: {temperature.toFixed(2)}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="input-lobe w-full"
                          />
                        </div>
                      )}

                      {selectedConfig.maxTokens !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            Max Tokens
                          </label>
                          <input
                            type="number"
                            min="256"
                            max={selectedConfig.maxTokens}
                            step="256"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                            className="input-lobe w-full"
                          />
                        </div>
                      )}

                      {selectedConfig.topP !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            Top P: {selectedConfig.topP.toFixed(2)}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {selectedConfig.topP}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Custom Tools
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTool();
                        }
                      }}
                      placeholder="Add a tool..."
                      className="input-lobe flex-1"
                    />
                    <button
                      onClick={handleAddTool}
                      className="btn-lobe-primary flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tools.map((tool, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                      >
                        <span className="text-sm text-secondary-foreground">{tool}</span>
                        <button
                          onClick={() => handleRemoveTool(idx)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
        </div>
      </div>

      {/* LLM Settings Modal */}
      <LLMSettings
        isOpen={showLLMSettings}
        onClose={() => setShowLLMSettings(false)}
        onSelectConfig={setSelectedLLMConfig}
      />
    </div>
  );
}
                      }}
                      placeholder="Add MCP tool..."
                      className="input-lobe flex-1"
                    />
                    <button
                      onClick={handleAddMcpTool}
                      className="btn-lobe-primary flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {mcpTools.map((tool, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                      >
                        <span className="text-sm text-secondary-foreground">{tool}</span>
                        <button
                          onClick={() => handleRemoveMcpTool(idx)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn-lobe-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 btn-lobe-primary"
            >
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
