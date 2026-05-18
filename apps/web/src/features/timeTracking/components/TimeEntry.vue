<template>
  <div class="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <!-- Task color dot -->
    <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
      <ClockIcon class="w-4 h-4 text-emerald-600" />
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-800 truncate">{{ entry.task }}</p>
      <p class="text-xs text-gray-400 mt-0.5 truncate">{{ entry.project }}</p>
    </div>

    <!-- Duration -->
    <span class="text-sm font-bold text-emerald-700 tabular-nums flex-shrink-0">{{ entry.duration }}</span>
  </div>
</template>

<script setup>
import { ClockIcon } from '@heroicons/vue/24/outline'
defineProps({ entry: Object })
</script>
