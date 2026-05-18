<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', project.color]" />
        <span class="text-sm font-medium text-gray-700">{{ project.name }}</span>
      </div>
      <span class="text-xs font-bold text-gray-500 tabular-nums">{{ project.completion }}%</span>
    </div>
    <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        :class="['h-2 rounded-full transition-all duration-700', barColor]"
        :style="{ width: project.completion + '%' }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ project: Object })

const barColor = computed(() => {
  const map = {
    'bg-emerald-500': 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    'bg-rose-500':    'bg-gradient-to-r from-rose-400 to-rose-600',
    'bg-blue-500':    'bg-gradient-to-r from-blue-400 to-blue-600',
    'bg-yellow-500':  'bg-gradient-to-r from-yellow-400 to-yellow-500',
  }
  return map[props.project.color] ?? 'bg-gradient-to-r from-gray-400 to-gray-500'
})
</script>
