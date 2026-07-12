'use client';

import React, { useState } from 'react';
import { SwarmTask } from '@/lib/stores/swarms';
import { X, Plus, Trash2, Settings } from '@/lib/icons';
import { BookOpen } from 'lucide-react';

interface TaskEditorProps {
  task: SwarmTask;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: SwarmTask) => void;
}

const AVAILABLE_ROLES = ['Researcher', 'Analyst', 'Writer', 'Reviewer', 'Coordinator', 'Developer'];
const AVAILABLE_LLMS = [
  { id: 'gpt-4', label: 'GPT-4' },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { id: 'claude-3-opus', label: 'Claude 3 Opus' },
  { id: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { id: 'llama-2', label: 'Llama 2' },
  { id: 'mixtral', label: 'Mixtral' },
];
const AVAILABLE_TOOLS = ['Web Search', 'Code Interpreter', 'File Upload', 'Email', 'Slack', 'Database', 'API Caller'];
const AVAILABLE_SKILLS = ['Python', 'JavaScript', 'Data Analysis', 'Writing', 'Research', 'Planning', 'Documentation'];

export function TaskEditor({ task, isOpen, onClose, onSave }: TaskEditorProps) {
  const [editedTask, setEditedTask] = useState<SwarmTask>(task);
  const [activeTab, setActiveTab] = useState<'basic' | 'config' | 'tools' | 'skills'>('basic');

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  const addTool = (tool: string) => {
    if (!editedTask.tools?.includes(tool)) {
      setEditedTask({
        ...editedTask,
        tools: [...(editedTask.tools || []), tool],
      });
    }
  };

  const removeTool = (tool: string) => {
    setEditedTask({
      ...editedTask,
      tools: (editedTask.tools || []).filter((t) => t !== tool),
    });
  };

  const addSkill = (skill: string) => {
    if (!editedTask.skills?.includes(skill)) {
      setEditedTask({
        ...editedTask,
        skills: [...(editedTask.skills || []), skill],
      });
    }
  };

  const removeSkill = (skill: string) => {
    setEditedTask({
      ...editedTask,
      skills: (editedTask.skills || []).filter((s) => s !== skill),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-xl font-bold text-foreground">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b border-border">
          {(['basic', 'config', 'tools', 'skills'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'config' ? 'Configuration' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Basic Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="input-lobe w-full"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  className="input-lobe w-full min-h-24 resize-none"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Priority
                  </label>
                  <select
                    value={editedTask.priority}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        priority: e.target.value as 'low' | 'medium' | 'high',
                      })
                    }
                    className="input-lobe w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={editedTask.status}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        status: e.target.value as 'todo' | 'in-progress' | 'review' | 'completed',
                      })
                    }
                    className="input-lobe w-full"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {AVAILABLE_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setEditedTask({ ...editedTask, role })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editedTask.role === role
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80 text-foreground'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Language Model
                </label>
                <select
                  value={editedTask.llm || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, llm: e.target.value as any })}
                  className="input-lobe w-full"
                >
                  <option value="">Select LLM...</option>
                  {AVAILABLE_LLMS.map((llm) => (
                    <option key={llm.id} value={llm.id}>
                      {llm.label}
                    </option>
                  ))}
                </select>
              </div>

              {editedTask.llm && (
                <div className="p-3 bg-secondary/30 rounded-lg text-sm text-foreground">
                  Selected LLM: <span className="font-semibold">{editedTask.llm}</span>
                </div>
              )}
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Available Tools
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {AVAILABLE_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => addTool(tool)}
                      disabled={editedTask.tools?.includes(tool)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        editedTask.tools?.includes(tool)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80 text-foreground'
                      }`}
                    >
                      + {tool}
                    </button>
                  ))}
                </div>
              </div>

              {editedTask.tools && editedTask.tools.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Selected Tools ({editedTask.tools.length})
                  </label>
                  <div className="space-y-2">
                    {editedTask.tools.map((tool) => (
                      <div
                        key={tool}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                      >
                        <span className="text-sm font-medium text-foreground">{tool}</span>
                        <button
                          onClick={() => removeTool(tool)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Available Skills
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      disabled={editedTask.skills?.includes(skill)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        editedTask.skills?.includes(skill)
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary hover:bg-secondary/80 text-foreground'
                      }`}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              {editedTask.skills && editedTask.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Selected Skills ({editedTask.skills.length})
                  </label>
                  <div className="space-y-2">
                    {editedTask.skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center justify-between p-3 bg-accent/20 rounded-lg"
                      >
                        <span className="text-sm font-medium text-foreground">{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-background">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground font-medium transition-colors ml-auto"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}
