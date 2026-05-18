<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
      'transition-all duration-150 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantClasses,
      sizeClasses,
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <component v-if="icon" :is="getIcon(icon)" :class="iconSizeClasses" />
    <span v-if="label">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themes/themeStore'
import * as HeroIcons from '@heroicons/vue/24/outline'

const props = defineProps({
  label: String,
  icon: String,
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: Boolean,
})

defineEmits(['click'])

const themeStore = useThemeStore()
const theme = computed(() => themeStore.activeTheme)

const variantClasses = computed(() => ({
  primary: `${theme.value.tailwind.primary} text-white shadow-sm hover:shadow-md focus:ring-emerald-500`,
  secondary: 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300',
  accent: `${theme.value.tailwind.accent} text-white shadow-sm hover:shadow-md focus:ring-emerald-400`,
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md focus:ring-red-500',
}[props.variant] ?? `${theme.value.tailwind.primary} text-white shadow-sm focus:ring-emerald-500`))

const sizeClasses = computed(() => ({
  xs: 'text-xs px-2.5 py-1.5',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-sm px-4 py-2.5',
  xl: 'text-base px-5 py-3',
}[props.size] ?? 'text-sm px-4 py-2'))

const iconSizeClasses = computed(() => ({
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
}[props.size] ?? 'w-4 h-4'))

const getIcon = (name) => HeroIcons[name]
</script>
