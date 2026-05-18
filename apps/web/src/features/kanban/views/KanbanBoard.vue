<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Kanban Board</h1>
        <p class="text-sm text-gray-500 mt-1">{{ taskStore.tasks.length }} tasks across {{ taskStore.sortedCategories.length }} columns</p>
      </div>
      <div class="flex space-x-2">
        <Button label="Add Column" icon="PlusIcon" variant="primary" @click="showAddCategoryModal = true" />
        <Button
          label="Swimlanes"
          icon="ViewColumnsIcon"
          variant="secondary"
          @click="viewMode = 'swimlane'"
          :disabled="viewMode === 'swimlane'"
        />
        <Button
          label="Board"
          icon="WindowIcon"
          variant="secondary"
          @click="viewMode = 'board'"
          :disabled="viewMode === 'board'"
        />
      </div>
    </div>

    <!-- Board View -->
    <div v-if="viewMode === 'board'">
      <div
        class="grid gap-5 overflow-x-auto pb-4"
        :style="{ gridTemplateColumns: `repeat(${taskStore.sortedCategories.length}, minmax(300px, 1fr))` }"
      >
        <div
          v-for="column in taskStore.sortedCategories"
          :key="column.id"
          @dragover.prevent="dragOverColumn = column.id"
          @dragleave="dragOverColumn = null"
          @drop.prevent="dropTask($event, column.id)"
          :class="[
            'bg-white rounded-xl p-4 border border-gray-100 shadow-card border-t-4 transition-all duration-150',
            dragOverColumn === column.id
              ? 'ring-2 ring-emerald-400 shadow-card-md border-t-emerald-500'
              : 'border-t-emerald-500'
          ]"
        >
          <!-- Column header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-sm text-gray-900">{{ column.name }}</h3>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {{ getTasksByStatus(column.id).length }}
              </span>
              <button
                v-if="authStore.hasPermission('manage_categories')"
                @click="promptDeleteCategory(column.id)"
                class="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete column"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Task cards -->
          <div class="space-y-3 min-h-64">
            <div
              v-for="task in getTasksByStatus(column.id)"
              :key="task.id"
              draggable="true"
              @dragstart="draggedTask = task"
              @dragend="draggedTask = null"
              :class="[
                'p-3 rounded-lg border-l-4 hover:shadow-md transition-all cursor-move group',
                draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100',
                priorityBorderColor(task.priority)
              ]"
              style="background: linear-gradient(135deg, #fff 0%, #f0fdf4 100%)"
            >
              <div class="flex justify-between items-start gap-2">
                <p class="font-semibold text-sm text-gray-800 flex-1 leading-snug">{{ task.title }}</p>
                <button
                  v-if="authStore.hasPermission('delete_task')"
                  @click="promptDeleteTask(task)"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>

              <p v-if="task.description" class="text-xs text-gray-500 mt-1.5 line-clamp-2">{{ task.description }}</p>

              <div class="flex items-center justify-between mt-3 flex-wrap gap-1">
                <div class="flex gap-1 flex-wrap">
                  <span
                    v-for="tag in task.tags?.slice(0, 2)"
                    :key="tag"
                    class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', priorityBadge(task.priority)]">
                  {{ task.priority?.toUpperCase() }}
                </span>
              </div>

              <div class="flex items-center justify-between mt-2.5">
                <div v-if="task.assignees?.length" class="flex -space-x-1.5">
                  <div
                    v-for="assignee in task.assignees.slice(0, 3)"
                    :key="assignee"
                    class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white text-xs text-white flex items-center justify-center font-bold"
                    :title="assignee"
                  >
                    {{ assignee[0] }}
                  </div>
                  <div
                    v-if="task.assignees.length > 3"
                    class="w-6 h-6 rounded-full bg-gray-400 border-2 border-white text-xs text-white flex items-center justify-center font-bold"
                  >
                    +{{ task.assignees.length - 3 }}
                  </div>
                </div>
                <span
                  v-if="task.dueDate"
                  :class="['text-xs ml-auto', isOverdue(task) ? 'text-red-500 font-semibold' : 'text-gray-400']"
                >
                  {{ formatDate(task.dueDate) }}
                </span>
              </div>
            </div>

            <!-- Add task button -->
            <button
              @click="openAddTask(column.id)"
              class="w-full py-2.5 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-all text-sm font-medium"
            >
              + Add task
            </button>
          </div>
        </div>
      </div>

      <!-- Stats + History -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-2">
        <div class="bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-3">Statistics</h3>
          <div class="space-y-2.5">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Tasks</span>
              <span class="font-bold text-emerald-700">{{ taskStore.tasks.length }}</span>
            </div>
            <div v-for="cat in taskStore.sortedCategories" :key="cat.id" class="flex justify-between items-center">
              <span class="text-sm text-gray-600">{{ cat.name }}</span>
              <span class="font-semibold text-gray-700">{{ getTasksByStatus(cat.id).length }}</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 bg-white rounded-lg p-5 shadow border border-gray-200">
          <h3 class="text-sm font-bold text-gray-900 mb-3">Recent Changes</h3>
          <div class="space-y-2 max-h-52 overflow-y-auto">
            <p v-if="!taskStore.getTaskHistory().length" class="text-sm text-gray-400 py-2">
              Drag tasks between columns to see changes here.
            </p>
            <div
              v-for="history in taskStore.getTaskHistory().slice(0, 10)"
              :key="history.id"
              class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg text-sm"
            >
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-800 truncate">{{ history.taskTitle }}</p>
                <p class="text-xs text-gray-500">
                  <span class="font-medium">{{ formatCategoryName(history.from) }}</span>
                  → <span class="font-medium">{{ formatCategoryName(history.to) }}</span>
                </p>
              </div>
              <span class="text-xs text-gray-400 flex-shrink-0">{{ formatTime(history.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Swimlane View -->
    <div v-else-if="viewMode === 'swimlane'">
      <SwimlaneBoardView
        :tasks="taskStore.tasks"
        :categories="taskStore.sortedCategories"
        @drop-task="dropTask"
      />
    </div>

    <!-- Add Column Modal -->
    <Transition name="modal">
      <div
        v-if="showAddCategoryModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showAddCategoryModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Add Column</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Column Name</label>
              <input
                v-model="newCategoryName"
                type="text"
                placeholder="e.g., Review, Testing"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                @keydown.enter="createCategory"
                @keydown.esc="showAddCategoryModal = false"
              />
            </div>
            <div class="flex space-x-3">
              <button @click="createCategory" class="flex-1 px-4 py-2.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors">
                Create
              </button>
              <button @click="showAddCategoryModal = false" class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Add Task Modal -->
    <Transition name="modal">
      <div
        v-if="showAddTaskModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showAddTaskModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold text-gray-900 mb-5">Add Task</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
              <input
                v-model="newTask.title"
                type="text"
                placeholder="Task name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                @keydown.enter="createTask"
                @keydown.esc="showAddTaskModal = false"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                v-model="newTask.description"
                placeholder="Task details..."
                rows="2"
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
            <p v-if="taskFormError" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ taskFormError }}</p>
            <div class="flex space-x-3 pt-1">
              <button @click="createTask" class="flex-1 px-4 py-2.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors">
                Create Task
              </button>
              <button @click="showAddTaskModal = false" class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirm delete task -->
    <ConfirmModal
      :is-open="!!taskToDelete"
      title="Delete task?"
      :message="`'${taskToDelete?.title}' will be permanently removed.`"
      @confirm="confirmDeleteTask"
      @cancel="taskToDelete = null"
    />

    <!-- Confirm delete category -->
    <ConfirmModal
      :is-open="!!categoryToDelete"
      title="Delete column?"
      message="The column will be removed. Move all tasks out first or they will remain without a column."
      confirm-label="Delete Column"
      @confirm="confirmDeleteCategory"
      @cancel="categoryToDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Button from '@/features/shared/components/Button.vue'
import ConfirmModal from '@/features/shared/components/ConfirmModal.vue'
import SwimlaneBoardView from '../components/SwimlaneBoardView.vue'

const taskStore = useTaskStore()
const authStore = useAuthStore()
const toast = useToast()

const viewMode = ref('board')
const draggedTask = ref(null)
const dragOverColumn = ref(null)
const showAddCategoryModal = ref(false)
const showAddTaskModal = ref(false)
const newCategoryName = ref('')
const newTaskStatus = ref('todo')
const taskFormError = ref('')
const taskToDelete = ref(null)
const categoryToDelete = ref(null)

const newTask = reactive({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  assignees: [],
  tags: []
})

const getTasksByStatus = (status) => taskStore.getTasksByStatus(status)

const today = new Date().toISOString().split('T')[0]
const isOverdue = (task) => task.status !== 'done' && task.dueDate && task.dueDate < today

const dropTask = (event, targetStatus) => {
  if (draggedTask.value && draggedTask.value.status !== targetStatus) {
    taskStore.updateTaskStatus(draggedTask.value.id, targetStatus)
    toast.info(`"${draggedTask.value.title}" moved to ${formatCategoryName(targetStatus)}`)
  }
  draggedTask.value = null
  dragOverColumn.value = null
}

const priorityBorderColor = (priority) => ({
  high: 'border-l-red-400',
  medium: 'border-l-yellow-400',
  low: 'border-l-blue-400'
}[priority] ?? 'border-l-gray-300')

const priorityBadge = (priority) => ({
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700'
}[priority] ?? 'bg-gray-100 text-gray-700')

const formatDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const formatTime = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const formatCategoryName = (categoryId) =>
  taskStore.categories.find(c => c.id === categoryId)?.name ?? categoryId

const createCategory = () => {
  if (!newCategoryName.value.trim()) return
  taskStore.addCategory({ name: newCategoryName.value.trim(), color: 'bg-indigo-100', textColor: 'text-indigo-700' })
  toast.success(`Column "${newCategoryName.value}" created`)
  newCategoryName.value = ''
  showAddCategoryModal.value = false
}

const promptDeleteCategory = (categoryId) => {
  if (getTasksByStatus(categoryId).length > 0) {
    toast.warning('Move all tasks out of this column before deleting it.')
    return
  }
  categoryToDelete.value = categoryId
}

const confirmDeleteCategory = () => {
  if (categoryToDelete.value) {
    taskStore.deleteCategory(categoryToDelete.value)
    toast.success('Column deleted')
    categoryToDelete.value = null
  }
}

const openAddTask = (status) => {
  newTaskStatus.value = status
  taskFormError.value = ''
  Object.assign(newTask, { title: '', description: '', priority: 'medium', dueDate: '', assignees: [], tags: [] })
  showAddTaskModal.value = true
}

const toggleAssignee = (name) => {
  const idx = newTask.assignees.indexOf(name)
  if (idx > -1) newTask.assignees.splice(idx, 1)
  else newTask.assignees.push(name)
}

const createTask = () => {
  if (!newTask.title.trim()) {
    taskFormError.value = 'Task title is required.'
    return
  }
  taskStore.addTask({ ...newTask, assignees: [...newTask.assignees], status: newTaskStatus.value })
  toast.success(`"${newTask.title}" created`)
  showAddTaskModal.value = false
}

const promptDeleteTask = (task) => { taskToDelete.value = task }

const confirmDeleteTask = () => {
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
