import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const TASKS_KEY = 'taskmaster-tasks'
const CATEGORIES_KEY = 'taskmaster-categories'

const DEFAULT_TASKS = [
  { id: '1', title: 'A/B Testing - Round 3', status: 'todo', priority: 'high', assignees: ['John Doe'], tags: ['Testing', 'Research'], dueDate: '2026-05-10', description: 'Complete A/B test round 3', projectId: 1 },
  { id: '2', title: 'Design System Documentation', status: 'doing', priority: 'medium', assignees: ['Jane Smith'], tags: ['Documentation'], dueDate: '2026-05-15', description: 'Document design system components', projectId: 1 },
  { id: '3', title: 'User Research Analysis', status: 'doing', priority: 'high', assignees: ['Mike Johnson'], tags: ['Research'], dueDate: '2026-05-12', description: 'Analyze user research data', projectId: 2 },
  { id: '4', title: 'API Integration', status: 'todo', priority: 'medium', assignees: ['John Doe', 'Sarah Williams'], tags: ['Backend'], dueDate: '2026-05-18', description: 'Integrate new API endpoints', projectId: 2 },
  { id: '5', title: 'Performance Optimization', status: 'done', priority: 'low', assignees: ['Sarah Williams'], tags: ['Optimization'], dueDate: '2026-05-20', description: 'Optimize database queries', projectId: 1, completedAt: '2026-05-12T09:00:00.000Z' },
  { id: '6', title: 'Bug Fixes', status: 'doing', priority: 'high', assignees: ['Mike Johnson'], tags: ['Bug'], dueDate: '2026-05-08', description: 'Fix critical production bugs', projectId: 3 },
  { id: '7', title: 'Feature Testing', status: 'todo', priority: 'medium', assignees: ['Jane Smith', 'John Doe'], tags: ['Testing'], dueDate: '2026-05-14', description: 'Test new features', projectId: 3 },
  { id: '8', title: 'Database Migration', status: 'backlog', priority: 'high', assignees: ['Sarah Williams'], tags: ['Database'], dueDate: '2026-05-25', description: 'Migrate to new database schema', projectId: 1 }
]

const DEFAULT_CATEGORIES = [
  { id: 'todo', name: 'To Do', color: 'bg-blue-100', textColor: 'text-blue-700', order: 1 },
  { id: 'doing', name: 'In Progress', color: 'bg-yellow-100', textColor: 'text-yellow-700', order: 2 },
  { id: 'done', name: 'Done', color: 'bg-green-100', textColor: 'text-green-700', order: 3 }
]

export const useTaskStore = defineStore('tasks', () => {
  const storedTasks = localStorage.getItem(TASKS_KEY)
  const storedCategories = localStorage.getItem(CATEGORIES_KEY)

  const tasks = ref(storedTasks ? JSON.parse(storedTasks) : DEFAULT_TASKS)
  const categories = ref(storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES)
  const taskHistory = ref([])

  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Lead Developer', initials: 'JD' },
    { id: 2, name: 'Jane Smith', role: 'Designer', initials: 'JS' },
    { id: 3, name: 'Mike Johnson', role: 'QA Engineer', initials: 'MJ' },
    { id: 4, name: 'Sarah Williams', role: 'Product Manager', initials: 'SW' }
  ]

  const projects = ref([
    { id: 1, name: 'Statra Insurance', color: 'bg-emerald-500' },
    { id: 2, name: 'Meridian', color: 'bg-rose-500' },
    { id: 3, name: 'Risen', color: 'bg-blue-500' },
    { id: 4, name: 'SkillBox', color: 'bg-yellow-500' }
  ])

  watch(tasks, (val) => localStorage.setItem(TASKS_KEY, JSON.stringify(val)), { deep: true })
  watch(categories, (val) => localStorage.setItem(CATEGORIES_KEY, JSON.stringify(val)), { deep: true })

  const sortedCategories = computed(() => [...categories.value].sort((a, b) => a.order - b.order))

  const activeTasks = computed(() =>
    tasks.value.filter(t => t.status !== 'done' && t.status !== 'backlog')
  )

  const overdueTasks = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.value.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today)
  })

  const completedToday = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.value.filter(t => t.status === 'done' && t.completedAt?.startsWith(today))
  })

  const getTasksByStatus = (status) => tasks.value.filter(t => t.status === status)

  const getTasksByAssignee = (name) => tasks.value.filter(t => t.assignees?.includes(name))

  const updateTaskStatus = (taskId, newStatus) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return
    const oldStatus = task.status
    task.status = newStatus
    if (newStatus === 'done') task.completedAt = new Date().toISOString()
    taskHistory.value.push({
      id: crypto.randomUUID(),
      taskId,
      taskTitle: task.title,
      from: oldStatus,
      to: newStatus,
      timestamp: new Date(),
      changedBy: 'Current User'
    })
  }

  const addTask = (newTask) => {
    tasks.value.push({
      id: crypto.randomUUID(),
      tags: [],
      assignees: [],
      ...newTask,
      status: newTask.status || 'todo',
      createdAt: new Date().toISOString()
    })
  }

  const updateTask = (taskId, updates) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) Object.assign(task, updates)
  }

  const deleteTask = (taskId) => {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index > -1) tasks.value.splice(index, 1)
  }

  const addCategory = (newCategory) => {
    const order = Math.max(...categories.value.map(c => c.order), 0) + 1
    categories.value.push({
      id: `cat-${crypto.randomUUID().slice(0, 8)}`,
      ...newCategory,
      order
    })
  }

  const deleteCategory = (categoryId) => {
    const index = categories.value.findIndex(c => c.id === categoryId)
    if (index > -1) categories.value.splice(index, 1)
  }

  const reorderCategories = (newOrder) => { categories.value = newOrder }

  const getTaskHistory = () =>
    [...taskHistory.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const getTaskHistoryForTask = (taskId) => taskHistory.value.filter(h => h.taskId === taskId)

  return {
    tasks, categories, taskHistory, teamMembers, projects,
    sortedCategories, activeTasks, overdueTasks, completedToday,
    getTasksByStatus, getTasksByAssignee,
    updateTaskStatus, addTask, updateTask, deleteTask,
    addCategory, deleteCategory, reorderCategories,
    getTaskHistory, getTaskHistoryForTask
  }
})
