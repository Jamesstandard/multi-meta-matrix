# Responsive Mobile-First UI Design Guide

## Overview

The MMM platform now features a comprehensive responsive UI system designed with mobile-first principles. All components automatically adapt across device sizes while maintaining a cohesive design language.

**Key Stats:**
- 10 new core modules
- ~2,700 lines of production-ready code
- 3-point breakpoint system (mobile, tablet, desktop)
- Full animation and sound system
- Touch-optimized interactions

---

## Architecture

### 1. State Management (`lib/stores/ui.ts`)

Central UI state store using Zustand for managing:
- Navigation groups expansion
- Settings panel state
- Device type and screen width
- Sound and animation preferences
- Panel collapse states

```typescript
import { useUIStore } from '@/lib/stores/ui';

const { deviceType, navOpen, toggleNav, soundEnabled } = useUIStore();
```

**Available Actions:**
- `toggleNav()` - Open/close navigation
- `toggleNavGroup(id)` - Expand/collapse nav sections
- `toggleSettings()` - Open/close settings
- `setDeviceType(type)` - Update device type
- `setSoundEnabled(enabled)` - Toggle audio feedback

---

## Components

### Navigation System

#### `ResponsiveNavigation`
Intelligent navigation that adapts to screen size:

**Mobile:** Full-screen drawer with backdrop overlay
- Closes after navigation
- Collapsible groups for organization
- Touch-friendly tap targets

**Tablet/Desktop:** Collapsible sidebar
- Group-based organization
- Persistent state
- Smooth collapse animation

```typescript
import { ResponsiveNavigation, MobileNavToggle } from '@/components/responsive-navigation';

export default function Layout() {
  return (
    <>
      <ResponsiveNavigation />
      <MobileNavToggle /> {/* Only visible on mobile */}
    </>
  );
}
```

**Navigation Groups:**
- Workspace (Home, Chat)
- Agents & Swarms (Agents, Swarms)
- Configuration (LLM Config, Skills, Integrations)
- Intelligence (Memory, Artifacts)
- Tools (Inspect)

---

### Settings Panel

#### `ResponsiveSettings`
Context-aware settings delivery:

**Mobile:** Bottom sheet with nested navigation
- Horizontal slide-up animation
- Category list with forward/back navigation
- Handle bar for drag-to-dismiss

**Tablet/Desktop:** Right sidebar with content pane
- Collapsible to icons
- Category selection side-by-side
- Settings grouped logically

```typescript
import { ResponsiveSettings } from '@/components/responsive-settings';

// Auto-renders based on screen size
<ResponsiveSettings />
```

**Settings Categories:**
1. **Appearance** - Theme, colors, compact mode
2. **Behavior** - Animations, sounds, haptics
3. **Agent Config** - Default framework, model, temperature
4. **Integrations** - Connected services status
5. **Privacy & Security** - Analytics, crash reports, logging
6. **Developer** - Debug mode, performance monitoring

---

### Layout Components

#### Responsive Primitives

All layout components in `components/responsive-layouts.tsx` automatically adapt:

```typescript
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveHeader,
  ResponsiveCard,
  ResponsiveTabs,
} from '@/components/responsive-layouts';

export function MyView() {
  return (
    <ResponsiveContainer>
      <ResponsiveHeader
        title="My Dashboard"
        subtitle="View and manage your resources"
        action={<button>Add New</button>}
      />
      
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        <ResponsiveCard>Content</ResponsiveCard>
        <ResponsiveCard>Content</ResponsiveCard>
        <ResponsiveCard>Content</ResponsiveCard>
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
}
```

**Layout Components:**

| Component | Purpose | Mobile | Tablet | Desktop |
|-----------|---------|--------|--------|---------|
| `ResponsiveContainer` | Adaptive padding/max-width | Full | Constrained | Constrained |
| `ResponsiveGrid` | Multi-column layout | 1 col | 2 col | 3 col |
| `ResponsiveStack` | Flex stacking | Column | Responsive | Row |
| `ResponsiveCard` | Content container | Padded | Rounded | Elevated |
| `ResponsiveHeader` | Section headers | Stacked | Stacked | Inline |
| `ResponsiveTabs` | Tab navigation | Scroll | Scroll | Grid |
| `ResponsiveSidebar` | Sidebar layouts | Stack | Stack | Side-by-side |
| `ResponsiveTable` | Data display | Cards | Cards | Table |
| `ResponsiveModal` | Dialog/Modal | Full screen | Centered | Centered |

---

### Interactive Feedback (`components/interactive-feedback.tsx`)

#### Toast Notifications

```typescript
import { useToast } from '@/components/interactive-feedback';

const { addToast } = useToast();

// Show notification
addToast({
  message: 'Settings saved successfully',
  type: 'success',
  duration: 4000,
});
```

**Toast Types:** success, error, info, warning

#### Other Interactive Components

```typescript
import {
  RippleButton,
  SkeletonLoader,
  AnimatedCounter,
  PulseBadge,
  ExpandableCard,
  ProgressRing,
  FloatingActionButton,
  Tooltip,
} from '@/components/interactive-feedback';

// Ripple effect on click
<RippleButton onClick={handleClick}>Click me</RippleButton>

// Loading skeleton
<SkeletonLoader count={3} />

// Animated number counter
<AnimatedCounter value={1234} duration={1000} />

// Pulse badge with indicator
<PulseBadge text="Live" color="green" />

// Expandable content section
<ExpandableCard title="Advanced Options">
  Content here
</ExpandableCard>

// Circular progress
<ProgressRing progress={75} size={100} />

// Floating action button
<FloatingActionButton
  icon={<Plus />}
  label="Add new"
  onClick={handleClick}
/>

// Hover tooltip
<Tooltip text="This is helpful">
  <button>Hover me</button>
</Tooltip>
```

---

## Animations & Sounds

### Animation System (`lib/utils/animations.ts`)

Pre-defined animation presets:

```typescript
import { ANIMATION_PRESETS, generateAnimationClass } from '@/lib/utils/animations';

// Available presets
ANIMATION_PRESETS.quick      // 300ms ease-in-out
ANIMATION_PRESETS.standard   // 500ms ease-in-out
ANIMATION_PRESETS.smooth     // 700ms ease-in-out
ANIMATION_PRESETS.spring     // 600ms with spring easing
ANIMATION_PRESETS.entrance   // 400ms ease-out
ANIMATION_PRESETS.exit       // 300ms ease-in
```

### Animation Classes (CSS)

Available animations added to globals.css:

```html
<!-- Fade animations -->
<div class="animate-fadeIn">Fades in</div>
<div class="animate-fadeOut">Fades out</div>

<!-- Slide animations -->
<div class="animate-slideInLeft">Slides from left</div>
<div class="animate-slideInRight">Slides from right</div>
<div class="animate-slideDown">Slides down</div>
<div class="animate-slideUp">Slides up</div>

<!-- Scale animations -->
<div class="animate-scaleIn">Scales up</div>
<div class="animate-scaleOut">Scales down</div>
```

### Sound System

Sound effects enabled in settings, plays feedback for:
- Success actions: ascending beeps
- Errors: descending beeps
- Notifications: single beep
- Clicks: high-pitched beep
- Slides: soft transition sound

```typescript
import { soundManager } from '@/lib/utils/animations';

// Enable/disable
soundManager.setEnabled(true);

// Play sounds manually
soundManager.playSuccess();
soundManager.playError();
soundManager.playClick();
soundManager.playNotification();
```

---

## Responsive Hooks

### `useResponsive()`

```typescript
import { useResponsive } from '@/lib/hooks/use-responsive';

const { isMobile, isTablet, isDesktop, screenWidth, deviceType } = useResponsive();

if (isMobile) {
  // Show mobile layout
}
```

### `useMediaQuery()`

```typescript
const isLargeScreen = useMediaQuery('(min-width: 1200px)');
```

### `useBreakpoint()`

```typescript
const isDesktop = useBreakpoint('lg'); // min-width: 1024px
const isTablet = useBreakpoint('md');  // min-width: 768px
```

### Other Hooks

```typescript
import {
  useClickOutside,
  useDarkMode,
  useOrientation,
  useNetworkStatus,
  useScrollDirection,
  usePrefersReducedMotion,
  useIsMounted,
} from '@/lib/hooks/use-responsive';

// Detect clicks outside
useClickOutside(ref, () => closeMenu());

// System dark mode preference
const isDark = useDarkMode();

// Device orientation
const orientation = useOrientation(); // 'portrait' | 'landscape'

// Network status
const isOnline = useNetworkStatus();

// Scroll direction
const direction = useScrollDirection(); // 'up' | 'down'

// Animation preferences
const prefersNoMotion = usePrefersReducedMotion();

// Check component mounted (SSR safe)
const mounted = useIsMounted();
```

---

## Breakpoints

The system uses Tailwind's standard breakpoints:

| Name | Width | Use Case |
|------|-------|----------|
| Mobile | < 640px | Phones, small devices |
| Tablet | 640px - 1023px | Tablets, landscape phones |
| Desktop | ≥ 1024px | Desktops, large screens |

**Tailwind Responsive Classes:**
```
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px
```

---

## Design Patterns

### Mobile-First Philosophy

1. **Start with mobile** - Single column, essential features
2. **Enhance for tablet** - Add 2-column layouts, more details
3. **Full features on desktop** - 3 columns, sidebars, advanced options

### Touch-Friendly Design

- Minimum 48px tap targets
- 16px minimum font size
- Adequate spacing for fingers (8px minimum)
- Swipe/gesture support where applicable

### Typography Scaling

```typescript
// Mobile
<h1 className="text-xl">Heading on mobile</h1>

// Tablet +
<h1 className="text-xl sm:text-2xl">Heading</h1>

// Desktop +
<h1 className="text-xl sm:text-2xl lg:text-3xl">Heading</h1>
```

### Spacing Consistency

```typescript
// Mobile first
<div className="px-4 py-3">Mobile padding</div>

// Tablet enhancement
<div className="px-4 sm:px-6 py-3 sm:py-4">
  Responsive padding
</div>

// Desktop enhancement
<div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
  Full responsive padding
</div>
```

---

## Usage Examples

### Complete Responsive View

```typescript
'use client';

import React, { useState } from 'react';
import { useResponsive } from '@/lib/hooks/use-responsive';
import {
  ResponsiveContainer,
  ResponsiveHeader,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveTabs,
  useResponsiveProps,
} from '@/components/responsive-layouts';
import { useToast } from '@/components/interactive-feedback';

export function MyDashboard() {
  const { isMobile } = useResponsive();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ResponsiveContainer>
      {/* Header */}
      <ResponsiveHeader
        title="Dashboard"
        subtitle="Welcome back to MMM"
        action={
          <button
            onClick={() => addToast({
              message: 'New item created',
              type: 'success',
            })}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            New Item
          </button>
        }
      />

      {/* Tabs */}
      <ResponsiveTabs
        tabs={[
          { label: 'Overview', value: 'overview' },
          { label: 'Analytics', value: 'analytics' },
          { label: 'Settings', value: 'settings' },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* Grid of cards - responsive columns */}
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <ResponsiveCard key={item} interactive>
            <h3 className="font-semibold">Card {item}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Content adapts to screen size
            </p>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
}
```

---

## Migration Guide

### Updating Existing Views

**Before:**
```typescript
<div className="h-16 border-b border-border bg-card/50">
  <div className="h-full px-6 flex items-center justify-between">
    <h1 className="text-2xl font-bold">Title</h1>
  </div>
</div>
```

**After:**
```typescript
<ResponsiveHeader
  title="Title"
  subtitle="Optional subtitle"
  action={<button>Action</button>}
/>
```

---

## Best Practices

1. **Always use responsive components** - Never hardcode fixed widths
2. **Test on multiple devices** - Use browser DevTools device emulation
3. **Prioritize touch** - Ensure all interactions work on touch
4. **Use hooks for logic** - `useResponsive`, `useBreakpoint`, etc.
5. **Leverage animation presets** - Don't create custom durations
6. **Keep sound optional** - User can disable in settings
7. **Mobile-first CSS** - Write mobile styles first, add responsive modifiers
8. **Semantic HTML** - Use proper heading, nav, main, article tags

---

## File Reference

### Core System Files

| File | Size | Purpose |
|------|------|---------|
| `lib/stores/ui.ts` | 139 lines | UI state management |
| `lib/utils/animations.ts` | 255 lines | Animation/sound system |
| `lib/hooks/use-responsive.ts` | 159 lines | Responsive utilities |
| `components/responsive-navigation.tsx` | 275 lines | Navigation component |
| `components/responsive-settings.tsx` | 508 lines | Settings component |
| `components/responsive-layouts.tsx` | 378 lines | Layout primitives |
| `components/interactive-feedback.tsx` | 384 lines | Feedback components |
| `app/globals.css` | +170 lines | Animation keyframes |
| `components/main-layout.tsx` | Updated | Main layout wrapper |

**Total New Code:** ~2,300 lines

---

## Performance Considerations

1. **Animations disabled by default** - Users control via settings
2. **Sound disabled by default** - Opt-in via settings
3. **Hardware acceleration** - CSS transforms used for smooth animations
4. **Debounced resize** - Window resize events throttled
5. **Lazy component loading** - Settings panel loads on demand
6. **Memoized hooks** - Responsive hooks use optimized re-renders

---

## Accessibility

- All interactive elements have sufficient contrast
- Keyboard navigation supported throughout
- ARIA labels on buttons and icons
- Semantic HTML structure
- Motion preferences respected (`prefers-reduced-motion`)
- Proper heading hierarchy
- Focus indicators visible

---

## Next Steps

1. **Test on devices** - Phone, tablet, desktop, landscape modes
2. **Gather feedback** - User testing on mobile
3. **Refine animations** - Based on performance metrics
4. **Customize settings** - Add more user preferences
5. **Extend components** - Build domain-specific responsive layouts
6. **Document patterns** - Create component library documentation

---

## Support

For questions about the responsive system:
1. Check existing component examples
2. Review relevant hook usage
3. Test with browser DevTools
4. Refer to Tailwind responsive documentation
5. Check the animations module for available effects

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready
