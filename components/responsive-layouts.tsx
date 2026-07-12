'use client';

import React from 'react';
import { useResponsive } from '@/lib/hooks/use-responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive container with adaptive padding and max-width
 * Mobile: full width with padding
 * Tablet: 2-column layout with max-width
 * Desktop: 3-column layout with max-width
 */
export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`w-full h-full px-4 sm:px-6 lg:px-8 py-6 mx-auto ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Responsive grid that adapts columns based on screen size
 * Default: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
 */
export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '',
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  return (
    <div
      className={`grid grid-cols-${columns.mobile} sm:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  direction?: 'row' | 'col';
  responsive?: boolean;
  className?: string;
}

/**
 * Responsive flex container with directional stacking
 * On mobile: columns (responsive: true)
 * On desktop: rows or custom
 */
export function ResponsiveStack({
  children,
  spacing = 'md',
  direction = 'col',
  responsive = true,
  className = '',
}: ResponsiveStackProps) {
  const spacingClasses = {
    sm: 'space-y-2 sm:space-x-3',
    md: 'space-y-4 sm:space-x-6',
    lg: 'space-y-6 sm:space-x-8',
  };

  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const responsiveClass = responsive ? 'flex-col md:flex-row' : '';

  return (
    <div
      className={`flex ${responsive ? responsiveClass : directionClasses[direction]} ${spacingClasses[spacing]} ${className}`}
    >
      {children}
    </div>
  );
}

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

/**
 * Responsive card with mobile-optimized padding and hover effects
 */
export function ResponsiveCard({
  children,
  className = '',
  interactive = false,
}: ResponsiveCardProps) {
  return (
    <div
      className={`bg-card rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-border transition-all duration-200 ${
        interactive ? 'hover:shadow-md hover:border-primary/50 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface ResponsiveHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Responsive header with mobile-optimized typography
 */
export function ResponsiveHeader({
  title,
  subtitle,
  action,
  className = '',
}: ResponsiveHeaderProps) {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

interface ResponsiveTabsProps {
  tabs: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Responsive tabs that scroll horizontally on mobile
 */
export function ResponsiveTabs({
  tabs,
  value,
  onChange,
  className = '',
}: ResponsiveTabsProps) {
  return (
    <div
      className={`flex gap-2 sm:gap-4 overflow-x-auto pb-2 border-b border-border mb-4 sm:mb-6 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
            value === tab.value
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          {tab.icon && <span className="hidden sm:inline">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface ResponsiveSidebarProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  className?: string;
}

/**
 * Responsive layout with sidebar that stacks on mobile
 */
export function ResponsiveSidebar({
  children,
  sidebarContent,
  sidebarPosition = 'right',
  className = '',
}: ResponsiveSidebarProps) {
  const sidebarClass = sidebarPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row';

  return (
    <div className={`flex flex-col ${sidebarClass} gap-6 ${className}`}>
      <div className="flex-1">{children}</div>
      <div className="w-full md:w-80 flex-shrink-0">{sidebarContent}</div>
    </div>
  );
}

interface ResponsiveTableProps {
  columns: string[];
  rows: React.ReactNode[];
  className?: string;
}

/**
 * Responsive table that becomes cards on mobile
 */
export function ResponsiveTable({
  columns,
  rows,
  className = '',
}: ResponsiveTableProps) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    // Render as cards on mobile
    return (
      <div className={`space-y-4 ${className}`}>
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="bg-card rounded-lg p-4 border border-border space-y-2"
          >
            {row}
          </div>
        ))}
      </div>
    );
  }

  // Render as table on desktop
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-border hover:bg-secondary/50 transition-colors"
            >
              <td colSpan={columns.length}>{row}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Responsive modal that adapts to screen size
 * Mobile: Full screen
 * Tablet/Desktop: Centered modal
 */
export function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
}: ResponsiveModalProps) {
  const { isMobile } = useResponsive();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'md:max-w-md',
    md: 'md:max-w-2xl',
    lg: 'md:max-w-4xl',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed ${
          isMobile
            ? 'inset-0'
            : `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]}`
        } z-50 bg-card rounded-lg md:rounded-2xl max-h-screen overflow-auto animate-scaleIn ${className}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </>
  );
}

/**
 * Hook to get responsive props for components
 */
export function useResponsiveProps() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    isMobile,
    isTablet,
    isDesktop,
    columns: isMobile ? 1 : isTablet ? 2 : 3,
    spacing: isMobile ? 'sm' : isTablet ? 'md' : 'lg',
    textSize: isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg',
    padding: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8',
  };
}
