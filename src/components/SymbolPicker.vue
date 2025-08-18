<template>
  <div class="mt-4">
    <h4 class="text-sm font-medium text-gray-700 mb-3">Common Symbols</h4>
    <div class="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto custom-scrollbar">
      <button
        v-for="symbol in symbols"
        :key="symbol"
        class="btn btn-xs btn-outline hover:btn-primary w-8 h-8 p-0 min-h-0"
        @click="$emit('select', symbol)"
        :title="`Insert ${symbol}`"
      >
        {{ symbol }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { COMMON_SYMBOLS } from '@/types/ps1'

defineEmits<{
  select: [symbol: string]
}>()

const symbols = COMMON_SYMBOLS
</script>
