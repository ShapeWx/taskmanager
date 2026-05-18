<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Backlog</h1>
        <p class="text-sm text-gray-500 mt-1">{{ filteredTasks.length }} task{{ filteredTasks.length !== 1 ? 's' : '' }} found</p>
      </div>
      <Button label="Add Task" icon="PlusIcon" variant="primary" @click="showAddModal = true" />
    </div>

    <!-- Filter & Sort Bar -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-card p-4 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-48">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          v-model="localSearch"
          placeholder="Search tasks..."
          class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <select
        v-model="sortBy"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      >
        <option value="createdAt">Sort: Date Added</option>
        <option value="priority">Sort: Priority</option>
        <option value="dueDate">Sort: Due Date</option>
        <option value="title">Sort: Title</option>
      </select>

      <select
        v-model="filterStatus"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      >
        <option value="all">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="doing">In Progress</option>
        <option value="done">Done</option>
        <option value="backlog">Backlog</option>
      </select>

      <select
        v-model="filterPriority"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-sm text-red-600 hover:text-red-700 font-medium transition-colors px-2"
      >
        Clear filters
      </button>
    </div>

    <!-- Task List -->
    <div v-if="filteredTasks.length" class="space-y-2">
      <BacklogItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @delete="promptDelete(task)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-gray-100 shadow-card p-12 text-center">
      <p class="text-gray-500 font-medium">No tasks match your filters.</p>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="mt-3 text-sm text-emerald-700 hover:underline"
      >
        Clear filters
      </button>
    </div>

    <!-- Add Task Modal -->
    <Transition name="modal">
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showAddModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold text-gray-900 mb-5">Add Task to Backlog</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
              <input
                v-model="newTask.title"
                type="text"
                placeholder="What needs to be done?"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                @keydown.enter="createTask"
                @keydown.esc="showAddModal = false"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                v-model="newTask.description"
                placeholder="Add some details..."
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                <select v-model="newTask.priority" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                <input
                  v-model="newTask.dueDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Assignees</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="member in taskStore.teamMembers"
                  :key="member.id"
                  type="button"
                  @click="toggleAssignee(member.name)"
                  :class="[
                    'flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                    newTask.assignees.includes(member.name)
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-300'
                  ]"
                >
                  <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">{{ member.initials[0] }}</span>
                  <span>{{ member.name.split(' ')[0] }}</span>
                </button>
              </div>
            </div>
            <p v-if="formError" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ formError }}</p>
            <div class="flex space-x-3 pt-1">
              <button @click="createTask" class="flex-1 px-4 py-2.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors">
                Create Task
              </button>
              <button @click="showAddModal = false" class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirm -->
    <ConfirmModal
      :is-open="!!taskToDelete"
      title="Delete task?"
      :message="`'${taskToDelete?.title}' will be permanently removed.`"
      @confirm="confirmDelete"
      @cancel="taskToDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useSearch } from '@/composables/useSearch'
import { useToast } from '@/composables/useToast'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import Button from '@/features/shared/components/Button.vue'
import ConfirmModal from '@/features/shared/components/ConfirmModal.vue'
import BacklogItem from '../components/BacklogItem.vue'

const taskStore = useTaskStore()
const { searchQuery } = useSearch()
const toast = useToast()

const localSearch = ref(searchQuery.value)
const sortBy = ref('createdAt')
const filterStatus = ref('all')
const filterPriority = ref('all')
const showAddModal = ref(false)
const taskToDelete = ref(null)
const formError = ref('')

const newTask = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'backlog',
  dueDate: '',
  assignees: [],
  tags: []
})

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

const filteredTasks = computed(() => {
  const q = localSearch.value.toLowerCase().trim()
  let result = taskStore.tasks.filter(t => {
    const matchesSearch = !q
      || t.title.toLowerCase().includes(q)
      || t.description?.toLowerCase().includes(q)
      || t.assignees?.some(a => a.toLowerCase().includes(q))
      || t.tags?.some(tag => tag.toLowerCase().includes(q))
    const matchesStatus = filterStatus.value === 'all' || t.status === filterStatus.value
    const matchesPriority = filterPriority.value === 'all' || t.priority === filterPriority.value
    return matchesSearch && matchesStatus && matchesPriority
  })

  result = [...result].sort((a, b) => {
    if (sortBy.value === 'priority') return (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2)
    if (sortBy.value === 'dueDate') return (a.dueDate ?? '').localeCompare(b.dueDate ?? '')
    if (sortBy.value === 'title') return a.title.localeCompare(b.title)
    return (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
  })

  return result
})

const hasActiveFilters = computed(() =>
  localSearch.value || filterStatus.value !== 'all' || filterPriority.value !== 'all'
)

const clearFilters = () => {
  localSearch.value = ''
  filterStatus.value = 'all'
  filterPriority.value = 'all'
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
  taskStore.addTask({ ...newTask, assignees: [...newTask.assignees] })
  toast.success(`"${newTask.title}" added to backlog`)
  Object.assign(newTask, { title: '', description: '', priority: 'medium', status: 'backlog', dueDate: '', assignees: [], tags: [] })
  formError.value = ''
  showAddModal.value = false
}

const promptDelete = (task) => { taskToDelete.value = task }

const confirmDelete = () => {
  if (taskToDelete.value) {
    taskStore.deleteTask(taskToDelete.value.id)
    toast.success('Task deleted')
    taskToDelete.value = null
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
