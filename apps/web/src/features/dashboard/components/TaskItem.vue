<template>
  <div
    class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group cursor-default"
  >
    <!-- Priority dot -->
    <span :class="['w-2 h-2 rounded-full flex-shrink-0', priorityDot]" />

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-800 truncate">{{ task.title }}</p>
      <p v-if="task.dueDate" :class="['text-xs mt-0.5', isOverdue ? 'text-red-500 font-medium' : 'text-gray-400']">
        {{ isOverdue ? 'Overdue · ' : 'Due ' }}{{ formatDate(task.dueDate) }}
      </p>
    </div>

    <!-- Status badge -->
    <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0', statusBadge]">
      {{ statusLabel }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ task: Object })

const today = new Date().toISOString().split('T')[0]
const isOverdue = computed(() =>
  props.task.status !== 'done' && props.task.dueDate && props.task.dueDate < today
)

const priorityDot = computed(() => ({
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-blue-400',
}[props.task.priority] ?? 'bg-gray-300'))

const statusBadge = computed(() => ({
  todo:    'bg-gray-100 text-gray-600',
  doing:   'bg-amber-100 text-amber-700',
  done:    'bg-emerald-100 text-emerald-700',
  backlog: 'bg-slate-100 text-slate-600',
}[props.task.status] ?? 'bg-gray-100 text-gray-600'))

const statusLabel = computed(() => ({
  todo: 'To Do', doing: 'In Progress', done: 'Done', backlog: 'Backlog',
}[props.task.status] ?? props.task.status))

const formatDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>
