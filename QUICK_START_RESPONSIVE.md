# Quick Start: Responsive UI System

Get started with the responsive UI in 5 minutes.

## TL;DR

Your app now has:
- ✅ Mobile-first responsive design
- ✅ Automatic device detection
- ✅ Retractable navigation and settings panels
- ✅ Smooth animations and optional sounds
- ✅ Touch-optimized interactions
- ✅ 10+ custom hooks

## Installation

Everything is already installed! Just use the components.

## Basic Usage

### 1. Use Responsive Layouts

```typescript
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveHeader,
} from '@/components/responsive-layouts';

export function MyView() {
  return (
    <ResponsiveContainer>
      <ResponsiveHeader title="My View" />
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        <ResponsiveCard>Item 1</ResponsiveCard>
        <ResponsiveCard>Item 2</ResponsiveCard>
        <ResponsiveCard>Item 3</ResponsiveCard>
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
}
```

### 2. Use Responsive Hooks

```typescript
import { useResponsive } from '@/lib/hooks/use-responsive';

function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile) {
    return <MobileView />;
  }
  return <DesktopView />;
}
```

### 3. Add Notifications

```typescript
import { useToast } from '@/components/interactive-feedback';

function MyComponent() {
  const { addToast } = useToast();

  return (
    <button
      onClick={() => {
        addToast({
          message: 'Success!',
          type: 'success',
          duration: 3000,
        });
      }}
    >
      Show Toast
    </button>
  );
}
```

### 4. Control Navigation & Settings

```typescript
import { useUIStore } from '@/lib/stores/ui';

function MyComponent() {
  const {
    navOpen,
    toggleNav,
    settingsOpen,
    toggleSettings,
    soundEnabled,
    setSoundEnabled,
  } = useUIStore();

  return (
    <div>
      <button onClick={() => toggleNav()}>
        {navOpen ? 'Close Nav' : 'Open Nav'}
      </button>
      <button onClick={() => toggleSettings()}>
        {settingsOpen ? 'Close Settings' : 'Open Settings'}
      </button>
      <button onClick={() => setSoundEnabled(!soundEnabled)}>
        Sounds: {soundEnabled ? 'On' : 'Off'}
      </button>
    </div>
  );
}
```

## Common Patterns

### Responsive Grid
```typescript
// Auto-adapts: 1 col (mobile), 2 col (tablet), 3 col (desktop)
<ResponsiveGrid>
  <ResponsiveCard>1</ResponsiveCard>
  <ResponsiveCard>2</ResponsiveCard>
  <ResponsiveCard>3</ResponsiveCard>
</ResponsiveGrid>
```

### Responsive Stack
```typescript
// Mobile: column, Desktop: row
<ResponsiveStack responsive>
  <div>Left</div>
  <div>Right</div>
</ResponsiveStack>
```

### Responsive Modal
```typescript
<ResponsiveModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="My Modal"
  size="lg"
>
  Content here
</ResponsiveModal>
```

### Responsive Tabs
```typescript
<ResponsiveTabs
  tabs={[
    { label: 'Tab 1', value: 'tab1' },
    { label: 'Tab 2', value: 'tab2' },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

## Animations

### Built-in Classes

```html
<!-- Fade animations -->
<div class="animate-fadeIn">Fade in</div>
<div class="animate-fadeOut">Fade out</div>

<!-- Slide animations -->
<div class="animate-slideInLeft">Slide from left</div>
<div class="animate-slideUp">Slide up</div>
<div class="animate-slideDown">Slide down</div>

<!-- Scale animations -->
<div class="animate-scaleIn">Scale in</div>

<!-- Standard animations -->
<div class="animate-bounce">Bounce</div>
<div class="animate-pulse">Pulse</div>
<div class="animate-spin">Spin</div>
```

### Custom Animations

```typescript
import { ANIMATION_PRESETS } from '@/lib/utils/animations';

// Use presets
const preset = ANIMATION_PRESETS.spring; // 600ms with spring easing
const preset = ANIMATION_PRESETS.quick;  // 300ms quick animation
const preset = ANIMATION_PRESETS.smooth; // 700ms smooth transition
```

## Interactive Components

### Toast Notifications

```typescript
addToast({
  message: 'Action completed',
  type: 'success',    // success | error | info | warning
  duration: 4000,
});
```

### Progress Ring

```typescript
<ProgressRing progress={75} size={100} />
```

### Loading Skeleton

```typescript
<SkeletonLoader count={5} />
```

### Expandable Card

```typescript
<ExpandableCard title="Advanced Options">
  Hidden content appears when clicked
</ExpandableCard>
```

### Floating Action Button

```typescript
<FloatingActionButton
  icon={<Plus />}
  label="Add new"
  onClick={handleAdd}
  position="bottom-right"
/>
```

## Responsive Breakpoints

```typescript
// Mobile first
<div className="p-4">Mobile padding</div>

// Add tablet styles
<div className="p-4 sm:p-6">Tablet padding</div>

// Add desktop styles
<div className="p-4 sm:p-6 lg:p-8">Desktop padding</div>

// Typography
<h1 className="text-xl sm:text-2xl lg:text-3xl">
  Responsive heading
</h1>
```

## Device Detection

```typescript
import { useResponsive, useBreakpoint } from '@/lib/hooks/use-responsive';

// Option 1: useResponsive hook
const { isMobile, isTablet, isDesktop, screenWidth } = useResponsive();

// Option 2: useBreakpoint hook
const isLargeScreen = useBreakpoint('lg');   // min-width: 1024px
const isMedium = useBreakpoint('md');        // min-width: 768px

// Option 3: useMediaQuery hook
const isWide = useMediaQuery('(min-width: 1280px)');
```

## Settings & Preferences

Users can access settings in the right sidebar (desktop) or bottom sheet (mobile).

### Available Settings

1. **Appearance** - Theme, colors, compact mode
2. **Behavior** - Animations, sounds, haptics
3. **Agent Config** - Default settings
4. **Integrations** - Connected services
5. **Privacy & Security** - Data handling
6. **Developer** - Debug mode

### Access Settings Programmatically

```typescript
const { soundEnabled, animationsEnabled } = useUIStore();

// Toggle sound effects
soundEnabled ? playSound() : null;

// Check if animations are enabled
if (animationsEnabled) {
  applyAnimation();
}
```

## Testing on Multiple Devices

### Browser DevTools
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device preset or custom size
4. Test responsive behavior

### Mobile Devices
- Test on real phone/tablet
- Check touch interactions
- Verify landscape orientation
- Test on slow networks

### Screen Sizes
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1024px+ (laptop)
- Wide: 1440px (monitor)

## Common Issues & Solutions

### Layout looks wrong on mobile
- Check you're using responsive components
- Use mobile-first CSS (start with mobile, add `sm:`, `md:`, `lg:`)
- Verify breakpoints in Tailwind config

### Animations feel sluggish
- Animations are disabled by default
- Check if user enabled them in settings
- Use GPU-accelerated properties (transform, opacity)
- Test on device with DevTools performance tab

### Sounds not playing
- Sounds are disabled by default
- User can enable in Behavior settings
- Sounds require user interaction first (browser policy)
- Check browser console for audio errors

### Navigation panel not visible on mobile
- Navigation appears as overlay on mobile
- Click hamburger icon or tap outside to open
- Swipe to dismiss (future feature)
- Check device detection with `useResponsive()`

## Next Steps

1. **Read Full Guide:** Check `RESPONSIVE_UI_GUIDE.md` for complete documentation
2. **Review Examples:** Look at existing views like `skills-view.tsx`
3. **Test on Devices:** Use real devices and DevTools
4. **Customize:** Add your own animations and components
5. **Deploy:** Everything is production-ready

## File Quick Reference

| File | Purpose | Quick Use |
|------|---------|-----------|
| `components/responsive-layouts.tsx` | Layout components | `<ResponsiveGrid>` |
| `lib/hooks/use-responsive.ts` | Detection hooks | `useResponsive()` |
| `components/interactive-feedback.tsx` | Feedback UIs | `useToast()` |
| `lib/stores/ui.ts` | State management | `useUIStore()` |
| `lib/utils/animations.ts` | Animation system | `ANIMATION_PRESETS` |
| `app/globals.css` | Animation classes | `animate-fadeIn` |

## Performance Tips

1. Use Tailwind responsive classes instead of custom media queries
2. Leverage hooks like `useResponsive()` for conditional rendering
3. Animations are GPU-accelerated when using `transform` and `opacity`
4. Sounds are lazy-loaded (only when first used)
5. Test performance on mobile with DevTools Lighthouse

## Accessibility

- All components follow WCAG AA standards
- Keyboard navigation works everywhere
- Screen readers supported
- Motion preferences respected
- Color contrast meets requirements

## Getting Help

1. Check `RESPONSIVE_UI_GUIDE.md` for detailed documentation
2. Review `IMPLEMENTATION_SUMMARY.md` for architecture details
3. Look at component examples in the codebase
4. Check React/Tailwind docs for CSS questions
5. Test with DevTools for debugging

---

**That's it!** You're ready to build responsive UIs. 🚀

See `RESPONSIVE_UI_GUIDE.md` for complete documentation.
