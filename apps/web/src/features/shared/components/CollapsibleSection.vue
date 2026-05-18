<template>
  <div>
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-semibold text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors"
    >
      {{ title }}
      <ChevronDownIcon :class="['w-3 h-3 transition-transform duration-200', isOpen ? 'rotate-180' : '']" />
    </button>

    <Transition name="expand">
      <div v-if="isOpen" class="mt-0.5 space-y-0.5 pl-2">
        <button
          v-for="item in items"
          :key="item.id"
          class="w-full text-left px-2 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <span
            v-if="item.color"
            :class="['w-2 h-2 rounded-full flex-shrink-0', item.color]"
          />
          <span class="truncate">{{ item.name }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: String,
  items: Array,
})

const isOpen = ref(false)
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
