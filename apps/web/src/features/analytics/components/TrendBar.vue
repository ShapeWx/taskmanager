<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700">{{ day }}</span>
      <span class="text-xs font-bold text-gray-600">{{ percentage }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div class="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  day: String,
  percentage: String
})
</script>

<style scoped></style>


