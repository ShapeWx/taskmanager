<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        @click.self="$emit('cancel')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('cancel')" />

        <!-- Dialog -->
        <div class="relative bg-white rounded-2xl shadow-modal w-full max-w-sm overflow-hidden">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
                <p class="text-sm text-gray-500 mt-1 leading-relaxed">{{ message }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 px-6 pb-6">
            <button
              @click="$emit('cancel')"
              class="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              {{ cancelLabel }}
            </button>
            <button
              @click="$emit('confirm')"
              class="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors shadow-sm"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps({
  isOpen:       Boolean,
  title:        { type: String, default: 'Are you sure?' },
  message:      { type: String, default: 'This action cannot be undone.' },
  confirmLabel: { type: String, default: 'Delete' },
  cancelLabel:  { type: String, default: 'Cancel' },
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from .relative {
  transform: scale(0.93) translateY(8px);
}
.modal-leave-to .relative {
  transform: scale(0.97);
}
</style>
