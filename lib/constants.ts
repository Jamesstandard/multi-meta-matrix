// Design System Constants - Lobe AI Inspired

// Color Palette - Microsoft Fluent Design
export const COLORS = {
  primary: '#0078D4',
  cyan: '#00BCF2',
  green: '#107C10',
  purple: '#7D3C98',
  orange: '#F7630C',
  
  // Surfaces
  surfaceLight: '#F8F9FA',
  surfaceDark: '#1A1A1A',
  cardLight: '#FFFFFF',
  cardDark: '#2D2D2D',
  
  // Text
  textDark: '#1A1A1A',
  textLight: '#FFFFFF',
  textSecondary: '#666666',
  
  // Borders
  borderLight: '#E8E8E8',
  borderDark: '#404040',
  
  // States
  destructive: '#D13438',
  warning: '#F7630C',
  success: '#107C10',
  info: '#00BCF2',
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  display: { fontSize: '32px', fontWeight: 700, lineHeight: '40px' },
  headline: { fontSize: '24px', fontWeight: 700, lineHeight: '32px' },
  title: { fontSize: '20px', fontWeight: 700, lineHeight: '28px' },
  body: { fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
  bodySmall: { fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
  caption: { fontSize: '12px', fontWeight: 400, lineHeight: '16px' },
  code: { fontSize: '14px', fontWeight: 500, fontFamily: 'monospace' },
} as const;

// Spacing Scale
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
} as const;

// Border Radius
export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

// Shadow System
export const SHADOWS = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.06)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.08)',
} as const;

// Animation Durations (ms)
export const ANIMATIONS = {
  fast: 150,
  base: 200,
  slow: 300,
  slower: 500,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

// Navigation Items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'swarms', label: 'Swarms', icon: 'grid' },
  { id: 'skills', label: 'Skills', icon: 'puzzle' },
  { id: 'artifacts', label: 'Artifacts', icon: 'code' },
  { id: 'memory', label: 'Memory', icon: 'brain' },
  { id: 'inspect', label: 'Inspect', icon: 'wrench' },
] as const;

// Frameworks
export const FRAMEWORKS = {
  langgraph: { name: 'LangGraph', color: '#0078D4', description: 'Supervisor + Workers pattern' },
  crewai: { name: 'CrewAI', color: '#00BCF2', description: 'Agent teams with roles' },
  autogen: { name: 'AutoGen', color: '#107C10', description: 'Multi-agent conversation' },
  openclaw: { name: 'OpenClaw', color: '#F7630C', description: 'Flexible composition' },
} as const;

// Communication Channels
export const CHANNELS = {
  push: { name: 'Push Notifications', icon: 'bell' },
  telegram: { name: 'Telegram', icon: 'send' },
  whatsapp: { name: 'WhatsApp', icon: 'message-circle' },
  sms: { name: 'SMS', icon: 'phone' },
} as const;

// Kanban Columns
export const KANBAN_COLUMNS = [
  { id: 'planning', label: 'Planning', color: '#00BCF2' },
  { id: 'running', label: 'Running', color: '#107C10' },
  { id: 'review', label: 'Review', color: '#F7630C' },
  { id: 'completed', label: 'Completed', color: '#7D3C98' },
] as const;

// Empty States
export const EMPTY_STATES = {
  noChats: 'Start a new conversation',
  noSwarms: 'Create your first swarm',
  noSkills: 'Browse available skills',
  noMemory: 'No memories yet',
  noArtifacts: 'Select an artifact to view',
} as const;

// Toast Messages
export const MESSAGES = {
  success: 'Operation successful',
  error: 'Something went wrong',
  loading: 'Please wait...',
  copied: 'Copied to clipboard',
  saved: 'Changes saved',
  deleted: 'Item deleted',
} as const;
