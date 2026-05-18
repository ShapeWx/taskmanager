<template>
  <div :class="['rounded border p-4 shadow transition-all duration-200 hover:shadow-lg', 'border-gray-200 bg-white']">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themes/themeStore'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.activeTheme)
</script>

<style scoped></style>


