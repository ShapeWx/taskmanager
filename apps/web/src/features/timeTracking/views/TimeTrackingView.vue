<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Time Tracking</h1>
      <p class="text-sm text-gray-500 mt-1">Log and monitor time spent on your tasks</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Today" :hours="stats.todayHours" unit="hrs" />
      <StatCard title="This Week" :hours="stats.weekHours" unit="hrs" />
      <StatCard title="Total Entries" :hours="timeEntries.length" unit="logs" />
      <StatCard title="Avg / Day" :hours="stats.avgHours" unit="hrs" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Active Timer -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-card p-6">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Timer</h3>

        <!-- Task selector -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Task</label>
          <select
            v-model="selectedTaskId"
            :disabled="isRunning || isPaused"
            class="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="">— Select a task —</option>
            <option
              v-for="task in activeTasks"
              :key="task.id"
              :value="task.id"
            >
              {{ task.title }}
            </option>
          </select>
        </div>

        <!-- Clock display -->
        <div class="text-center py-6">
          <p
            class="text-5xl font-mono font-bold tracking-widest"
            :class="isRunning ? 'text-emerald-700' : isPaused ? 'text-amber-600' : 'text-gray-300'"
          >
            {{ formattedTime }}
          </p>
          <p class="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
            {{ isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped' }}
          </p>
        </div>

        <!-- Controls -->
        <div class="space-y-2">
          <button
            v-if="!isRunning && !isPaused"
            @click="startTimer"
            :disabled="!selectedTaskId"
            class="w-full py-2.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <PlayIcon class="w-4 h-4" />
            Start Timer
          </button>

          <div v-else class="flex gap-2">
            <button
              v-if="isRunning"
              @click="pauseTimer"
              class="flex-1 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              <PauseIcon class="w-4 h-4" />
              Pause
            </button>
            <button
              v-else
              @click="resumeTimer"
              class="flex-1 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlayIcon class="w-4 h-4" />
              Resume
            </button>
            <button
              @click="stopTimer"
              class="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <StopIcon class="w-4 h-4" />
              Stop
            </button>
          </div>
        </div>

        <p v-if="isRunning && currentTaskName" class="text-xs text-gray-500 text-center mt-3 truncate">
          {{ currentTaskName }}
        </p>
      </div>

      <!-- Time Entries -->
      <div class="lg:col-span-2 bg-white rounded-lg p-6 shadow border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-emerald-900">Today's Entries</h3>
          <button
            v-if="todayEntries.length"
            @click="clearTodayEntries"
            class="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear today
          </button>
        </div>
        <div v-if="todayEntries.length" class="space-y-3 max-h-80 overflow-y-auto">
          <TimeEntry
            v-for="entry in todayEntries"
            :key="entry.id"
            :entry="entry"
          />
        </div>
        <p v-else class="text-sm text-gray-400 py-8 text-center">
          Start the timer on a task to log time here.
        </p>
      </div>
    </div>

    <!-- Weekly Summary -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-card p-6">
      <h3 class="text-sm font-bold text-gray-900 mb-4">Weekly Summary</h3>
      <div class="grid grid-cols-7 gap-3 items-end h-40">
        <WeeklyBar
          v-for="day in weeklyData"
          :key="day.day"
          :day="day.day"
          :hours="day.hours"
          :max-hours="weeklyMax"
          :is-today="day.isToday"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useToast } from '@/composables/useToast'
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/vue/24/solid'
import StatCard from '../components/StatCard.vue'
import TimeEntry from '../components/TimeEntry.vue'
import WeeklyBar from '../components/WeeklyBar.vue'

const TIMER_KEY = 'taskmaster-active-timer'
const ENTRIES_KEY = 'taskmaster-time-entries'

const taskStore = useTaskStore()
const toast = useToast()

// ── Timer state ──────────────────────────────────────────────────────────────
const selectedTaskId = ref('')
const isRunning = ref(false)
const isPaused = ref(false)
const elapsedSeconds = ref(0)
const timerStartedAt = ref(null)
let timerInterval = null

// ── Entries ───────────────────────────────────────────────────────────────────
const timeEntries = ref(JSON.parse(localStorage.getItem(ENTRIES_KEY) ?? '[]'))

// ── Derived ───────────────────────────────────────────────────────────────────
const activeTasks = computed(() => taskStore.tasks.filter(t => t.status !== 'done'))

const currentTaskName = computed(() =>
  taskStore.tasks.find(t => t.id === selectedTaskId.value)?.title ?? ''
)

const formattedTime = computed(() => {
  const h = Math.floor(elapsedSeconds.value / 3600)
  const m = Math.floor((elapsedSeconds.value % 3600) / 60)
  const s = elapsedSeconds.value % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
})

const todayStr = new Date().toISOString().split('T')[0]

const todayEntries = computed(() =>
  timeEntries.value.filter(e => e.date.startsWith(todayStr)).reverse()
)

const stats = computed(() => {
  const todaySecs = todayEntries.value.reduce((sum, e) => sum + e.durationSeconds, 0)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]
  const weekSecs = timeEntries.value
    .filter(e => e.date >= weekStartStr)
    .reduce((sum, e) => sum + e.durationSeconds, 0)

  const days = new Set(timeEntries.value.map(e => e.date.split('T')[0])).size || 1
  const totalSecs = timeEntries.value.reduce((sum, e) => sum + e.durationSeconds, 0)

  return {
    todayHours: +(todaySecs / 3600).toFixed(1),
    weekHours: +(weekSecs / 3600).toFixed(1),
    avgHours: +(totalSecs / 3600 / days).toFixed(1)
  }
})

const weeklyData = computed(() => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  const todayIdx = now.getDay()
  return labels.map((label, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - todayIdx + i)
    const key = d.toISOString().split('T')[0]
    const secs = timeEntries.value
      .filter(e => e.date.startsWith(key))
      .reduce((sum, e) => sum + e.durationSeconds, 0)
    return { day: label, hours: +(secs / 3600).toFixed(1), isToday: i === todayIdx }
  })
})

const weeklyMax = computed(() => {
  const max = Math.max(...weeklyData.value.map(d => d.hours), 1)
  return max
})

// ── Timer controls ────────────────────────────────────────────────────────────
const tick = () => {
  elapsedSeconds.value++
  saveTimerState()
}

const startTicking = () => {
  timerInterval = setInterval(tick, 1000)
}

const saveTimerState = () => {
  localStorage.setItem(TIMER_KEY, JSON.stringify({
    taskId: selectedTaskId.value,
    elapsedSeconds: elapsedSeconds.value,
    isRunning: isRunning.value,
    isPaused: isPaused.value,
    savedAt: Date.now()
  }))
}

const startTimer = () => {
  if (!selectedTaskId.value) return
  isRunning.value = true
  isPaused.value = false
  timerStartedAt.value = Date.now()
  startTicking()
  saveTimerState()
}

const pauseTimer = () => {
  clearInterval(timerInterval)
  isRunning.value = false
  isPaused.value = true
  saveTimerState()
}

const resumeTimer = () => {
  isRunning.value = true
  isPaused.value = false
  startTicking()
  saveTimerState()
}

const stopTimer = () => {
  clearInterval(timerInterval)
  if (elapsedSeconds.value > 0) {
    const task = taskStore.tasks.find(t => t.id === selectedTaskId.value)
    const project = taskStore.projects.find(p => p.id === task?.projectId)
    const entry = {
      id: crypto.randomUUID(),
      taskId: selectedTaskId.value,
      task: task?.title ?? 'Unknown Task',
      project: project?.name ?? 'Unassigned',
      duration: formattedTime.value,
      durationSeconds: elapsedSeconds.value,
      date: new Date().toISOString()
    }
    timeEntries.value.push(entry)
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(timeEntries.value))
    toast.success(`Logged ${formattedTime.value} on "${entry.task}"`)
  }
  isRunning.value = false
  isPaused.value = false
  elapsedSeconds.value = 0
  selectedTaskId.value = ''
  localStorage.removeItem(TIMER_KEY)
}

const clearTodayEntries = () => {
  timeEntries.value = timeEntries.value.filter(e => !e.date.startsWith(todayStr))
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(timeEntries.value))
  toast.info("Today's entries cleared")
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  const saved = localStorage.getItem(TIMER_KEY)
  if (saved) {
    const state = JSON.parse(saved)
    selectedTaskId.value = state.taskId ?? ''
    isPaused.value = state.isPaused ?? false
    isRunning.value = state.isRunning ?? false
    if (state.isRunning) {
      // Catch up time lost while page was closed
      const elapsed = Math.floor((Date.now() - state.savedAt) / 1000)
      elapsedSeconds.value = state.elapsedSeconds + elapsed
      startTicking()
    } else {
      elapsedSeconds.value = state.elapsedSeconds ?? 0
    }
  }
})

onUnmounted(() => clearInterval(timerInterval))
</script>
