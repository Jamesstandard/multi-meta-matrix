'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Zap } from '@/lib/icons';
import { useSwarmsStore, SwarmTask } from '@/lib/stores/swarms';

const COLUMNS = [
  { id: 'planning', label: 'Planning', color: 'bg-blue-100' },
  { id: 'running', label: 'Running', color: 'bg-green-100' },
  { id: 'review', label: 'Review', color: 'bg-orange-100' },
  { id: 'completed', label: 'Completed', color: 'bg-purple-100' },
];

interface KanbanBoardProps {
  swarmId: string;
}

export function KanbanBoard({ swarmId }: KanbanBoardProps) {
  const { swarms, addTask, updateTask, deleteTask } = useSwarmsStore();
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; fromStatus: string } | null>(null);

  const swarm = swarms.find(s => s.id === swarmId);
  if (!swarm) return null;

  const tasksByStatus = {
    planning: swarm.tasks.filter(t => t.status === 'planning'),
    running: swarm.tasks.filter(t => t.status === 'running'),
    review: swarm.tasks.filter(t => t.status === 'review'),
    completed: swarm.tasks.filter(t => t.status === 'completed'),
  } as Record<string, SwarmTask[]>;

  const handleAddTask = (status: string) => {
    const newTask: SwarmTask = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: 'Task description',
      status: status as any,
      priority: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addTask(swarmId, newTask);
  };

  const handleDragStart = (taskId: string, fromStatus: string) => {
    setDraggedTask({ taskId, fromStatus });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (toStatus: string) => {
    if (!draggedTask) return;
    
    const task = swarm.tasks.find(t => t.id === draggedTask.taskId);
    if (task && task.status !== toStatus) {
      updateTask(swarmId, draggedTask.taskId, { status: toStatus as any });
    }
    setDraggedTask(null);
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 md:p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-full">
        {COLUMNS.map(column => (
          <div
            key={column.id}
            className="flex flex-col bg-card rounded-2xl border border-border min-h-96"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className={`${column.color} p-4 rounded-t-2xl border-b border-border`}>
              <h2 className="font-semibold text-foreground mb-2">{column.label}</h2>
              <p className="text-sm text-muted-foreground">{tasksByStatus[column.id]?.length || 0} tasks</p>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {tasksByStatus[column.id]?.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id, task.status)}
                  className="bg-primary/5 border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-lobe-md transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm mb-1">{task.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <button
                      onClick={() => deleteTask(swarmId, task.id)}
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 p-1 rounded"
                      title="Delete task"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>

            {/* Add Task Button */}
            <div className="border-t border-border p-3">
              <button
                onClick={() => handleAddTask(column.id)}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-border hover:bg-secondary transition-all duration-200 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
