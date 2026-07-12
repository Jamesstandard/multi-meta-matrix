'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/stores/app';
import { useUIStore } from '@/lib/stores/ui';
import {
  Home,
  Chat as ChatIcon,
  Plus,
  Grid3x3,
  Puzzle,
  Settings,
  Zap,
  Brain,
  Code,
  Wrench,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from '@/lib/icons';

interface NavGroup {
  id: 'workspace' | 'agents' | 'config' | 'intelligence' | 'tools';
  label: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
      { id: 'chat', label: 'Chat', icon: <ChatIcon className="w-5 h-5" /> },
    ],
  },
  {
    id: 'agents',
    label: 'Agents & Swarms',
    items: [
      { id: 'agents', label: 'Agents', icon: <Plus className="w-5 h-5" /> },
      { id: 'swarms', label: 'Swarms', icon: <Grid3x3 className="w-5 h-5" /> },
    ],
  },
  {
    id: 'config',
    label: 'Configuration',
    items: [
      { id: 'llm', label: 'LLM Config', icon: <Settings className="w-5 h-5" /> },
      { id: 'skills', label: 'Skills', icon: <Puzzle className="w-5 h-5" /> },
      { id: 'integrations', label: 'Integrations', icon: <Zap className="w-5 h-5" /> },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      { id: 'memory', label: 'Memory', icon: <Brain className="w-5 h-5" /> },
      { id: 'artifacts', label: 'Artifacts', icon: <Code className="w-5 h-5" /> },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      { id: 'inspect', label: 'Inspect', icon: <Wrench className="w-5 h-5" /> },
    ],
  },
];

export function ResponsiveNavigation() {
  const { currentView, setCurrentView } = useAppStore();
  const {
    deviceType,
    navOpen,
    navCollapsed,
    expandedNavGroups,
    toggleNav,
    toggleNavGroup,
    toggleNavCollapsed,
    setScreenWidth,
  } = useUIStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenWidth]);

  if (!mounted) return null;

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  // Mobile: Full-screen overlay
  if (isMobile && navOpen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
          onClick={() => toggleNav()}
        />

        {/* Mobile Drawer */}
        <nav className="fixed left-0 top-0 h-screen w-80 bg-card border-r border-border z-50 animate-slideInLeft flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-bold text-lg">MMM</h2>
            <button onClick={() => toggleNav()} className="p-2 hover:bg-secondary rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Groups */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_GROUPS.map((group) => (
              <NavGroup
                key={group.id}
                group={group}
                expanded={expandedNavGroups.has(group.id)}
                onToggle={() => toggleNavGroup(group.id)}
                currentView={currentView}
                onNavigate={(viewId) => {
                  setCurrentView(viewId as any);
                  toggleNav();
                }}
                collapsed={false}
              />
            ))}
          </div>
        </nav>
      </>
    );
  }

  // Tablet/Desktop: Sidebar
  return (
    <nav
      className={`hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ${
        navCollapsed ? 'md:w-20' : 'md:w-64'
      } ${isDesktop ? '' : 'h-screen'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!navCollapsed && <h2 className="font-bold text-lg">MMM</h2>}
        <button
          onClick={() => toggleNavCollapsed()}
          className="p-2 hover:bg-secondary rounded-lg ml-auto"
          title={navCollapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${navCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {NAV_GROUPS.map((group) => (
          <NavGroup
            key={group.id}
            group={group}
            expanded={expandedNavGroups.has(group.id)}
            onToggle={() => toggleNavGroup(group.id)}
            currentView={currentView}
            onNavigate={(viewId) => setCurrentView(viewId as any)}
            collapsed={navCollapsed}
          />
        ))}
      </div>
    </nav>
  );
}

interface NavGroupProps {
  group: NavGroup;
  expanded: boolean;
  onToggle: () => void;
  currentView: string;
  onNavigate: (viewId: string) => void;
  collapsed: boolean;
}

function NavGroup({
  group,
  expanded,
  onToggle,
  currentView,
  onNavigate,
  collapsed,
}: NavGroupProps) {
  return (
    <div className="space-y-1">
      {/* Group Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors ${
          collapsed ? 'justify-center' : ''
        }`}
        title={collapsed ? group.label : undefined}
      >
        {!collapsed && <span className="text-xs font-semibold text-muted-foreground">{group.label}</span>}
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 ml-auto transition-transform ${
              expanded ? 'rotate-0' : '-rotate-90'
            }`}
          />
        )}
      </button>

      {/* Group Items */}
      {(expanded || collapsed) && (
        <div className={`space-y-1 overflow-hidden ${expanded ? 'animate-slideDown' : 'hidden'}`}>
          {group.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                currentView === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {item.badge && !collapsed && (
                <span className="ml-auto bg-primary text-xs rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile Hamburger Button
export function MobileNavToggle() {
  const { deviceType, navOpen, toggleNav } = useUIStore();

  if (deviceType !== 'mobile') return null;

  return (
    <button
      onClick={() => toggleNav()}
      className="md:hidden p-2 hover:bg-secondary rounded-lg"
      aria-label="Toggle navigation"
    >
      {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}
