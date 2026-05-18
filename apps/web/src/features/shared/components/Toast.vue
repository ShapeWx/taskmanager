<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2.5 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-card-lg pointer-events-auto min-w-[17rem] max-w-xs backdrop-blur-sm"
          :class="toastClasses[toast.type]"
        >
          <!-- Icon container -->
          <div class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" :class="iconBg[toast.type]">
            <component :is="toastIcons[toast.type]" class="w-4 h-4" :class="iconColor[toast.type]" />
          </div>

          <p class="text-sm font-semibold flex-1 leading-snug">{{ toast.message }}</p>

          <button
            @click="dismiss(toast.id)"
            class="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity rounded-lg p-0.5 -mr-0.5"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'

const { toasts, dismiss } = useToast()

const toastClasses = {
  success: 'bg-white text-gray-900 border border-emerald-100',
  error:   'bg-white text-gray-900 border border-red-100',
  info:    'bg-white text-gray-900 border border-blue-100',
  warning: 'bg-white text-gray-900 border border-amber-100',
}

const iconBg = {
  success: 'bg-emerald-50',
  error:   'bg-red-50',
  info:    'bg-blue-50',
  warning: 'bg-amber-50',
}

const iconColor = {
  success: 'text-emerald-600',
  error:   'text-red-600',
  info:    'text-blue-600',
  warning: 'text-amber-500',
}

const toastIcons = {
  success: CheckCircleIcon,
  error:   ExclamationCircleIcon,
  info:    InformationCircleIcon,
  warning: ExclamationTriangleIcon,
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(1rem) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem) scale(0.95);
}
.toast-move {
  transition: transform 0.25s ease;
}
</style>
