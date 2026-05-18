<template>
  <aside
    :class="[
      'h-full flex flex-col transition-all duration-300 ease-in-out flex-shrink-0',
      isCollapsed ? 'w-[72px]' : 'w-72',
      'bg-slate-900'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between px-4 h-16 border-b border-slate-800 flex-shrink-0">
      <div v-if="!isCollapsed" class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <CheckIcon class="w-4.5 h-4.5 text-white" style="width:18px;height:18px;" />
        </div>
        <span class="text-white font-bold text-[17px] tracking-tight truncate">TaskMaster</span>
      </div>
      <div v-else class="w-full flex justify-center">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
          <CheckIcon class="text-white" style="width:18px;height:18px;" />
        </div>
      </div>
      <button
        @click="toggleSidebar"
        class="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all"
        :title="isCollapsed ? 'Expand' : 'Collapse'"
      >
        <ChevronLeftIcon v-if="!isCollapsed" class="w-4 h-4" />
        <ChevronRightIcon v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- New Task Button -->
    <div class="px-3 py-3 border-b border-slate-800 flex-shrink-0">
      <button
        v-if="!isCollapsed"
        @click="$emit('add-task')"
        class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-emerald-500/25 hover:shadow-md"
      >
        <PlusIcon class="w-4 h-4" />
        New Task
      </button>
      <button
        v-else
        @click="$emit('add-task')"
        class="w-full flex items-center justify-center py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
        title="New Task"
      >
        <PlusIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto dark-scroll px-2 py-3 space-y-0.5">
      <NavItem
        v-for="item in navItems"
        :key="item.id"
        :label="item.label"
        :icon="item.icon"
        :active="activeNav === item.id"
        :collapsed="isCollapsed"
        @click="navigateTo(item.routeName)"
      />
    </nav>

    <!-- Collapsible Sections -->
    <div
      v-if="!isCollapsed"
      class="px-2 py-3 border-t border-slate-800 space-y-1 overflow-y-auto dark-scroll max-h-52 flex-shrink-0"
    >
      <CollapsibleSection title="Projects" :items="projects" />
      <CollapsibleSection title="Tags" :items="tags" />
      <CollapsibleSection title="Members" :items="teamMemberItems" />
    </div>

    <!-- Plan Usage -->
    <div class="px-3 py-3 border-t border-slate-800 flex-shrink-0">
      <div v-if="!isCollapsed">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Free Plan</span>
          <span class="text-xs font-bold text-emerald-400">{{ activeTaskCount }}/{{ MAX_TASKS }}</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            class="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
            :style="{ width: `${Math.min((activeTaskCount / MAX_TASKS) * 100, 100)}%` }"
          />
        </div>
        <p class="text-xs text-slate-500 mt-1.5">{{ activeTaskCount }} of {{ MAX_TASKS }} active tasks</p>
      </div>
      <div v-else class="flex justify-center">
        <span class="text-xs font-bold text-emerald-400">{{ activeTaskCount }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/vue/24/solid'
import { useTaskStore } from '@/stores/taskStore'
import NavItem from './NavItem.vue'
import CollapsibleSection from './CollapsibleSection.vue'

const emit = defineEmits(['add-task', 'toggle-sidebar'])
const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()

const MAX_TASKS = 20
const isCollapsed = ref(false)

const activeTaskCount = computed(() => taskStore.activeTasks.length)

const activeNav = computed(() => {
  const map = {
    dashboard: 'dashboard', kanban: 'kanban', priority: 'priority',
    backlog: 'backlog', timeTracking: 'timeTracking', analytics: 'analytics', team: 'team'
  }
  return map[route.name] || 'dashboard'
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle-sidebar', isCollapsed.value)
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Squares2X2Icon', routeName: 'dashboard' },
  { id: 'kanban', label: 'Kanban Board', icon: 'ViewColumnsIcon', routeName: 'kanban' },
  { id: 'priority', label: 'Priority Chart', icon: 'ChartBarIcon', routeName: 'priority' },
  { id: 'backlog', label: 'Backlog', icon: 'QueueListIcon', routeName: 'backlog' },
  { id: 'timeTracking', label: 'Time Tracking', icon: 'ClockIcon', routeName: 'timeTracking' },
  { id: 'analytics', label: 'Analytics', icon: 'SparklesIcon', routeName: 'analytics' },
  { id: 'team', label: 'Team', icon: 'UserGroupIcon', routeName: 'team' },
]

const projects = taskStore.projects.map(p => ({ id: p.id, name: p.name, color: p.color }))
const tags = [
  { id: 1, name: 'Prototype', color: 'bg-purple-500' },
  { id: 2, name: 'Research', color: 'bg-emerald-500' },
  { id: 3, name: 'Testing', color: 'bg-amber-500' },
]
const teamMemberItems = taskStore.teamMembers.map(m => ({ id: m.id, name: m.name, role: m.role }))

const navigateTo = (routeName) => router.push({ name: routeName })

defineExpose({ toggleSidebar })
</script>
