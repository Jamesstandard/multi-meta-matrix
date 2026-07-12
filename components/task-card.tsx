'use client';

import React from 'react';
import { SwarmTask } from '@/lib/stores/swarms';
import { Play, Edit2, Trash2, Settings } from '@/lib/icons';
import { BookOpen } from 'lucide-react';

interface TaskCardProps {
  task: SwarmTask;
  onEdit: () => void;
  onPlay: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onEdit, onPlay, onDelete }: TaskCardProps) {
  return (
    <div className="card-lobe cursor-grab active:cursor-grabbing group hover:shadow-md transition-shadow">
      {/* Header with Title */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-medium text-foreground flex-1 line-clamp-2">
          {task.title}
        </h4>
        {task.isActive && (
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0 mt-1" />
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Role Badge */}
      {task.role && (
        <div className="mb-3 inline-block">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
            {task.role}
          </span>
        </div>
      )}

      {/* LLM Badge */}
      {task.llm && (
        <div className="mb-3 inline-block ml-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100 flex items-center gap-1">
            <Settings className="w-3 h-3" />
            {task.llm}
          </span>
        </div>
      )}

      {/* Tools & Skills Summary */}
      <div className="mb-4 flex flex-wrap gap-1">
        {task.tools && task.tools.length > 0 && (
          <span className="inline-block px-2 py-0.5 rounded text-xs bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-100">
            {task.tools.length} tool{task.tools.length !== 1 ? 's' : ''}
          </span>
        )}
        {task.skills && task.skills.length > 0 && (
          <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-100 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {task.skills.length} skill{task.skills.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Footer with Priority and Actions */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            task.priority === 'high'
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
              : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100'
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
          }`}
        >
          {task.priority}
        </span>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onPlay}
            className="p-1.5 hover:bg-green-500/20 rounded transition-colors"
            title="Play/Run task"
          >
            <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-blue-500/20 rounded transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
