'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SettingsDrawer } from './modals/settings-drawer';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SettingsDrawer />
      <Toaster position="bottom-right" richColors />
    </>
  );
}
