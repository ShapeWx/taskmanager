<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-semibold text-gray-700">{{ label }}</span>
      <span class="text-xs font-bold text-gray-600">{{ percentage }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div :class="[color, 'h-2 rounded-full']" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  percentage: String,
  color: String
})
</script>

<style scoped></style>


