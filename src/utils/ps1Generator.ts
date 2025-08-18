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
  let ansiCodes: number[] = []
  
  // Collect all ANSI style codes
  if (style.bold) ansiCodes.push(1)
  if (style.dim) ansiCodes.push(2) 
  if (style.italic) ansiCodes.push(3)
  if (style.underline) ansiCodes.push(4)
  if (style.blink) ansiCodes.push(5)
  if (style.reverse) ansiCodes.push(7)
  if (style.strikethrough) ansiCodes.push(9)
  if (style.overline) ansiCodes.push(53)

  // Add color codes
  if (style.foreground?.type === 'ansi') {
    ansiCodes.push(38, 5, style.foreground.value as number)
  } else if (style.foreground?.type === 'hex') {
    // Convert hex to RGB
    const hex = style.foreground.value.toString().replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    ansiCodes.push(38, 2, r, g, b)
  }

  if (style.background?.type === 'ansi') {
    ansiCodes.push(48, 5, style.background.value as number)
  } else if (style.background?.type === 'hex') {
    // Convert hex to RGB
    const hex = style.background.value.toString().replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    ansiCodes.push(48, 2, r, g, b)
  }

  const start = ansiCodes.length > 0 ? `\\[\\e[${ansiCodes.join(';')}m\\]` : ''
  const end = ansiCodes.length > 0 ? '\\[\\e[0m\\]' : ''

  return { start, end }
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
    case 'prompt_sign':
      code += '\\$'
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
    const textMatch = ps1String.substring(position).match(/^([^\\]+)/)
    
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

  // Parse tput commands (legacy support)
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
    return newStyle
  }

  // Parse combined ANSI codes (e.g., \[\e[1;2;3;38;5;213m\])
  const ansiCombinedMatch = styleCode.match(/\\(?:033\[|e\[)([0-9;]+)m/)
  if (ansiCombinedMatch) {
    const codes = ansiCombinedMatch[1].split(';').map(code => parseInt(code))
    
    let i = 0
    while (i < codes.length) {
      const code = codes[i]
      
      switch (code) {
        case 0:
          return {} // Reset all styles
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
        case 53:
          newStyle.overline = true
          break
        case 38:
          // Foreground color
          if (i + 1 < codes.length && codes[i + 1] === 5 && i + 2 < codes.length) {
            // 256-color: 38;5;n
            newStyle.foreground = {
              type: 'ansi',
              value: codes[i + 2]
            }
            i += 2 // Skip the next two codes (5 and color value)
          } else if (i + 1 < codes.length && codes[i + 1] === 2 && i + 4 < codes.length) {
            // RGB color: 38;2;r;g;b
            const r = codes[i + 2]
            const g = codes[i + 3]
            const b = codes[i + 4]
            newStyle.foreground = {
              type: 'hex',
              value: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
            }
            i += 4 // Skip the next four codes (2, r, g, b)
          }
          break
        case 48:
          // Background color
          if (i + 1 < codes.length && codes[i + 1] === 5 && i + 2 < codes.length) {
            // 256-color: 48;5;n
            newStyle.background = {
              type: 'ansi',
              value: codes[i + 2]
            }
            i += 2 // Skip the next two codes (5 and color value)
          } else if (i + 1 < codes.length && codes[i + 1] === 2 && i + 4 < codes.length) {
            // RGB color: 48;2;r;g;b
            const r = codes[i + 2]
            const g = codes[i + 3]
            const b = codes[i + 4]
            newStyle.background = {
              type: 'hex',
              value: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
            }
            i += 4 // Skip the next four codes (2, r, g, b)
          }
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
      i++
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

