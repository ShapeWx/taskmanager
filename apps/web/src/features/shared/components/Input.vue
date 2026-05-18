<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="[
      'w-full px-4 py-2 rounded border transition-all duration-200',
      'focus:outline-none',
      `border-${theme.colors.border}`,
      `focus:ring-2 focus:ring-${theme.colors.accent}`,
      `focus:border-${theme.colors.accent}`,
      `placeholder-${theme.colors.textLight}`,
      theme.tailwind.bg,
      theme.tailwind.text
    ]"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themes/themeStore'

defineProps({
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  modelValue: String
})

defineEmits(['update:modelValue'])

const themeStore = useThemeStore()
const theme = computed(() => themeStore.activeTheme)
</script>

<style scoped></style>


