<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-card p-5 flex flex-col gap-1">
    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">{{ title }}</p>
    <div class="flex items-baseline gap-1.5 mt-1">
      <span class="text-3xl font-bold text-gray-900 tabular-nums">{{ hours }}</span>
      <span class="text-sm font-medium text-gray-400">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  hours: [Number, String],
  unit: String,
})
</script>
