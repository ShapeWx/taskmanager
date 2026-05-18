<template>
  <div class="text-center">
    <div class="bg-gradient-to-t from-emerald-500 to-emerald-300 rounded p-2 flex items-end justify-center" :style="{ height: Math.max((remaining / 100) * 200, 10) + 'px' }"></div>
    <p class="text-xs font-semibold text-gray-700 mt-2">{{ day }}</p>
    <p class="text-xs text-gray-600">{{ remaining }} pts</p>
  </div>
</template>

<script setup>
defineProps({
  day: String,
  remaining: Number
})
</script>

<style scoped></style>


