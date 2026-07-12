// Animation and sound utilities for MMM platform

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring';
  direction?: 'in' | 'out' | 'inOut';
}

export interface SoundConfig {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
}

// Animation presets
export const ANIMATION_PRESETS = {
  // Quick feedback animations (300ms)
  quick: { duration: 300, easing: 'ease-in-out' as const },
  // Standard animations (500ms)
  standard: { duration: 500, easing: 'ease-in-out' as const },
  // Smooth transitions (700ms)
  smooth: { duration: 700, easing: 'ease-in-out' as const },
  // Spring bounce animations
  spring: { duration: 600, easing: 'spring' as const },
  // Entrance animations
  entrance: { duration: 400, easing: 'ease-out' as const, direction: 'in' as const },
  // Exit animations
  exit: { duration: 300, easing: 'ease-in' as const, direction: 'out' as const },
} as const;

// CSS animation classes
export const animationClasses = {
  // Fade animations
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  // Slide animations
  slideInLeft: 'animate-slideInLeft',
  slideInRight: 'animate-slideInRight',
  slideOutLeft: 'animate-slideOutLeft',
  slideOutRight: 'animate-slideOutRight',
  slideDown: 'animate-slideDown',
  slideUp: 'animate-slideUp',
  // Scale animations
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut',
  // Bounce animations
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  // Rotate animations
  spin: 'animate-spin',
} as const;

// Generate Tailwind animation utility classes
export const generateAnimationClass = (
  animation: keyof typeof animationClasses,
  config?: AnimationConfig
): string => {
  let classes = animationClasses[animation];

  // Add animation duration modifier if not default
  if (config?.duration && config.duration !== 300) {
    const durationMap: Record<number, string> = {
      100: 'duration-100',
      150: 'duration-150',
      200: 'duration-200',
      300: 'duration-300',
      500: 'duration-500',
      700: 'duration-700',
      1000: 'duration-1000',
    };
    const durationClass = durationMap[config.duration] || `duration-${config.duration}`;
    classes += ` ${durationClass}`;
  }

  // Add delay if specified
  if (config?.delay && config.delay > 0) {
    const delayMap: Record<number, string> = {
      100: 'delay-100',
      150: 'delay-150',
      200: 'delay-200',
      300: 'delay-300',
      500: 'delay-500',
    };
    const delayClass = delayMap[config.delay] || `delay-${config.delay}`;
    classes += ` ${delayClass}`;
  }

  return classes;
};

// Sound management with optional audio context
class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundMap: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        this.audioContext = new window.AudioContext();
      } catch (e) {
        console.log('[v0] AudioContext not supported');
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Play a simple beep sound
  playBeep(frequency: number = 800, duration: number = 100, config?: SoundConfig) {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(config?.volume ?? 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (duration / 1000));

    oscillator.start(now);
    oscillator.stop(now + (duration / 1000));
  }

  // Play success sound
  playSuccess() {
    if (!this.enabled) return;
    this.playBeep(800, 100);
    setTimeout(() => this.playBeep(1000, 150), 150);
  }

  // Play error sound
  playError() {
    if (!this.enabled) return;
    this.playBeep(300, 100);
    setTimeout(() => this.playBeep(200, 200), 150);
  }

  // Play notification sound
  playNotification() {
    if (!this.enabled) return;
    this.playBeep(600, 80);
  }

  // Play click sound
  playClick() {
    if (!this.enabled) return;
    this.playBeep(1200, 50);
  }

  // Play slide animation sound
  playSlide() {
    if (!this.enabled) return;
    this.playBeep(400, 40);
  }

  // Resume audio context (required for user interaction)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Global sound manager instance
export const soundManager = new SoundManager();

// Disable sounds by default (user can enable in settings)
soundManager.setEnabled(false);

// Helper to track animation frame for performance
export const useAnimationFrame = (callback: (timestamp: number) => void) => {
  let animationFrameId: number;

  const animate = (timestamp: number) => {
    callback(timestamp);
    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrameId);
};

// Helper to create staggered animations
export const createStaggeredDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay;
};

// Intersection Observer helper for scroll animations
export const useIntersectionAnimation = (
  element: HTMLElement | null,
  animationClass: string,
  options?: IntersectionObserverInit
) => {
  if (!element) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.classList.add(animationClass);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.1, ...options });

  observer.observe(element);

  return () => observer.disconnect();
};

// Spring animation helper
export const createSpringAnimation = (
  element: HTMLElement,
  fromValue: number,
  toValue: number,
  duration: number = 600,
  onUpdate?: (value: number) => void
) => {
  const startTime = Date.now();
  let animationFrameId: number;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Spring easing function
    const springProgress = 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 4);
    const currentValue = fromValue + (toValue - fromValue) * springProgress;

    if (onUpdate) {
      onUpdate(currentValue);
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrameId);
};
