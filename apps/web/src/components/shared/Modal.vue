<template>
  <!-- <div class="fixed inset-0 flex items-center justify-center">
    <button
      type="button"
      @click="openModal"
      class="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Open dialog
    </button>
  </div> -->
  <TransitionRoot appear :show="isOpenSideModal" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-500"
            enter-from="-translate-x-full" 
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-500" 
            leave-from="translate-x-full"
            leave-to="-translate-x-full"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden absolute left-0 inset-y-0 bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="div"
                class="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
              >
                <slot name="heading"></slot>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border shadow-md bg-lime-100 px-2 py-2 text-sm font-medium text-lime-900 hover:bg-lime-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                <XMarkIcon class="h-6"/>
                </button>
              </DialogTitle>
              <div class="mt-2">
                <slot name="form"></slot>
              </div>

              <div class="mt-4">
                <slot name="footer"></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)

const isOpenSideModal = inject('isOpenSideModal')

function closeModal() {
  isOpenSideModal.value = false
}
function openModal() {
  isOpen.value = true
}

onMounted(() => {
  console.log(isOpenSideModal.value)
})
</script>
