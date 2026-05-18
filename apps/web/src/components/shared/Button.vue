<template>
  <button
    :class="`${props.color} ${sizes[props.size]} ${props.textColor} rounded font-semibold flex items-center space-x-2 shadow`">
    <component class="h-5 w-5 stroke-2" :is="Icons[props.icon]"></component>
    <span>{{ props.label }}</span>
    <component class="h-4 w-4 stroke-2" :is="Icons['ChevronDownIcon']" v-if="dropDown"></component>
  </button>
</template>

<script setup>
import * as Icons from '@heroicons/vue/24/outline'

const sizes = {
  sm: 'px-1 py-2 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-5 py-3 text-sm',
  xl: 'px-10 py-4 text-base',
}

const props = defineProps({
  label: [String, Number],
  icon: [String, Number],
  size: [String, Number],
  color: [String, Number],
  textColor: [String, Number],
  dropDown: [Boolean],
})
</script>

<style></style>