'use client';

import React, { useEffect } from 'react';
import { ResponsiveNavigation, MobileNavToggle } from '@/components/responsive-navigation';
import { ResponsiveSettings, SettingsButton } from '@/components/responsive-settings';
import { useUIStore } from '@/lib/stores/ui';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { deviceType, setScreenWidth } = useUIStore();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenWidth]);

  const isMobile = deviceType === 'mobile';

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Mobile Top Bar */}
      {isMobile && (
        <header className="flex items-center justify-between h-16 border-b border-border bg-card px-4 flex-shrink-0 z-30">
          <h1 className="font-bold text-lg">MMM</h1>
          <div className="flex items-center gap-2">
            <SettingsButton />
            <MobileNavToggle />
          </div>
        </header>
      )}

      {/* Navigation Sidebar */}
      <ResponsiveNavigation />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Top Bar */}
        {!isMobile && (
          <header className="hidden md:flex items-center justify-between h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex-shrink-0">
            <h1 className="font-bold text-lg">Multi Meta Matrix</h1>
            <SettingsButton />
          </header>
        )}

        {/* Content Area - Responsive and scrollable */}
        <div className="flex-1 overflow-auto w-full">
          <div className="h-full w-full">{children}</div>
        </div>
      </main>

      {/* Settings Panel */}
      <ResponsiveSettings />
    </div>
  );
}
