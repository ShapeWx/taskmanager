<template>
  <div class="flex items-center space-x-2 text-xs">
    <button class="bg-lime-300 h-10 w-10 text-sm rounded-full font-semibold center">
      <component class="h-4 w-4 stroke-2" :is="Icons[props.icon]"></component>
    </button>
    <span>{{ props.label }}</span>
  </div>
</template>

<script setup>
import * as Icons from '@heroicons/vue/24/outline'

const props =  defineProps({
  label: [String, Number],
  icon: [String, Number],
})
</script>

<style>

</style>