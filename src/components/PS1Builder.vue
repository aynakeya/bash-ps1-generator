<template>
  <div class="max-w-full mx-auto px-4">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Elements Palette -->
      <div class="lg:col-span-4">
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body p-4">
            <h3 class="card-title text-lg mb-4">Elements</h3>
            <div class="space-y-4">
              <div
                v-for="category in categories"
                :key="category"
                class="mb-4"
              >
                <h4 class="text-sm font-medium text-gray-700 mb-2 border-b border-gray-300 pb-1">
                  {{ category }}
                </h4>
                <div class="grid grid-cols-2 gap-1">
                  <div
                    v-for="elementDef in getElementsByCategory(category)"
                    :key="elementDef.type"
                    class="btn btn-xs btn-ghost justify-start gap-1 h-auto py-1 px-2 text-left"
                    draggable="true"
                    @dragstart="startDrag($event, elementDef)"
                    :title="elementDef.description"
                  >
                    <span class="text-sm flex-shrink-0">{{ elementDef.icon }}</span>
                    <span class="text-xs truncate leading-tight">{{ elementDef.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Builder Area -->
      <div :class="selectedElement ? 'lg:col-span-5' : 'lg:col-span-8'">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">PS1 Builder</h3>
            
            <!-- Drop Zone -->
            <div
              class="min-h-32 p-4 border-2 border-dashed rounded-lg transition-all duration-200"
              :class="isDragOver ? 'border-primary bg-primary/10' : 'border-base-300 bg-base-50'"
              @dragover.prevent
              @drop="handleDrop"
              @dragenter="isDragOver = true"
              @dragleave="isDragOver = false"
            >
              <div v-if="builderState.elements.length === 0" class="text-center text-gray-500 py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p>Drag elements here to build your PS1 prompt</p>
              </div>
              
              <div v-else class="flex flex-wrap gap-2">
                <div
                  v-for="(element, index) in builderState.elements"
                  :key="element.id"
                  class="badge badge-lg gap-2 cursor-pointer transition-all duration-200"
                  :class="selectedElement?.id === element.id ? 'badge-primary' : 'badge-neutral'"
                  @click="toggleElementSelection(element)"
                >
                  <span class="font-mono text-xs">{{ getElementPreview(element) }}</span>
                  <button
                    class="btn btn-ghost btn-xs btn-circle"
                    @click.stop="removeElement(index)"
                    title="Remove element"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Generated PS1 -->
            <div class="mt-6">
              <h4 class="text-md font-semibold mb-2">Generated PS1:</h4>
              <div class="flex gap-2">
                <div class="mockup-code flex-1 text-xs">
                  <pre data-prefix="$"><code class="text-xs font-mono leading-relaxed">{{ generatedPS1 }}</code></pre>
                </div>
                <button 
                  @click="copyToClipboard" 
                  class="btn btn-primary btn-sm"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div class="mt-6">
              <h4 class="text-md font-semibold mb-2">Preview:</h4>
              <div class="terminal-preview relative">
                <!-- Terminal window decorations -->
                <div class="absolute top-2 left-3 flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div class="pt-8">
                  <span v-html="previewHTML"></span><span class="animate-pulse">█</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Properties Panel -->
      <div class="lg:col-span-3" v-if="selectedElement">
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body p-4">
            <h3 class="card-title text-lg mb-4">Element Properties</h3>
            
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">Element Type:</span>
              </label>
              <div class="badge badge-primary">{{ selectedElement.label }}</div>
            </div>

            <!-- Custom Text Input -->
            <div class="form-control mb-4" v-if="needsCustomText(selectedElement)">
              <label class="label" for="custom-text">
                <span class="label-text font-medium">Custom Text:</span>
              </label>
              <input
                id="custom-text"
                v-model="selectedElement.customText"
                type="text"
                class="input input-bordered input-sm"
                :placeholder="getCustomTextPlaceholder(selectedElement)"
              />
              
              <!-- Symbol Picker for text and symbol elements -->
              <SymbolPicker 
                v-if="selectedElement.type === 'text' || selectedElement.type === 'symbol'"
                @select="insertSymbol"
              />
            </div>

            <!-- Date Format Input -->
            <div class="form-control mb-4" v-if="selectedElement.type === 'date_formatted'">
              <label class="label" for="date-format">
                <span class="label-text font-medium">Date Format:</span>
              </label>
              <input
                id="date-format"
                v-model="selectedElement.format"
                type="text"
                class="input input-bordered input-sm"
                placeholder="%Y-%m-%d"
              />
              <label class="label">
                <span class="label-text-alt">Use strftime format codes</span>
              </label>
            </div>

            <!-- Style Options -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">Style:</span>
              </label>
              
              <div class="flex flex-col gap-2">
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.bold"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Bold</span>
                </label>
                
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.italic"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Italic</span>
                </label>
                
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.underline"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Underline</span>
                </label>
                
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.dim"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Dim</span>
                </label>
                
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.blink"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Blink</span>
                </label>
                
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.reverse"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Reverse</span>
                </label>
                
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.strikethrough"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Strikethrough</span>
                </label>
                
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    v-model="elementStyle.overline"
                    @change="updateElementStyle"
                  />
                  <span class="label-text">Overline</span>
                </label>
              </div>
            </div>

            <!-- Color Picker -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">Text Color:</span>
              </label>
              <div class="flex gap-2">
                <input
                  type="color"
                  class="w-12 h-8 rounded border border-base-300"
                  v-model="foregroundColor"
                  @change="updateForegroundColor"
                />
                <select class="select select-bordered select-sm flex-1" v-model="colorMode" @change="updateColorMode">
                  <option value="hex">Hex</option>
                  <option value="ansi">ANSI</option>
                </select>
              </div>
            </div>

            <!-- Background Color -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Background Color:</span>
              </label>
              <div class="flex gap-2">
                <input
                  type="color"
                  class="w-12 h-8 rounded border border-base-300"
                  v-model="backgroundColor"
                  @change="updateBackgroundColor"
                />
                <button @click="clearBackgroundColor" class="btn btn-error btn-sm flex-1">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import/Export -->
    <div class="mt-8">
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-lg mb-4">Import/Export</h3>
          <div class="space-y-4">
            <textarea
              v-model="importExportText"
              class="textarea textarea-bordered w-full"
              placeholder="Paste PS1 string here to import, or copy generated PS1"
              rows="3"
            ></textarea>
            <div class="flex flex-wrap gap-2">
              <button @click="importPS1" class="btn btn-success btn-sm">Import PS1</button>
              <button @click="exportPS1" class="btn btn-info btn-sm">Export PS1</button>
              <button @click="clearBuilder" class="btn btn-error btn-sm">Clear All</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { PS1Element, PS1ElementDefinition, PS1BuilderState, PS1Style } from '@/types/ps1'
import { PS1_ELEMENT_DEFINITIONS } from '@/types/ps1'
import { generatePS1, generateElementCode, parsePS1, createElementId } from '@/utils/ps1Generator'
import SymbolPicker from './SymbolPicker.vue'

// Reactive state
const builderState = reactive<PS1BuilderState>({
  elements: []
})

const selectedElement = ref<PS1Element | null>(null)
const isDragOver = ref(false)
const importExportText = ref('')

// Element style properties for the selected element
const elementStyle = reactive({
  bold: false,
  dim: false,
  italic: false,
  underline: false,
  blink: false,
  reverse: false,
  strikethrough: false,
  overline: false
})

const foregroundColor = ref('#ffffff')
const backgroundColor = ref('#000000')
const colorMode = ref<'hex' | 'ansi'>('hex')

// Computed properties
const categories = computed(() => {
  const cats = new Set(PS1_ELEMENT_DEFINITIONS.map(def => def.category))
  return Array.from(cats).sort()
})

const generatedPS1 = computed(() => {
  return generatePS1(builderState)
})

const previewHTML = computed(() => {
  // Generate a realistic HTML preview with proper colors and styles
  let preview = ''
  for (const element of builderState.elements) {
    const text = getElementPreview(element)
    let styles: string[] = []
    
    if (element.style) {
      // Text styles
      if (element.style.bold) styles.push('font-weight: bold')
      if (element.style.italic) styles.push('font-style: italic') 
      if (element.style.underline) styles.push('text-decoration: underline')
      if (element.style.blink) styles.push('animation: blink 1s infinite')
      if (element.style.reverse) styles.push('filter: invert(1)')
      if (element.style.dim) styles.push('opacity: 0.7')
      if (element.style.strikethrough) styles.push('text-decoration: line-through')
      if (element.style.overline) styles.push('text-decoration: overline')
      
      // Foreground color
      if (element.style.foreground) {
        if (element.style.foreground.type === 'hex') {
          styles.push(`color: ${element.style.foreground.value}`)
        } else if (element.style.foreground.type === 'ansi') {
          const hexColor = ansiToHex(element.style.foreground.value as number)
          styles.push(`color: ${hexColor}`)
        }
      }
      
      // Background color
      if (element.style.background) {
        if (element.style.background.type === 'hex') {
          styles.push(`background-color: ${element.style.background.value}`)
        } else if (element.style.background.type === 'ansi') {
          const hexColor = ansiToHex(element.style.background.value as number)
          styles.push(`background-color: ${hexColor}`)
        }
      }
    }
    
    if (element.type === 'newline') {
      preview += '<br>'
    } else {
      const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : ''
      preview += `<span${styleAttr}>${escapeHtml(text)}</span>`
    }
  }
  return preview || '<span style="color: #666;">Empty prompt</span>'
})

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Methods
function getElementsByCategory(category: string): PS1ElementDefinition[] {
  return PS1_ELEMENT_DEFINITIONS.filter(def => def.category === category)
}

function startDrag(event: DragEvent, elementDef: PS1ElementDefinition) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(elementDef))
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  
  if (event.dataTransfer) {
    try {
      const elementDef: PS1ElementDefinition = JSON.parse(
        event.dataTransfer.getData('application/json')
      )
      
      const newElement: PS1Element = {
        id: createElementId(),
        type: elementDef.type,
        label: elementDef.label,
        value: elementDef.bashCode,
        style: elementDef.defaultStyle ? { ...elementDef.defaultStyle } : undefined
      }
      
      builderState.elements.push(newElement)
    } catch (error) {
      console.error('Failed to parse dropped element:', error)
    }
  }
}

function toggleElementSelection(element: PS1Element) {
  // 如果点击的是已选中的元素，则取消选择
  if (selectedElement.value?.id === element.id) {
    selectedElement.value = null
    return
  }
  
  // 否则选择该元素
  selectElement(element)
}

function selectElement(element: PS1Element) {
  selectedElement.value = element
  
  // Update style controls
  if (element.style) {
    elementStyle.bold = element.style.bold || false
    elementStyle.dim = element.style.dim || false
    elementStyle.italic = element.style.italic || false
    elementStyle.underline = element.style.underline || false
    elementStyle.blink = element.style.blink || false
    elementStyle.reverse = element.style.reverse || false
    elementStyle.strikethrough = element.style.strikethrough || false
    elementStyle.overline = element.style.overline || false
    
    // Handle foreground color
    if (element.style.foreground) {
      if (element.style.foreground.type === 'hex') {
        foregroundColor.value = element.style.foreground.value as string
        colorMode.value = 'hex'
      } else if (element.style.foreground.type === 'ansi') {
        // Convert ANSI color to approximate hex for display
        foregroundColor.value = ansiToHex(element.style.foreground.value as number)
        colorMode.value = 'ansi'
      }
    } else {
      foregroundColor.value = '#ffffff'
    }
    
    // Handle background color
    if (element.style.background) {
      if (element.style.background.type === 'hex') {
        backgroundColor.value = element.style.background.value as string
      } else if (element.style.background.type === 'ansi') {
        backgroundColor.value = ansiToHex(element.style.background.value as number)
      }
    } else {
      backgroundColor.value = '#000000'
    }
  } else {
    // Reset style controls
    Object.assign(elementStyle, {
      bold: false,
      dim: false,
      italic: false,
      underline: false,
      blink: false,
      reverse: false,
      strikethrough: false,
      overline: false
    })
    foregroundColor.value = '#ffffff'
    backgroundColor.value = '#000000'
    colorMode.value = 'hex'
  }
}

function ansiToHex(ansiColor: number): string {
  // Standard ANSI colors (0-15) with more accurate terminal colors
  const ansiColors = [
    '#000000', // Black
    '#cc0000', // Red
    '#4e9a06', // Green  
    '#c4a000', // Yellow
    '#3465a4', // Blue
    '#75507b', // Magenta
    '#06989a', // Cyan
    '#d3d7cf', // Light Gray
    '#555753', // Dark Gray
    '#ef2929', // Light Red
    '#8ae234', // Light Green
    '#fce94f', // Light Yellow
    '#729fcf', // Light Blue
    '#ad7fa8', // Light Magenta
    '#34e2e2', // Light Cyan
    '#eeeeec'  // White
  ]
  
  if (ansiColor >= 0 && ansiColor < ansiColors.length) {
    return ansiColors[ansiColor]
  }
  
  // 216 color cube (16-231)
  if (ansiColor >= 16 && ansiColor <= 231) {
    const n = ansiColor - 16
    const r = Math.floor(n / 36)
    const g = Math.floor((n % 36) / 6)
    const b = n % 6
    
    const toHex = (c: number) => {
      const value = c === 0 ? 0 : 55 + c * 40
      return Math.min(255, value).toString(16).padStart(2, '0')
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  
  // Grayscale (232-255)
  if (ansiColor >= 232 && ansiColor <= 255) {
    const gray = Math.min(255, 8 + (ansiColor - 232) * 10)
    const hex = gray.toString(16).padStart(2, '0')
    return `#${hex}${hex}${hex}`
  }
  
  return '#ffffff' // fallback
}

function removeElement(index: number) {
  builderState.elements.splice(index, 1)
  if (selectedElement.value && !builderState.elements.find(el => el.id === selectedElement.value?.id)) {
    selectedElement.value = null
  }
}

function getElementPreview(element: PS1Element): string {
  switch (element.type) {
    case 'username': return 'user'
    case 'hostname_short': return 'hostname'
    case 'hostname_full': return 'hostname.domain.com'
    case 'working_directory': return '/home/user/project'
    case 'working_directory_basename': return 'project'
    case 'date': return new Date().toLocaleDateString()
    case 'time_24': return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    case 'time_12': return new Date().toLocaleTimeString('en-US', { hour12: true })
    case 'time_ampm': return new Date().toLocaleTimeString('en-US', { hour12: true })
    case 'newline': return '↵'
    case 'prompt_sign': return '$'
    case 'text': return element.customText || 'text'
    case 'symbol': return element.customText || '@'
    case 'git_branch': return 'main'
    case 'exit_status': return '0'
    case 'command_number': return '42'
    case 'history_number': return '1001'
    default: return element.customText || element.label.toLowerCase()
  }
}

function needsCustomText(element: PS1Element): boolean {
  return ['text', 'symbol', 'nerd_font_glyph', 'environment_variable', 'command'].includes(element.type)
}

function getCustomTextPlaceholder(element: PS1Element): string {
  switch (element.type) {
    case 'text': return 'Enter text...'
    case 'symbol': return 'Enter symbol...'
    case 'nerd_font_glyph': return 'Enter glyph...'
    case 'environment_variable': return 'VARIABLE_NAME'
    case 'command': return 'command_to_execute'
    default: return 'Enter value...'
  }
}

function updateElementStyle() {
  if (!selectedElement.value) return
  
  if (!selectedElement.value.style) {
    selectedElement.value.style = {}
  }
  
  Object.assign(selectedElement.value.style, elementStyle)
}

function updateForegroundColor() {
  if (!selectedElement.value) return
  
  if (!selectedElement.value.style) {
    selectedElement.value.style = {}
  }
  
  if (colorMode.value === 'hex') {
    selectedElement.value.style.foreground = {
      type: 'hex',
      value: foregroundColor.value
    }
  } else {
    // For ANSI mode, convert hex back to nearest ANSI color
    const ansiColor = hexToAnsi(foregroundColor.value)
    selectedElement.value.style.foreground = {
      type: 'ansi',
      value: ansiColor
    }
  }
}

function updateBackgroundColor() {
  if (!selectedElement.value) return
  
  if (!selectedElement.value.style) {
    selectedElement.value.style = {}
  }
  
  if (colorMode.value === 'hex') {
    selectedElement.value.style.background = {
      type: 'hex',
      value: backgroundColor.value
    }
  } else {
    // For ANSI mode, convert hex back to nearest ANSI color
    const ansiColor = hexToAnsi(backgroundColor.value)
    selectedElement.value.style.background = {
      type: 'ansi',
      value: ansiColor
    }
  }
}

function hexToAnsi(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Find closest ANSI color
  const ansiColors = [
    [0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0], [0, 0, 128], [128, 0, 128], [0, 128, 128], [192, 192, 192],
    [128, 128, 128], [255, 0, 0], [0, 255, 0], [255, 255, 0], [0, 0, 255], [255, 0, 255], [0, 255, 255], [255, 255, 255]
  ]
  
  let closestIndex = 0
  let closestDistance = Infinity
  
  ansiColors.forEach((color, index) => {
    const distance = Math.sqrt(
      Math.pow(r - color[0], 2) + 
      Math.pow(g - color[1], 2) + 
      Math.pow(b - color[2], 2)
    )
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })
  
  return closestIndex
}

function clearBackgroundColor() {
  if (!selectedElement.value?.style) return
  delete selectedElement.value.style.background
}

function updateColorMode() {
  if (selectedElement.value?.style?.foreground) {
    selectedElement.value.style.foreground.type = colorMode.value
  }
  if (selectedElement.value?.style?.background) {
    selectedElement.value.style.background.type = colorMode.value
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(generatedPS1.value).then(() => {
    alert('PS1 copied to clipboard!')
  }).catch(err => {
    console.error('Failed to copy to clipboard:', err)
  })
}

function importPS1() {
  if (!importExportText.value.trim()) return
  
  try {
    const imported = parsePS1(importExportText.value)
    // Clear existing elements first
    builderState.elements.length = 0
    // Clear selected element
    selectedElement.value = null
    // Add new elements
    builderState.elements.push(...imported.elements)
    importExportText.value = ''
    
    console.log('Successfully imported PS1 with', imported.elements.length, 'elements')
  } catch (error) {
    alert('Failed to parse PS1 string: ' + error)
    console.error('Import error:', error)
  }
}

function exportPS1() {
  importExportText.value = generatedPS1.value
}

function clearBuilder() {
  if (confirm('Are you sure you want to clear all elements?')) {
    builderState.elements = []
    selectedElement.value = null
  }
}

function insertSymbol(symbol: string) {
  if (!selectedElement.value) return
  
  const currentText = selectedElement.value.customText || ''
  selectedElement.value.customText = currentText + symbol
}
</script>
