<template>
  <div class="flex items-center justify-between p-3 rounded bg-gray-50">
    <span class="font-medium text-gray-800">{{ member.name }}</span>
    <div class="flex items-center space-x-2">
      <div :class="['w-3 h-3 rounded-full', member.statusColor]"></div>
      <span class="text-xs font-semibold text-gray-700">{{ member.status }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  member: Object
})
</script>

<style scoped></style>


