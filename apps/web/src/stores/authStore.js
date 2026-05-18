import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(null)
  const userRole = ref(null)
  
  const users = ref([
    { id: 1, email: 'admin@taskmaster.com', password: 'admin123', name: 'Admin User', role: 'admin', status: 'active' },
    { id: 2, email: 'manager@taskmaster.com', password: 'manager123', name: 'Project Manager', role: 'manager', status: 'active' },
    { id: 3, email: 'user@taskmaster.com', password: 'user123', name: 'John Doe', role: 'user', status: 'active' }
  ])

  const roles = ref({
    admin: {
      name: 'Administrator',
      permissions: ['create_task', 'edit_task', 'delete_task', 'manage_users', 'view_reports', 'manage_categories', 'manage_projects', 'manage_roles']
    },
    manager: {
      name: 'Project Manager',
      permissions: ['create_task', 'edit_task', 'delete_task', 'view_reports', 'manage_categories']
    },
    user: {
      name: 'Team Member',
      permissions: ['create_task', 'edit_task', 'view_reports']
    },
    viewer: {
      name: 'Viewer',
      permissions: ['view_reports']
    }
  })

  const login = (email, password) => {
    const foundUser = users.value.find(u => u.email === email && u.password === password)
    if (foundUser) {
      user.value = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      }
      userRole.value = foundUser.role
      token.value = `token_${Math.random().toString(36).substr(2, 9)}`
      isAuthenticated.value = true
      localStorage.setItem('taskmaster-token', token.value)
      localStorage.setItem('taskmaster-user', JSON.stringify(user.value))
      return { success: true, message: 'Login successful' }
    }
    return { success: false, message: 'Invalid email or password' }
  }

  const register = (email, password, name) => {
    if (users.value.some(u => u.email === email)) {
      return { success: false, message: 'Email already exists' }
    }
    
    const newUser = {
      id: Math.max(...users.value.map(u => u.id), 0) + 1,
      email,
      password,
      name,
      role: 'user',
      status: 'active'
    }
    users.value.push(newUser)
    
    user.value = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
    userRole.value = newUser.role
    token.value = `token_${Math.random().toString(36).substr(2, 9)}`
    isAuthenticated.value = true
    localStorage.setItem('taskmaster-token', token.value)
    localStorage.setItem('taskmaster-user', JSON.stringify(user.value))
    
    return { success: true, message: 'Registration successful' }
  }

  const logout = () => {
    user.value = null
    userRole.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('taskmaster-token')
    localStorage.removeItem('taskmaster-user')
  }

  const hasPermission = (permission) => {
    if (!userRole.value) return false
    return roles.value[userRole.value]?.permissions?.includes(permission) || false
  }

  const hasRole = (role) => {
    return userRole.value === role
  }

  const canEditTask = (task, userId) => {
    if (hasRole('admin')) return true
    if (hasRole('manager')) return true
    if (hasPermission('edit_task') && task.assignees?.includes(userId)) return true
    return false
  }

  const canDeleteTask = (task) => {
    return hasPermission('delete_task')
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('taskmaster-token')
    const savedUser = localStorage.getItem('taskmaster-user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      userRole.value = user.value.role
      isAuthenticated.value = true
    }
  }

  const updateUserRole = (userId, newRole) => {
    const userToUpdate = users.value.find(u => u.id === userId)
    if (userToUpdate && hasRole('admin')) {
      userToUpdate.role = newRole
      if (user.value?.id === userId) {
        userRole.value = newRole
        user.value.role = newRole
      }
      return { success: true }
    }
    return { success: false, message: 'Unauthorized' }
  }

  return {
    user,
    isAuthenticated,
    token,
    userRole,
    users,
    roles,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    canEditTask,
    canDeleteTask,
    initializeAuth,
    updateUserRole
  }
})
