<template>
  <button
    @click="$emit('click')"
    :class="[
      'w-full flex items-center rounded-lg transition-all duration-150 group',
      collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
      active
        ? 'bg-white/10 text-white'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    ]"
    :title="collapsed ? label : undefined"
  >
    <!-- Active indicator bar -->
    <span
      v-if="!collapsed"
      :class="[
        'absolute left-0 w-0.5 h-5 rounded-full transition-all duration-150',
        active ? 'bg-emerald-400' : 'bg-transparent'
      ]"
    />

    <component
      :is="getIcon(icon)"
      :class="[
        'flex-shrink-0 transition-colors duration-150',
        collapsed ? 'w-5 h-5' : 'w-4.5 h-4.5',
        active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
      ]"
      style="width:18px;height:18px;"
    />

    <span
      v-if="!collapsed"
      :class="[
        'text-sm font-medium tracking-[-0.01em] transition-colors duration-150',
        active ? 'text-white' : ''
      ]"
    >
      {{ label }}
    </span>
  </button>
</template>

<script setup>
import * as HeroIcons from '@heroicons/vue/24/outline'

defineProps({
  label: String,
  icon: String,
  active: Boolean,
  collapsed: Boolean,
})

defineEmits(['click'])

const getIcon = (name) => HeroIcons[name]
</script>
