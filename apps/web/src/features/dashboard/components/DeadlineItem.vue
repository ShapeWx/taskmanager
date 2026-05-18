<template>
  <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
    <!-- Urgency ring -->
    <div :class="['w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm tabular-nums', urgencyClasses]">
      {{ deadline.daysLeft }}
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-800 truncate">{{ deadline.title }}</p>
      <p class="text-xs text-gray-400 mt-0.5 truncate">{{ deadline.project }}</p>
    </div>

    <!-- Days label -->
    <span :class="['text-xs font-semibold flex-shrink-0', urgencyText]">
      {{ deadline.daysLeft === 0 ? 'Today' : deadline.daysLeft === 1 ? '1 day' : `${deadline.daysLeft}d` }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ deadline: Object })

const urgencyClasses = computed(() => {
  if (props.deadline.daysLeft <= 1) return 'bg-red-100 text-red-700 ring-2 ring-red-200'
  if (props.deadline.daysLeft <= 3) return 'bg-amber-100 text-amber-700 ring-2 ring-amber-200'
  return 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200'
})

const urgencyText = computed(() => {
  if (props.deadline.daysLeft <= 1) return 'text-red-600'
  if (props.deadline.daysLeft <= 3) return 'text-amber-600'
  return 'text-emerald-600'
})
</script>
