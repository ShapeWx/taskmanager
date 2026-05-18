<template>
  <div class="flex flex-col items-center gap-1.5">
    <!-- Hours label -->
    <span class="text-xs font-medium text-gray-400 tabular-nums h-4">
      {{ hours > 0 ? `${hours}h` : '' }}
    </span>

    <!-- Bar container — fixed height, bar grows from bottom -->
    <div class="flex-1 w-full flex items-end rounded-t-sm overflow-hidden" style="height: 80px;">
      <div
        :class="[
          'w-full rounded-t-md transition-all duration-700 ease-out',
          isToday ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-gradient-to-t from-emerald-300 to-emerald-200'
        ]"
        :style="{ height: barHeightPct + '%', minHeight: hours > 0 ? '4px' : '0' }"
      />
    </div>

    <!-- Day label -->
    <span :class="['text-xs font-semibold', isToday ? 'text-emerald-600' : 'text-gray-500']">
      {{ day }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  day: String,
  hours: Number,
  maxHours: { type: Number, default: 10 },
  isToday: { type: Boolean, default: false },
})

const barHeightPct = computed(() =>
  props.maxHours > 0 ? Math.min((props.hours / props.maxHours) * 100, 100) : 0
)
</script>
