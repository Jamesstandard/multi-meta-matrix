'use client';

import React, { useState } from 'react';
import { useSwarmsStore, Swarm, SwarmTask } from '@/lib/stores/swarms';
import { Plus, Trash2, Grid3x3 } from '@/lib/icons';
import { KanbanBoard } from '@/components/kanban/kanban-board';

export function SwarmsView() {
  const { swarms, currentSwarmId, addSwarm, setCurrentSwarm, addTask, updateTask, deleteSwarm } = useSwarmsStore();
  const [selectedFramework, setSelectedFramework] = useState<'crewai' | 'autogen' | 'openclaw' | 'langgraph'>('crewai');

  const currentSwarm = swarms.find((s) => s.id === currentSwarmId);

  const handleNewSwarm = () => {
    const newSwarm: Swarm = {
      id: `swarm-${Date.now()}`,
      name: `Swarm ${swarms.length + 1}`,
      description: 'A new agent swarm',
      framework: selectedFramework,
      agents: [],
      tasks: [],
      status: 'planning',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addSwarm(newSwarm);
  };

  const handleAddTask = (status: 'todo' | 'in-progress' | 'review' | 'completed') => {
    if (!currentSwarmId) return;

    const newTask: SwarmTask = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: 'Task description',
      status,
      priority: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addTask(currentSwarmId, newTask);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="h-full px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Swarms</h1>
          <button
            onClick={handleNewSwarm}
            className="btn-lobe-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Swarm
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Swarms List */}
        <div className="w-64 border-r border-border bg-card/30 overflow-y-auto">
          <div className="p-4 space-y-2">
            {swarms.map((swarm) => (
              <button
                key={swarm.id}
                onClick={() => setCurrentSwarm(swarm.id)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 group flex items-center justify-between ${
                  currentSwarmId === swarm.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{swarm.name}</p>
                  <p className="text-xs opacity-70">{swarm.tasks.length} tasks</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSwarm(swarm.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </button>
            ))}
            {swarms.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No swarms yet
              </p>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        {currentSwarm ? (
          <div className="flex-1 flex flex-col">
            {/* Swarm Header */}
            <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-foreground">{currentSwarm.name}</h2>
                <p className="text-xs text-muted-foreground capitalize">
                  {currentSwarm.framework} • {currentSwarm.tasks.length} tasks
                </p>
              </div>
            </div>

            {/* Kanban Board Component */}
            <KanbanBoard swarmId={currentSwarm.id} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Grid3x3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No Swarm Selected</h2>
              <p className="text-muted-foreground mb-6">
                Create a new swarm to get started with Kanban workflow
              </p>
              <button
                onClick={handleNewSwarm}
                className="btn-lobe-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                New Swarm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
