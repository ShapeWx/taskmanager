<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Welcome back, <span class="font-semibold text-gray-700">{{ firstName }}</span>. Here's what's happening today.</p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="Active Tasks"    :value="metrics.activeTasks"    icon="CheckCircleIcon"    color="bg-emerald-100" textColor="text-emerald-700" />
      <MetricCard title="Overdue"         :value="metrics.overdueTasks"   icon="ExclamationCircleIcon" color="bg-red-100"  textColor="text-red-700" />
      <MetricCard title="Completed Today" :value="metrics.completedToday" icon="CheckBadgeIcon"     color="bg-green-100"  textColor="text-green-700" />
      <MetricCard title="Team Members"    :value="metrics.teamMembers"    icon="UserGroupIcon"      color="bg-blue-100"   textColor="text-blue-700" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- My Tasks -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-card">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 class="text-sm font-bold text-gray-900">My Tasks</h2>
          <router-link
            to="/backlog"
            class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all →
          </router-link>
        </div>
        <div class="px-2 py-2">
          <div v-if="myTasks.length" class="divide-y divide-gray-50">
            <TaskItem
              v-for="task in myTasks.slice(0, 5)"
              :key="task.id"
              :task="task"
            />
          </div>
          <p v-else class="text-sm text-gray-400 text-center py-8">
            No tasks assigned to you yet.
          </p>
        </div>
      </div>

      <!-- Upcoming Deadlines -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-card">
        <div class="px-5 py-4 border-b border-gray-50">
          <h2 class="text-sm font-bold text-gray-900">Upcoming Deadlines</h2>
        </div>
        <div class="px-2 py-2">
          <div v-if="upcomingDeadlines.length">
            <DeadlineItem
              v-for="deadline in upcomingDeadlines"
              :key="deadline.id"
              :deadline="deadline"
            />
          </div>
          <p v-else class="text-sm text-gray-400 text-center py-8">
            No upcoming deadlines.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Project Progress -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-card">
        <div class="px-5 py-4 border-b border-gray-50">
          <h2 class="text-sm font-bold text-gray-900">Project Progress</h2>
        </div>
        <div class="px-5 py-4 space-y-4">
          <ProjectProgressBar
            v-for="project in projectProgress"
            :key="project.id"
            :project="project"
          />
        </div>
      </div>

      <!-- Team Activity -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-card">
        <div class="px-5 py-4 border-b border-gray-50">
          <h2 class="text-sm font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div class="px-5 py-4">
          <div v-if="teamActivity.length" class="space-y-1">
            <ActivityLog
              v-for="activity in teamActivity"
              :key="activity.id"
              :activity="activity"
            />
          </div>
          <p v-else class="text-sm text-gray-400 text-center py-6">
            Move tasks between columns to see activity here.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import MetricCard from '../components/MetricCard.vue'
import TaskItem from '../components/TaskItem.vue'
import DeadlineItem from '../components/DeadlineItem.vue'
import ProjectProgressBar from '../components/ProjectProgressBar.vue'
import ActivityLog from '../components/ActivityLog.vue'

const taskStore = useTaskStore()
const authStore = useAuthStore()

const firstName = computed(() => authStore.user?.name?.split(' ')[0] ?? 'there')

const metrics = computed(() => ({
  activeTasks:    taskStore.activeTasks.length,
  overdueTasks:   taskStore.overdueTasks.length,
  completedToday: taskStore.completedToday.length,
  teamMembers:    taskStore.teamMembers.length,
}))

const myTasks = computed(() => {
  const name = authStore.user?.name
  if (!name) return taskStore.activeTasks.slice(0, 5)
  const mine = taskStore.tasks.filter(t => t.assignees?.includes(name) && t.status !== 'done')
  return mine.length ? mine : taskStore.activeTasks.slice(0, 5)
})

const upcomingDeadlines = computed(() => {
  const now = new Date()
  const todayStr  = now.toISOString().split('T')[0]
  const cutoffStr = new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0]
  return taskStore.tasks
    .filter(t => t.dueDate && t.dueDate >= todayStr && t.dueDate <= cutoffStr && t.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      title: t.title,
      daysLeft: Math.ceil((new Date(t.dueDate + 'T00:00:00') - now) / 86400000),
      project: taskStore.projects.find(p => p.id === t.projectId)?.name ?? 'Unassigned',
    }))
})

const projectProgress = computed(() =>
  taskStore.projects.map(p => {
    const all  = taskStore.tasks.filter(t => t.projectId === p.id)
    const done = all.filter(t => t.status === 'done').length
    return { ...p, completion: all.length ? Math.round((done / all.length) * 100) : 0 }
  })
)

const teamActivity = computed(() =>
  taskStore.getTaskHistory().slice(0, 6).map(h => ({
    id:     h.id,
    user:   h.changedBy ?? 'Team Member',
    action: `moved to ${statusLabel(h.to)}`,
    target: h.taskTitle,
    time:   relativeTime(h.timestamp),
  }))
)

const statusLabel = (s) =>
  ({ todo: 'To Do', doing: 'In Progress', done: 'Done', backlog: 'Backlog' }[s] ?? s)

const relativeTime = (date) => {
  const ms = Date.now() - new Date(date).getTime()
  const m  = Math.floor(ms / 60000)
  const h  = Math.floor(ms / 3600000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
</script>
