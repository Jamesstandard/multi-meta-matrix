'use client';

import React, { useEffect, useState } from 'react';
import { useUIStore } from '@/lib/stores/ui';
import { soundManager } from '@/lib/utils/animations';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  id?: string;
}

interface ToastContextType {
  toasts: (ToastProps & { id: string })[];
  addToast: (toast: ToastProps) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const addToast = (toast: ToastProps) => {
    const id = toast.id || `toast-${Date.now()}`;
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Play sound based on type
    const { soundEnabled } = useUIStore.getState();
    if (soundEnabled) {
      if (toast.type === 'success') soundManager.playSuccess();
      else if (toast.type === 'error') soundManager.playError();
      else soundManager.playNotification();
    }

    // Auto-remove after duration
    const duration = toast.duration || 4000;
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastContainerProps {
  toasts: (ToastProps & { id: string })[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm pointer-events-none">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={() => onRemove(toast.id)}
          delay={index * 100}
        />
      ))}
    </div>
  );
}

interface ToastCompProps extends ToastProps {
  onRemove: () => void;
  delay?: number;
  id?: string;
}

function Toast({ message, type = 'info', onRemove, delay = 0, id }: ToastCompProps) {
  const bgColor = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
    warning: 'bg-yellow-500/90',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <div
      className={`${bgColor} text-white rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 pointer-events-auto animate-slideUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-lg font-bold">{icon}</span>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onRemove}
        className="text-white/60 hover:text-white transition-colors"
      >
        ×
      </button>
    </div>
  );
}

// Ripple Click Effect
export function RippleButton({
  children,
  onClick,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none bg-white/30 rounded-full animate-ping"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out',
          }}
        />
      ))}
    </button>
  );
}

// Loading Skeleton
export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-secondary rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

// Animated Counter
export function AnimatedCounter({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.floor(value * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

// Pulse Badge
export function PulseBadge({ text, color = 'blue' }: { text: string; color?: string }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colorClasses[color as keyof typeof colorClasses]}/20`}>
      <span className={`inline-block w-2 h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]} animate-pulse`} />
      <span className="text-xs font-medium text-foreground">{text}</span>
    </div>
  );
}

// Expandable Card with Animation
export function ExpandableCard({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors"
      >
        <span className="font-semibold text-foreground">{title}</span>
        <span
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-border bg-secondary/30 animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );
}

// Progress Ring
export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-secondary"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="text-primary transition-all duration-300"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.3em"
        className="text-sm font-semibold fill-foreground"
      >
        {progress}%
      </text>
    </svg>
  );
}

// Floating Action Button
export function FloatingActionButton({
  onClick,
  icon,
  label,
  position = 'bottom-right',
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={`fixed ${positionClasses[position]} w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40 animate-scaleIn`}
    >
      {icon}
    </button>
  );
}

// Tooltip
export function Tooltip({
  text,
  children,
  position = 'top',
}: {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap z-50 animate-fadeIn`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
