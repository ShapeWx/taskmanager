<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700">{{ name }}</span>
      <span class="text-xs font-bold text-gray-600">{{ tasks }}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div class="bg-gradient-to-r from-blue-400 to-emerald-500 h-2 rounded-full" :style="{ width: (tasks / 25) * 100 + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  tasks: Number
})
</script>

<style scoped></style>


