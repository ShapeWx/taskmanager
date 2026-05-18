<template>
  <div class="flex items-center justify-between p-3 bg-emerald-50 rounded">
    <span class="font-medium text-gray-800">{{ member.name }}</span>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <span class="text-xs text-gray-600">Tasks:</span>
        <span class="font-bold text-emerald-700">{{ member.tasksCompleted }}</span>
      </div>
      <div class="w-24 bg-gray-200 rounded-full h-2">
        <div class="bg-emerald-500 h-2 rounded-full" :style="{ width: member.efficiency + '%' }"></div>
      </div>
      <span class="text-xs font-bold text-gray-700">{{ member.efficiency }}%</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  member: Object
})
</script>

<style scoped></style>


