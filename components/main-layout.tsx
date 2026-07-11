'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/stores/app';
import { SettingsDrawerEnhanced } from './modals/settings-drawer-enhanced';
import { Settings } from '@/lib/icons';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { sidebarOpen } = useAppStore();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile layout - no sidebar, bottom nav handled in main component
  if (isMobile) {
    return (
      <>
        {/* Mobile Content (full width) */}
        <div className="fixed top-0 right-0 bottom-0 left-0 overflow-y-auto pb-20 bg-background">
          {children}
        </div>

        {/* Settings Drawer (Mobile) */}
        <SettingsDrawerEnhanced />
      </>
    );
  }

  // Desktop/Tablet layout
  return (
    <>
      {/* Top Bar */}
      <div className={`fixed top-0 right-0 h-16 border-b border-border bg-card/50 backdrop-blur-sm z-20 transition-all duration-300 ${
        sidebarOpen ? 'md:left-64' : 'md:left-20'
      } left-0`}>
        <div className="h-full px-4 md:px-6 flex items-center justify-end gap-4">
          <h1 className="text-lg font-bold text-foreground hidden md:block flex-1">MMM</h1>
          <button
            onClick={() => setSettingsOpen(true)}
            className="btn-lobe-icon"
            title="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`fixed top-16 right-0 bottom-0 overflow-y-auto bg-background transition-all duration-300 ${
        sidebarOpen ? 'md:left-64' : 'md:left-20'
      } left-0`}>
        {children}
      </div>

      {/* Settings Drawer (Desktop/Tablet) */}
      <SettingsDrawerEnhanced />
    </>
  );
}
