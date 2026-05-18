<template>
  <header class="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-100 shadow-[0_1px_0_0_rgb(0,0,0,0.06)]">
    <!-- Left: Toggle + Search -->
    <div class="flex items-center gap-4">
      <button
        @click="$emit('toggle-sidebar')"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon class="w-5 h-5" />
      </button>

      <div class="relative hidden sm:block">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks…"
          class="w-64 lg:w-80 pl-9 pr-9 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 focus:bg-white transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Right: Theme + Notifications + Avatar -->
    <div class="flex items-center gap-1.5">
      <!-- Theme dots -->
      <div class="hidden md:flex items-center gap-1 mr-1">
        <button
          v-for="t in themeStore.themes"
          :key="t.name"
          @click="themeStore.setTheme(t.name)"
          :class="[
            'w-3.5 h-3.5 rounded-full transition-all duration-200 ring-offset-1',
            themeStore.currentTheme === t.name ? 'ring-2 ring-gray-400' : 'opacity-60 hover:opacity-100',
            themeColor(t.name)
          ]"
          :title="t.label"
        />
      </div>

      <!-- Cycle theme button (mobile) -->
      <button
        @click="themeStore.toggleTheme()"
        class="w-8 h-8 rounded-lg md:hidden flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
        title="Switch theme"
      >
        <SwatchIcon class="w-4.5 h-4.5" style="width:18px;height:18px;" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button
          @click="showNotifications = !showNotifications"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all relative"
          aria-label="Notifications"
        >
          <BellIcon class="w-5 h-5" />
          <span
            v-if="overdueCount > 0"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
          />
        </button>

        <Transition name="dropdown">
          <div
            v-if="showNotifications"
            v-click-outside="() => (showNotifications = false)"
            class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-card-lg border border-gray-100 z-50 overflow-hidden"
          >
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-semibold text-gray-900">Notifications</p>
              <span v-if="overdueCount > 0" class="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {{ overdueCount }} overdue
              </span>
            </div>
            <div class="max-h-72 overflow-y-auto">
              <div v-if="overdueCount === 0" class="flex flex-col items-center justify-center py-10 gap-2">
                <CheckCircleIcon class="w-8 h-8 text-emerald-400" />
                <p class="text-sm text-gray-500 font-medium">All caught up!</p>
              </div>
              <div
                v-for="task in overdueList"
                :key="task.id"
                class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
              >
                <div class="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ task.title }}</p>
                  <p class="text-xs text-red-500 mt-0.5">Due {{ formatDate(task.dueDate) }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Divider -->
      <div class="w-px h-5 bg-gray-200 mx-1" />

      <!-- Profile -->
      <div class="relative">
        <button
          @click="showProfileMenu = !showProfileMenu"
          class="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-lg hover:bg-gray-100 transition-all"
        >
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {{ userInitials }}
          </div>
          <span class="text-sm font-semibold text-gray-700 hidden lg:block">{{ firstName }}</span>
          <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400" />
        </button>

        <Transition name="dropdown">
          <div
            v-if="showProfileMenu"
            v-click-outside="() => (showProfileMenu = false)"
            class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-lg border border-gray-100 z-50 overflow-hidden"
          >
            <!-- User info -->
            <div class="px-4 py-3 bg-gradient-to-br from-slate-50 to-gray-50 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {{ userInitials }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ authStore.user?.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
                </div>
              </div>
              <span class="mt-2.5 inline-block text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {{ roleName }}
              </span>
            </div>

            <!-- Menu items -->
            <div class="p-1.5 space-y-0.5">
              <router-link
                to="/profile"
                class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                @click="showProfileMenu = false"
              >
                <UserCircleIcon class="w-4 h-4 text-gray-400" />
                My Profile
              </router-link>
              <router-link
                v-if="authStore.hasRole('admin')"
                to="/auth/authorization"
                class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                @click="showProfileMenu = false"
              >
                <ShieldCheckIcon class="w-4 h-4 text-gray-400" />
                User Management
              </router-link>
              <hr class="my-1 border-gray-100" />
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <PowerIcon class="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/themes/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { useSearch } from '@/composables/useSearch'
import {
  Bars3Icon, MagnifyingGlassIcon, XMarkIcon, BellIcon,
  ChevronDownIcon, SwatchIcon, CheckCircleIcon,
  UserCircleIcon, ShieldCheckIcon, PowerIcon,
} from '@heroicons/vue/24/outline'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const router = useRouter()
const { searchQuery } = useSearch()

const showProfileMenu = ref(false)
const showNotifications = ref(false)

const overdueList = computed(() => taskStore.overdueTasks.slice(0, 5))
const overdueCount = computed(() => taskStore.overdueTasks.length)

const userInitials = computed(() => {
  if (!authStore.user?.name) return 'U'
  return authStore.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
const firstName = computed(() => authStore.user?.name?.split(' ')[0] ?? '')
const roleName = computed(() => authStore.roles[authStore.user?.role]?.name ?? 'User')

const themeColor = (name) => ({
  deepForest: 'bg-emerald-500',
  ocean: 'bg-blue-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-500',
}[name] ?? 'bg-gray-400')

const formatDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const handleLogout = () => {
  authStore.logout()
  showProfileMenu.value = false
  router.push('/auth/login')
}

const vClickOutside = {
  mounted(el, binding) {
    el._outside = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._outside, { capture: true })
  },
  unmounted(el) {
    document.removeEventListener('click', el._outside, { capture: true })
  },
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}
</style>
