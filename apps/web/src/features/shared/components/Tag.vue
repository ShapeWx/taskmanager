<template>
  <div :class="['px-3 py-1 rounded-full text-sm font-semibold', colorClasses]">
    {{ label }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themes/themeStore'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary' // primary, success, warning, error, info
  }
})

const themeStore = useThemeStore()
const theme = computed(() => themeStore.activeTheme)

const colorClasses = computed(() => {
  const colors = {
    primary: 'bg-emerald-100 text-emerald-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  }
  return colors[props.color] || colors.primary
})
</script>

<style scoped></style>


