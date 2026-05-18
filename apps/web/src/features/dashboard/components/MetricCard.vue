<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-card p-5 flex items-start gap-4 hover:shadow-card-md transition-shadow duration-200">
    <!-- Icon -->
    <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', iconBg]">
      <component :is="getIcon(icon)" :class="['w-5 h-5', iconColor]" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">{{ title }}</p>
      <p class="text-3xl font-bold text-gray-900 mt-0.5 tabular-nums">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as HeroIcons from '@heroicons/vue/24/outline'

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: String,
  textColor: String,
})

const palette = computed(() => {
  const map = {
    'bg-emerald-100': { bg: 'bg-emerald-100', icon: 'text-emerald-600' },
    'bg-red-100':     { bg: 'bg-red-100',     icon: 'text-red-600'     },
    'bg-green-100':   { bg: 'bg-green-100',   icon: 'text-green-600'   },
    'bg-blue-100':    { bg: 'bg-blue-100',     icon: 'text-blue-600'   },
    'bg-amber-100':   { bg: 'bg-amber-100',   icon: 'text-amber-600'   },
    'bg-purple-100':  { bg: 'bg-purple-100',  icon: 'text-purple-600'  },
  }
  return map[props.color] ?? { bg: 'bg-gray-100', icon: 'text-gray-600' }
})

const iconBg = computed(() => palette.value.bg)
const iconColor = computed(() => palette.value.icon)

const getIcon = (name) => HeroIcons[name]
</script>
