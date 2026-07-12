'use client';

import React, { useEffect, useState } from 'react';
import { useUIStore } from '@/lib/stores/ui';
import {
  Palette,
  Zap,
  Sliders,
  Database,
  Lock,
  Code,
  X,
  ChevronLeft,
} from '@/lib/icons';
import { soundManager } from '@/lib/utils/animations';

interface SettingsCategory {
  id: 'appearance' | 'behavior' | 'agent' | 'integrations' | 'privacy' | 'developer';
  label: string;
  description: string;
  icon: React.ReactNode;
}

const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Theme, colors, and UI customization',
    icon: <Palette className="w-5 h-5" />,
  },
  {
    id: 'behavior',
    label: 'Behavior',
    description: 'Animations, sounds, and interactions',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 'agent',
    label: 'Agent Config',
    description: 'Default agent settings and presets',
    icon: <Sliders className="w-5 h-5" />,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Connected services and APIs',
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    description: 'Data handling and security settings',
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: 'developer',
    label: 'Developer',
    description: 'Advanced settings and debugging',
    icon: <Code className="w-5 h-5" />,
  },
];

export function ResponsiveSettings() {
  const {
    deviceType,
    settingsOpen,
    activeSettingsCategory,
    setActiveSettingsCategory,
    soundEnabled,
    animationsEnabled,
    setSoundEnabled,
    setAnimationsEnabled,
    toggleSettings,
    settingsCollapsed,
    toggleSettingsCollapsed,
  } = useUIStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  // Mobile: Bottom Sheet
  if (isMobile && settingsOpen) {
    return <SettingsBottomSheet />;
  }

  // Tablet/Desktop: Side Panel
  return (
    <aside
      className={`hidden md:flex flex-col border-l border-border bg-card/50 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
        settingsCollapsed ? 'md:w-20' : 'md:w-80'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!settingsCollapsed && <h3 className="font-bold text-base">Settings</h3>}
        <button
          onClick={() => toggleSettingsCollapsed()}
          className="p-2 hover:bg-secondary rounded-lg ml-auto"
          title={settingsCollapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${settingsCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {/* Category List */}
        <div className={`${settingsCollapsed ? 'p-2' : 'p-4'} space-y-2`}>
          {SETTINGS_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveSettingsCategory(category.id);
                soundManager.playClick();
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activeSettingsCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              } ${settingsCollapsed ? 'justify-center' : ''}`}
              title={settingsCollapsed ? category.label : undefined}
            >
              {category.icon}
              {!settingsCollapsed && (
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">{category.label}</div>
                  <div className="text-xs text-muted-foreground">{category.description}</div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        {!settingsCollapsed && (
          <div className="p-4 border-t border-border space-y-4">
            <SettingsCategoryContent
              category={activeSettingsCategory}
              soundEnabled={soundEnabled}
              animationsEnabled={animationsEnabled}
              onSoundToggle={(enabled) => {
                setSoundEnabled(enabled);
                if (enabled) soundManager.playSuccess();
              }}
              onAnimationsToggle={setAnimationsEnabled}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

// Bottom Sheet for Mobile
function SettingsBottomSheet() {
  const {
    toggleSettings,
    activeSettingsCategory,
    setActiveSettingsCategory,
    soundEnabled,
    animationsEnabled,
    setSoundEnabled,
    setAnimationsEnabled,
  } = useUIStore();

  const [showCategoryList, setShowCategoryList] = useState(true);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={() => toggleSettings()}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border z-50 animate-slideUp max-h-[90vh] overflow-hidden flex flex-col">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
          {showCategoryList ? (
            <h3 className="font-bold text-lg">Settings</h3>
          ) : (
            <>
              <button
                onClick={() => setShowCategoryList(true)}
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <h3 className="font-bold text-lg">
                {SETTINGS_CATEGORIES.find((c) => c.id === activeSettingsCategory)?.label}
              </h3>
              <div className="w-6" />
            </>
          )}
          <button
            onClick={() => toggleSettings()}
            className="p-2 hover:bg-secondary rounded-lg ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showCategoryList ? (
            // Category List
            <div className="p-4 space-y-2">
              {SETTINGS_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveSettingsCategory(category.id);
                    setShowCategoryList(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-all"
                >
                  {category.icon}
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">{category.label}</div>
                    <div className="text-xs text-muted-foreground">{category.description}</div>
                  </div>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              ))}
            </div>
          ) : (
            // Category Content
            <div className="p-4 space-y-4">
              <SettingsCategoryContent
                category={activeSettingsCategory}
                soundEnabled={soundEnabled}
                animationsEnabled={animationsEnabled}
                onSoundToggle={(enabled) => {
                  setSoundEnabled(enabled);
                  if (enabled) soundManager.playSuccess();
                }}
                onAnimationsToggle={setAnimationsEnabled}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface SettingsCategoryContentProps {
  category: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  onAnimationsToggle: (enabled: boolean) => void;
}

function SettingsCategoryContent({
  category,
  soundEnabled,
  animationsEnabled,
  onSoundToggle,
  onAnimationsToggle,
}: SettingsCategoryContentProps) {
  const renderCategorySettings = () => {
    switch (category) {
      case 'appearance':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Appearance</h4>
            <ToggleSetting label="Dark Mode" description="Use dark color scheme" defaultValue={true} />
            <ToggleSetting label="Compact UI" description="Reduce spacing and padding" defaultValue={false} />
            <SelectSetting
              label="Font Size"
              options={['Small', 'Medium', 'Large']}
              defaultValue="Medium"
            />
          </div>
        );

      case 'behavior':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Behavior</h4>
            <ToggleSetting
              label="Animations"
              description="Enable UI animations and transitions"
              defaultValue={animationsEnabled}
              onChange={onAnimationsToggle}
            />
            <ToggleSetting
              label="Sound Effects"
              description="Play sounds for interactions"
              defaultValue={soundEnabled}
              onChange={onSoundToggle}
            />
            <ToggleSetting label="Haptics" description="Vibration feedback on mobile" defaultValue={true} />
          </div>
        );

      case 'agent':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Agent Configuration</h4>
            <SelectSetting
              label="Default Framework"
              options={['CrewAI', 'AutoGen', 'LangGraph', 'OpenClaw']}
              defaultValue="CrewAI"
            />
            <SelectSetting
              label="Default Model"
              options={['GPT-4', 'Claude 3', 'Llama 2', 'Mixtral']}
              defaultValue="GPT-4"
            />
            <RangeSlider label="Default Temperature" min={0} max={2} step={0.1} defaultValue={0.7} />
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Integrations</h4>
            <div className="text-sm text-muted-foreground">Manage connected services in their respective panels.</div>
            <div className="space-y-2">
              <IntegrationStatus name="GitHub" connected={true} />
              <IntegrationStatus name="OpenAI" connected={true} />
              <IntegrationStatus name="Google Drive" connected={false} />
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Privacy & Security</h4>
            <ToggleSetting label="Analytics" description="Help improve MMM with usage data" defaultValue={false} />
            <ToggleSetting label="Crash Reports" description="Send error logs to developers" defaultValue={true} />
            <ToggleSetting label="API Logging" description="Log API calls for debugging" defaultValue={false} />
          </div>
        );

      case 'developer':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Developer Options</h4>
            <ToggleSetting label="Debug Mode" description="Show additional debugging info" defaultValue={false} />
            <ToggleSetting label="Performance Monitoring" description="Track component render times" defaultValue={false} />
            <button className="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80">
              Export Debug Logs
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return renderCategorySettings();
}

// Settings Components
function ToggleSetting({
  label,
  description,
  defaultValue,
  onChange,
}: {
  label: string;
  description: string;
  defaultValue: boolean;
  onChange?: (value: boolean) => void;
}) {
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (newValue: boolean) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button
        onClick={() => handleChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-primary' : 'bg-secondary'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function SelectSetting({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue: string;
}) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mt-2 px-3 py-2 bg-secondary text-foreground rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function RangeSlider({
  label,
  min,
  max,
  step,
  defaultValue,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm text-muted-foreground">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

function IntegrationStatus({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
      <div className="text-sm font-medium text-foreground">{name}</div>
      <div className={`text-xs font-medium px-2 py-1 rounded ${
        connected ? 'bg-green-500/20 text-green-600' : 'bg-muted text-muted-foreground'
      }`}>
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}

// Settings Button for Desktop/Tablet
export function SettingsButton() {
  const { deviceType, toggleSettings } = useUIStore();

  if (deviceType === 'mobile') return null;

  return (
    <button
      onClick={() => toggleSettings()}
      className="p-2 hover:bg-secondary rounded-lg"
      title="Open settings"
    >
      <Settings className="w-5 h-5" />
    </button>
  );
}
