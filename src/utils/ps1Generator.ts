import type { PS1Element, PS1Style, PS1Color, PS1BuilderState } from '@/types/ps1'

export function generateColorCode(color: PS1Color): string {
  switch (color.type) {
    case 'ansi':
      return `\\033[${color.bright ? '9' : '3'}${color.value}m`
    case 'rgb':
      // Assuming value is in format "r,g,b"
      return `\\033[38;2;${color.value}m`
    case 'hex':
      // Convert hex to RGB
      const hex = color.value.toString().replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return `\\033[38;2;${r};${g};${b}m`
    default:
      return ''
  }
}

export function generateBackgroundColorCode(color: PS1Color): string {
  switch (color.type) {
    case 'ansi':
      return `\\033[${color.bright ? '10' : '4'}${color.value}m`
    case 'rgb':
      return `\\033[48;2;${color.value}m`
    case 'hex':
      const hex = color.value.toString().replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return `\\033[48;2;${r};${g};${b}m`
    default:
      return ''
  }
}

export function generateStyleCodes(style: PS1Style): { start: string; end: string } {
  let startCodes: string[] = []
  let endCodes: string[] = []

  // Text styles
  if (style.bold) {
    startCodes.push('\\[$(tput bold)\\]')
    endCodes.push('\\[$(tput sgr0)\\]')
  }
  if (style.dim) {
    startCodes.push('\\[$(tput dim)\\]')
    endCodes.push('\\[$(tput sgr0)\\]')
  }
  if (style.italic) {
    startCodes.push('\\[\\033[3m\\]')
    endCodes.push('\\[\\033[23m\\]')
  }
  if (style.underline) {
    startCodes.push('\\[$(tput smul)\\]')
    endCodes.push('\\[$(tput rmul)\\]')
  }
  if (style.blink) {
    startCodes.push('\\[$(tput blink)\\]')
    endCodes.push('\\[$(tput sgr0)\\]')
  }
  if (style.reverse) {
    startCodes.push('\\[$(tput rev)\\]')
    endCodes.push('\\[$(tput sgr0)\\]')
  }
  if (style.strikethrough) {
    startCodes.push('\\[\\033[9m\\]')
    endCodes.push('\\[\\033[29m\\]')
  }

  // Colors
  if (style.foreground) {
    if (style.foreground.type === 'ansi') {
      startCodes.push(`\\[\\033[38;5;${style.foreground.value}m\\]`)
    } else {
      startCodes.push(`\\[${generateColorCode(style.foreground)}\\]`)
    }
    endCodes.push('\\[$(tput sgr0)\\]')
  }

  if (style.background) {
    if (style.background.type === 'ansi') {
      startCodes.push(`\\[\\033[48;5;${style.background.value}m\\]`)
    } else {
      startCodes.push(`\\[${generateBackgroundColorCode(style.background)}\\]`)
    }
    endCodes.push('\\[$(tput sgr0)\\]')
  }

  return {
    start: startCodes.join(''),
    end: endCodes.reverse().join('')
  }
}

export function generateElementCode(element: PS1Element): string {
  let code = ''
  
  // Apply styling
  if (element.style) {
    const { start, end } = generateStyleCodes(element.style)
    code += start
  }

  // Generate the actual element code
  switch (element.type) {
    case 'text':
      code += element.customText || element.value
      break
    case 'symbol':
      code += element.customText || element.value
      break
    case 'nerd_font_glyph':
      code += element.customText || element.value
      break
    case 'date_formatted':
      code += `\\D{${element.format || '%Y-%m-%d'}}`
      break
    case 'environment_variable':
      code += `$${element.customText || 'VAR'}`
      break
    case 'command':
      code += `$(${element.customText || 'command'})`
      break
    case 'git_branch':
      code += '$(git branch --show-current 2>/dev/null)'
      break
    case 'git_advanced':
      code += '$(git branch --show-current 2>/dev/null)$(git status --porcelain 2>/dev/null | wc -l | sed "s/^0$//" | sed "s/^/ +/")'
      break
    case 'ip_address':
      code += "$(hostname -I | awk '{print $1}')"
      break
    case 'set_window_title':
      code += `\\[\\033]0;${element.customText || 'Terminal'}\\007\\]`
      break
    default:
      code += element.value
      break
  }

  // Close styling
  if (element.style) {
    const { end } = generateStyleCodes(element.style)
    code += end
  }

  return code
}

export function generatePS1(state: PS1BuilderState): string {
  if (state.elements.length === 0) {
    return '\\$ '
  }

  let ps1 = ''
  
  for (const element of state.elements) {
    ps1 += generateElementCode(element)
  }

  return ps1
}

export function parsePS1(ps1String: string): PS1BuilderState {
  const state: PS1BuilderState = {
    elements: []
  }

  if (!ps1String.trim()) {
    return state
  }

  console.log('Parsing PS1:', ps1String)

  // Step 1: Parse the PS1 string while preserving style information
  let position = 0
  let elementId = 0
  let currentStyle: PS1Style = {}

  while (position < ps1String.length) {
    // Look for style/color codes
    const styleMatch = ps1String.substring(position).match(/^(\\\[.*?\\\]|\$\(tput [^)]+\)|\\033\[[0-9;]*m|\\e\[[0-9;]*m)/)
    
    if (styleMatch) {
      // Parse style information
      const styleCode = styleMatch[1]
      currentStyle = parseStyleCode(styleCode, currentStyle)
      position += styleMatch[0].length
      continue
    }

    // Look for bash prompt elements
    const elementMatch = ps1String.substring(position).match(/^(\\[udhtTAwnWD@!#$jlsvV]|\\\$|\\!)/)
    
    if (elementMatch) {
      const elementCode = elementMatch[1]
      const elementInfo = getBashElementInfo(elementCode)
      
      if (elementInfo) {
        state.elements.push({
          id: `parsed-element-${elementId++}`,
          type: elementInfo.type,
          label: elementInfo.label,
          value: elementCode,
          style: Object.keys(currentStyle).length > 0 ? { ...currentStyle } : undefined
        })
      }
      
      position += elementMatch[0].length
      continue
    }

    // Look for text content (including spaces)
    const textMatch = ps1String.substring(position).match(/^([^\\$]+|\\[^[udhtTAwnWD@!#$jlsvV]|[^\\]+)/)
    
    if (textMatch) {
      const textContent = textMatch[1]
      // 保留所有文本内容，包括空格
      if (textContent) {
        state.elements.push({
          id: `parsed-text-${elementId++}`,
          type: 'text',
          label: 'Text',
          value: 'TEXT',
          customText: textContent,
          style: Object.keys(currentStyle).length > 0 ? { ...currentStyle } : undefined
        })
      }
      position += textMatch[0].length
      continue
    }

    // Single character fallback (保留所有字符包括空格)
    const char = ps1String[position]
    if (char) {
      state.elements.push({
        id: `parsed-text-${elementId++}`,
        type: 'text',
        label: 'Text',
        value: 'TEXT',
        customText: char,
        style: Object.keys(currentStyle).length > 0 ? { ...currentStyle } : undefined
      })
    }
    position++
  }

  console.log('Parsed elements:', state.elements)
  return state
}

function parseStyleCode(styleCode: string, currentStyle: PS1Style): PS1Style {
  const newStyle = { ...currentStyle }

  // Parse tput commands
  if (styleCode.includes('tput')) {
    if (styleCode.includes('bold')) {
      newStyle.bold = true
    } else if (styleCode.includes('sgr0')) {
      // Reset all styles
      return {}
    } else if (styleCode.includes('dim')) {
      newStyle.dim = true
    } else if (styleCode.includes('smul')) {
      newStyle.underline = true
    } else if (styleCode.includes('rmul')) {
      newStyle.underline = false
    } else if (styleCode.includes('blink')) {
      newStyle.blink = true
    } else if (styleCode.includes('rev')) {
      newStyle.reverse = true
    }
  }

  // Parse ANSI color codes
  const ansiMatch = styleCode.match(/\\033\[38;5;(\d+)m|\\e\[38;5;(\d+)m/)
  if (ansiMatch) {
    const colorValue = parseInt(ansiMatch[1] || ansiMatch[2])
    newStyle.foreground = {
      type: 'ansi',
      value: colorValue
    }
  }

  const ansiBackgroundMatch = styleCode.match(/\\033\[48;5;(\d+)m|\\e\[48;5;(\d+)m/)
  if (ansiBackgroundMatch) {
    const colorValue = parseInt(ansiBackgroundMatch[1] || ansiBackgroundMatch[2])
    newStyle.background = {
      type: 'ansi',
      value: colorValue
    }
  }

  // Parse basic ANSI codes
  const basicAnsiMatch = styleCode.match(/\\033\[(\d+)m|\\e\[(\d+)m/)
  if (basicAnsiMatch) {
    const code = parseInt(basicAnsiMatch[1] || basicAnsiMatch[2])
    switch (code) {
      case 0:
        return {} // Reset
      case 1:
        newStyle.bold = true
        break
      case 2:
        newStyle.dim = true
        break
      case 3:
        newStyle.italic = true
        break
      case 4:
        newStyle.underline = true
        break
      case 5:
        newStyle.blink = true
        break
      case 7:
        newStyle.reverse = true
        break
      case 9:
        newStyle.strikethrough = true
        break
      // Basic colors (30-37 foreground, 40-47 background)
      case 30: case 31: case 32: case 33: case 34: case 35: case 36: case 37:
        newStyle.foreground = { type: 'ansi', value: code - 30 }
        break
      case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47:
        newStyle.background = { type: 'ansi', value: code - 40 }
        break
      // Bright colors (90-97 foreground, 100-107 background)
      case 90: case 91: case 92: case 93: case 94: case 95: case 96: case 97:
        newStyle.foreground = { type: 'ansi', value: code - 82, bright: true }
        break
      case 100: case 101: case 102: case 103: case 104: case 105: case 106: case 107:
        newStyle.background = { type: 'ansi', value: code - 92, bright: true }
        break
    }
  }

  return newStyle
}

function getBashElementInfo(elementCode: string): { type: any, label: string } | null {
  const elementMap: Record<string, { type: any, label: string }> = {
    '\\u': { type: 'username', label: 'Username' },
    '\\h': { type: 'hostname_short', label: 'Hostname (short)' },
    '\\H': { type: 'hostname_full', label: 'Hostname' },
    '\\w': { type: 'working_directory', label: 'Working Directory' },
    '\\W': { type: 'working_directory_basename', label: 'Working Directory (Basename)' },
    '\\d': { type: 'date', label: 'Date' },
    '\\t': { type: 'time_24', label: 'Time (24-hour)' },
    '\\T': { type: 'time_12', label: 'Time (12-hour)' },
    '\\@': { type: 'time_ampm', label: 'Time (am/pm)' },
    '\\A': { type: 'time_no_seconds', label: 'Time (without seconds)' },
    '\\n': { type: 'newline', label: 'Newline' },
    '\\$': { type: 'prompt_sign', label: 'Prompt Sign' },
    '\\#': { type: 'command_number', label: 'Command Number' },
    '\\!': { type: 'history_number', label: 'History Number' },
    '\\j': { type: 'jobs', label: 'Jobs' },
    '\\l': { type: 'terminal', label: 'Terminal' },
    '\\s': { type: 'shell', label: 'Shell' },
    '\\v': { type: 'bash_version', label: 'Bash Version' },
    '\\V': { type: 'bash_release', label: 'Bash Release' }
  }

  return elementMap[elementCode] || null
}

export function exportPS1AsScript(ps1: string): string {
  return `#!/bin/bash
# Generated PS1 script
export PS1="${ps1}"
`
}

export function createElementId(): string {
  return 'element-' + Math.random().toString(36).substr(2, 9)
}

