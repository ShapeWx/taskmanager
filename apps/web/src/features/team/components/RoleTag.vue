<template>
  <div :class="['px-4 py-2 rounded-full text-xs font-bold', role.color]">
    <span>{{ role.name }} ({{ role.count }})</span>
  </div>
</template>

<script setup>
defineProps({
  role: Object
})
</script>

<style scoped></style>


