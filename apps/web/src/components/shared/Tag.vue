<template>
  <div class="bg-lime-300 text-lime-700 w-auto text-xs px-4 py-2 rounded-full font-semibold">
    <span>{{ props.label }}</span>
  </div>
</template>

<script setup>

const props =  defineProps({
  label: [String, Number],
  icon: [String, Number],
})
</script>

<style>

</style>