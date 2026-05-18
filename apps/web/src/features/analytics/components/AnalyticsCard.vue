<template>
  <div class="bg-gradient-to-br from-emerald-50 to-white rounded p-6 shadow border border-emerald-200 hover:shadow-md transition-all">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-600 font-medium">{{ title }}</p>
        <p class="text-3xl font-bold text-emerald-700 mt-2">{{ value }}</p>
        <p class="text-xs text-gray-500 mt-2">{{ change }}</p>
      </div>
      <component :is="getIcon(icon)" :class="['w-8 h-8', color]" />
    </div>
  </div>
</template>

<script setup>
import * as HeroIcons from '@heroicons/vue/24/outline'

defineProps({
  title: String,
  value: String,
  change: String,
  icon: String,
  color: String
})

const getIcon = (iconName) => {
  return HeroIcons[iconName]
}
</script>

<style scoped></style>


