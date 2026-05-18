<template>
  <div class="h-screen w-screen flex overflow-hidden bg-gray-50/80">
    <SideBar
      ref="sidebarRef"
      @add-task="openAddTaskModal"
      @toggle-sidebar="onToggleSidebar"
    />

    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <TopBar @toggle-sidebar="toggleSidebar" />
      <div class="flex-1 overflow-auto">
        <div class="p-6 max-w-screen-2xl mx-auto">
          <RouterView />
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showAddTaskModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal" />

        <!-- Sheet -->
        <div class="relative bg-white rounded-2xl shadow-modal w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-up">
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 class="text-base font-bold text-gray-900">New Task</h2>
            <button
              @click="closeModal"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>

          <div class="px-6 py-5 space-y-5">
            <!-- Title -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Title <span class="text-red-500 normal-case">*</span>
              </label>
              <input
                v-model="newTask.title"
                type="text"
                placeholder="What needs to be done?"
                class="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 focus:bg-white transition-all"
                @keydown.enter="createTask"
                @keydown.esc="closeModal"
                autofocus
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                v-model="newTask.description"
                placeholder="Add some context…"
                rows="3"
                class="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 focus:bg-white transition-all resize-none"
              />
            </div>

            <!-- Priority + Status -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Priority</label>
                <select
                  v-model="newTask.priority"
                  class="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all appearance-none"
                >
                  <option value="low">🟦 Low</option>
                  <option value="medium">🟨 Medium</option>
                  <option value="high">🟥 High</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <select
                  v-model="newTask.status"
                  class="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all appearance-none"
                >
                  <option v-for="cat in taskStore.sortedCategories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Due Date</label>
              <input
                v-model="newTask.dueDate"
                type="date"
                :min="todayStr"
                class="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              />
            </div>

            <!-- Assignees -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Assignees</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="member in taskStore.teamMembers"
                  :key="member.id"
                  type="button"
                  @click="toggleAssignee(member.name)"
                  :class="[
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all',
                    newTask.assignees.includes(member.name)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                  ]"
                >
                  <span class="w-5 h-5 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                    {{ member.initials }}
                  </span>
                  {{ member.name.split(' ')[0] }}
                </button>
              </div>
            </div>

            <!-- Error -->
            <div v-if="formError" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              {{ formError }}
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-1">
              <button
                @click="createTask"
                class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Create Task
              </button>
              <button
                @click="closeModal"
                class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/themes/themeStore'
import { useTaskStore } from '@/stores/taskStore'
import { useToast } from '@/composables/useToast'
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import SideBar from '@/features/shared/components/SideBar.vue'
import TopBar from '@/features/shared/components/TopBar.vue'
import Toast from '@/features/shared/components/Toast.vue'

const themeStore = useThemeStore()
const taskStore = useTaskStore()
const toast = useToast()

const sidebarRef = ref(null)
const showAddTaskModal = ref(false)
const formError = ref('')

const todayStr = computed(() => new Date().toISOString().split('T')[0])

const newTask = reactive({
  title: '', description: '', priority: 'medium',
  status: 'todo', dueDate: '', assignees: [], tags: [],
})

onMounted(() => themeStore.initializeTheme())

const toggleSidebar = () => sidebarRef.value?.toggleSidebar()
const onToggleSidebar = () => {}

const openAddTaskModal = () => {
  formError.value = ''
  showAddTaskModal.value = true
}

const closeModal = () => {
  showAddTaskModal.value = false
  formError.value = ''
  Object.assign(newTask, {
    title: '', description: '', priority: 'medium',
    status: 'todo', dueDate: '', assignees: [], tags: [],
  })
}

const toggleAssignee = (name) => {
  const idx = newTask.assignees.indexOf(name)
  if (idx > -1) newTask.assignees.splice(idx, 1)
  else newTask.assignees.push(name)
}

const createTask = () => {
  if (!newTask.title.trim()) {
    formError.value = 'Task title is required.'
    return
  }
  taskStore.addTask({ ...newTask, assignees: [...newTask.assignees], tags: [...newTask.tags] })
  toast.success(`"${newTask.title}" added`)
  closeModal()
}
</script>

<style scoped>
.modal-fade-enter-active {
  transition: opacity 0.2s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
