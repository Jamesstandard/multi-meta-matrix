'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/stores/app';
import {
  Home,
  Chat as ChatIcon,
  Grid3x3,
  Puzzle,
  Brain,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from '@/lib/icons';

export function Sidebar() {
  const { sidebarOpen, currentView, setSidebarOpen, setCurrentView } = useAppStore();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: ChatIcon },
    { id: 'swarms', label: 'Swarms', icon: Grid3x3 },
    { id: 'skills', label: 'Skills', icon: Puzzle },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'inspect', label: 'Inspect', icon: Wrench },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {sidebarOpen && (
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <span className="text-foreground">MMM</span>
          </Link>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === id
                ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="h-16 px-4 border-t border-sidebar-border flex items-center justify-center">
        {sidebarOpen ? (
          <div className="w-full h-10 bg-muted rounded-lg flex items-center px-3 text-sm text-muted-foreground">
            User Profile
          </div>
        ) : (
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
        )}
      </div>
    </aside>
  );
}
