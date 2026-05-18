<template>
  <div class="flex items-start gap-3">
    <!-- User avatar -->
    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
      {{ initials }}
    </div>

    <!-- Text -->
    <div class="flex-1 min-w-0 pb-3 border-b border-gray-50 last:border-0">
      <p class="text-sm text-gray-700 leading-snug">
        <span class="font-semibold text-gray-900">{{ activity.user }}</span>
        {{ ' ' }}
        <span class="text-gray-500">{{ activity.action }}</span>
        {{ ' ' }}
        <span class="font-medium text-emerald-700">{{ activity.target }}</span>
      </p>
      <p class="text-xs text-gray-400 mt-0.5">{{ activity.time }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ activity: Object })

const initials = computed(() =>
  (props.activity.user ?? '')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
)
</script>
