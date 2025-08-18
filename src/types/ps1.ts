export interface PS1Color {
  type: 'ansi' | 'rgb' | 'hex'
  value: string | number
  bright?: boolean
}

export interface PS1Style {
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  blink?: boolean
  reverse?: boolean
  strikethrough?: boolean
  overline?: boolean
  foreground?: PS1Color
  background?: PS1Color
}

export interface PS1Element {
  id: string
  type: PS1ElementType
  label: string
  value: string
  style?: PS1Style
  customText?: string
  format?: string // for date/time formatting
}

export type PS1ElementType = 
  // Time and Date
  | 'date'
  | 'date_formatted'
  | 'time_24'
  | 'time_12'
  | 'time_ampm'
  | 'time_no_seconds'
  
  // User and System
  | 'username'
  | 'hostname_short'
  | 'hostname_full'
  | 'working_directory'
  | 'working_directory_basename'
  
  // Control Characters
  | 'newline'
  | 'carriage_return'
  | 'bell'
  
  // Terminal Info
  | 'terminal'
  | 'shell'
  | 'bash_version'
  | 'bash_release'
  
  // Command Info
  | 'history_number'
  | 'command_number'
  | 'jobs'
  | 'prompt_sign'
  | 'exit_status'
  
  // Git Integration
  | 'git_branch'
  | 'git_advanced'
  
  // Network
  | 'ip_address'
  
  // Custom
  | 'command'
  | 'environment_variable'
  | 'set_window_title'
  | 'text'
  | 'nerd_font_glyph'
  
  // Symbols
  | 'symbol'

export interface PS1ElementDefinition {
  type: PS1ElementType
  label: string
  description: string
  bashCode: string
  category: string
  icon?: string
  defaultStyle?: PS1Style
}

export interface PS1BuilderState {
  elements: PS1Element[]
  globalStyle?: PS1Style
}

export const PS1_ELEMENT_DEFINITIONS: PS1ElementDefinition[] = [
  // Time and Date
  {
    type: 'date',
    label: 'Date',
    description: 'Current date',
    bashCode: '\\d',
    category: 'Time & Date',
    icon: '📅'
  },
  {
    type: 'date_formatted',
    label: 'Date (formatted)',
    description: 'Date with custom format',
    bashCode: '\\D{%Y-%m-%d}',
    category: 'Time & Date',
    icon: '📅'
  },
  {
    type: 'time_24',
    label: 'Time (24-hour)',
    description: 'Time in 24-hour format',
    bashCode: '\\t',
    category: 'Time & Date',
    icon: '🕐'
  },
  {
    type: 'time_12',
    label: 'Time (12-hour)',
    description: 'Time in 12-hour format',
    bashCode: '\\T',
    category: 'Time & Date',
    icon: '🕐'
  },
  {
    type: 'time_ampm',
    label: 'Time (am/pm)',
    description: 'Time with AM/PM',
    bashCode: '\\@',
    category: 'Time & Date',
    icon: '🕐'
  },
  {
    type: 'time_no_seconds',
    label: 'Time (without seconds)',
    description: 'Time without seconds',
    bashCode: '\\A',
    category: 'Time & Date',
    icon: '🕐'
  },
  
  // User and System
  {
    type: 'username',
    label: 'Username',
    description: 'Current username',
    bashCode: '\\u',
    category: 'User & System',
    icon: '👤'
  },
  {
    type: 'hostname_short',
    label: 'Hostname (short)',
    description: 'Hostname up to first dot',
    bashCode: '\\h',
    category: 'User & System',
    icon: '💻'
  },
  {
    type: 'hostname_full',
    label: 'Hostname',
    description: 'Full hostname',
    bashCode: '\\H',
    category: 'User & System',
    icon: '💻'
  },
  {
    type: 'working_directory',
    label: 'Working Directory',
    description: 'Current working directory',
    bashCode: '\\w',
    category: 'User & System',
    icon: '📁'
  },
  {
    type: 'working_directory_basename',
    label: 'Working Directory (Basename)',
    description: 'Basename of current directory',
    bashCode: '\\W',
    category: 'User & System',
    icon: '📁'
  },
  
  // Control Characters
  {
    type: 'newline',
    label: 'Newline',
    description: 'Line break',
    bashCode: '\\n',
    category: 'Control',
    icon: '↵'
  },
  {
    type: 'carriage_return',
    label: 'Carriage Return',
    description: 'Carriage return',
    bashCode: '\\r',
    category: 'Control',
    icon: '⤴'
  },
  {
    type: 'bell',
    label: 'Bell',
    description: 'Bell character',
    bashCode: '\\a',
    category: 'Control',
    icon: '🔔'
  },
  
  // Terminal Info
  {
    type: 'terminal',
    label: 'Terminal',
    description: 'Terminal device name',
    bashCode: '\\l',
    category: 'Terminal Info',
    icon: '💻'
  },
  {
    type: 'shell',
    label: 'Shell',
    description: 'Shell name',
    bashCode: '\\s',
    category: 'Terminal Info',
    icon: '🐚'
  },
  {
    type: 'bash_version',
    label: 'Bash Version',
    description: 'Bash version',
    bashCode: '\\v',
    category: 'Terminal Info',
    icon: '🐚'
  },
  {
    type: 'bash_release',
    label: 'Bash Release',
    description: 'Bash version with patch level',
    bashCode: '\\V',
    category: 'Terminal Info',
    icon: '🐚'
  },
  
  // Command Info
  {
    type: 'history_number',
    label: 'History Number',
    description: 'History number of this command',
    bashCode: '\\!',
    category: 'Command Info',
    icon: '📜'
  },
  {
    type: 'command_number',
    label: 'Command Number',
    description: 'Command number of this command',
    bashCode: '\\#',
    category: 'Command Info',
    icon: '🔢'
  },
  {
    type: 'jobs',
    label: 'Jobs',
    description: 'Number of jobs currently managed',
    bashCode: '\\j',
    category: 'Command Info',
    icon: '⚙️'
  },
  {
    type: 'prompt_sign',
    label: 'Prompt Sign',
    description: '$ for regular user, # for root',
    bashCode: '\\$',
    category: 'Command Info',
    icon: '$'
  },
  {
    type: 'exit_status',
    label: 'Exit Status',
    description: 'Exit status of last command',
    bashCode: '$?',
    category: 'Command Info',
    icon: '✓'
  },
  
  // Custom elements
  {
    type: 'text',
    label: 'Text',
    description: 'Custom text',
    bashCode: 'TEXT',
    category: 'Custom',
    icon: '📝'
  },
  {
    type: 'symbol',
    label: 'Symbol',
    description: 'Special character or symbol',
    bashCode: 'SYMBOL',
    category: 'Custom',
    icon: '🔣'
  },
  {
    type: 'nerd_font_glyph',
    label: 'Nerd Font Glyph',
    description: 'Nerd Font icon',
    bashCode: 'GLYPH',
    category: 'Custom',
    icon: '🎨'
  },
  {
    type: 'git_branch',
    label: 'Git Branch',
    description: 'Current git branch',
    bashCode: '$(git branch --show-current 2>/dev/null)',
    category: 'Git',
    icon: '🌿'
  },
  {
    type: 'environment_variable',
    label: 'Environment Variable',
    description: 'Environment variable value',
    bashCode: '$VAR',
    category: 'Custom',
    icon: '🔧'
  }
]

export const COMMON_SYMBOLS = [
  '␣', '~', '!', '?', '@', '#', '$', '%', '^', '&', '*', '(', ')', '{', '}', 
  '[', ']', '-', '_', '+', '=', '/', '\\', '|', ',', '.', ':', ';', '"', "'", 
  '<', '>', '→', '←', '↑', '↓', '⚡', '🚀', '⭐', '🔥', '💻', '📁', '🌟', '✨'
]

export const ANSI_COLORS = [
  { name: 'Black', value: 0, hex: '#000000' },
  { name: 'Red', value: 1, hex: '#cc0000' },
  { name: 'Green', value: 2, hex: '#4e9a06' },
  { name: 'Yellow', value: 3, hex: '#c4a000' },
  { name: 'Blue', value: 4, hex: '#3465a4' },
  { name: 'Magenta', value: 5, hex: '#75507b' },
  { name: 'Cyan', value: 6, hex: '#06989a' },
  { name: 'White', value: 7, hex: '#d3d7cf' },
  { name: 'Bright Black', value: 8, hex: '#555753' },
  { name: 'Bright Red', value: 9, hex: '#ef2929' },
  { name: 'Bright Green', value: 10, hex: '#8ae234' },
  { name: 'Bright Yellow', value: 11, hex: '#fce94f' },
  { name: 'Bright Blue', value: 12, hex: '#729fcf' },
  { name: 'Bright Magenta', value: 13, hex: '#ad7fa8' },
  { name: 'Bright Cyan', value: 14, hex: '#34e2e2' },
  { name: 'Bright White', value: 15, hex: '#eeeeec' }
]

