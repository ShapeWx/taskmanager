<template>
  <div :class="['p-6 rounded border-l-2 shadow', color]">
    <div class="flex items-start justify-between">
      <div>
        <h4 class="font-bold text-lg text-gray-800">{{ title }}</h4>
        <p class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>
      <component :is="getIcon(icon)" class="w-8 h-8 text-emerald-600" />
    </div>
    <div class="mt-4">
      <div class="text-3xl font-bold text-emerald-700">{{ tasks }}</div>
      <p class="text-xs text-gray-600">tasks</p>
    </div>
  </div>
</template>

<script setup>
import * as HeroIcons from '@heroicons/vue/24/outline'

defineProps({
  title: String,
  subtitle: String,
  color: String,
  tasks: String,
  icon: String
})

const getIcon = (iconName) => {
  return HeroIcons[iconName]
}
</script>

<style scoped></style>


