'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/stores/app';
import { Home, Chat as ChatIcon, Grid3x3, Puzzle, Brain, Wrench, Settings, Code, Menu, X } from '@/lib/icons';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chat', label: 'Chat', icon: ChatIcon },
  { id: 'swarms', label: 'Swarms', icon: Grid3x3 },
  { id: 'skills', label: 'Skills', icon: Puzzle },
  { id: 'artifacts', label: 'Artifacts', icon: Code },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'inspect', label: 'Inspect', icon: Wrench },
];

export function ResponsiveNav() {
  const [isMobile, setIsMobile] = useState(false);
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useAppStore();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId as any);
    if (isMobile) setSidebarOpen(false);
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card">
        <div className="flex items-center justify-around h-20 px-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 z-30 border-r border-border bg-card transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen ? (
            <h1 className="text-lg font-bold text-primary">MMM</h1>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-lobe-icon"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <Menu className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2 px-2">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lobe-md'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="border-t border-border p-4">
            <div className="text-xs text-muted-foreground text-center">
              <p className="font-medium">MMM v1.0.0</p>
              <p>AI Orchestration</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
