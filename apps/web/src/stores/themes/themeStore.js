import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('deepForest')

  // Deep Forest Theme - Primary dark green palette
  const deepForestTheme = {
    name: 'deepForest',
    label: 'Deep Forest',
    colors: {
      primary: '#1a4d2e',      // Deep forest green
      secondary: '#2d6a4f',    // Darker sage green
      accent: '#40916c',       // Muted green
      light: '#52b788',        // Lighter green
      lightest: '#74c69d',     // Very light green
      background: '#f0fdf4',   // Nearly white with green tint
      border: '#d1fadf',       // Light green border
      text: '#1a4d2e',         // Dark green text
      textLight: '#4a7c59',    // Medium green text
      
      // UI specific colors
      success: '#52b788',
      warning: '#f4a261',
      error: '#e63946',
      info: '#457b9d',
      
      // Gradient
      gradient: 'from-emerald-900 via-emerald-700 to-teal-600'
    },
    tailwind: {
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      sidebar: 'bg-gradient-to-br from-emerald-50 to-green-50',
      header: 'bg-white border-b border-emerald-200',
      primary: 'bg-emerald-700 hover:bg-emerald-800',
      secondary: 'bg-emerald-600 hover:bg-emerald-700',
      accent: 'bg-emerald-500 hover:bg-emerald-600',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      focus: 'focus:ring-emerald-500 focus:border-emerald-500'
    }
  }

  // Ocean Blue Theme
  const oceanTheme = {
    name: 'ocean',
    label: 'Ocean Blue',
    colors: {
      primary: '#0c4a6e',
      secondary: '#0f766e',
      accent: '#1e7e74',
      light: '#14b8a6',
      lightest: '#5eead4',
      background: '#f0f9ff',
      border: '#cffafe',
      text: '#0c4a6e',
      textLight: '#0f766e',
      
      success: '#14b8a6',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      
      gradient: 'from-blue-900 via-cyan-700 to-teal-600'
    },
    tailwind: {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      sidebar: 'bg-gradient-to-br from-blue-50 to-teal-50',
      header: 'bg-white border-b border-blue-200',
      primary: 'bg-blue-700 hover:bg-blue-800',
      secondary: 'bg-cyan-600 hover:bg-cyan-700',
      accent: 'bg-teal-500 hover:bg-teal-600',
      text: 'text-blue-900',
      border: 'border-blue-200',
      focus: 'focus:ring-blue-500 focus:border-blue-500'
    }
  }

  // Purple Twilight Theme
  const purpleTheme = {
    name: 'purple',
    label: 'Purple Twilight',
    colors: {
      primary: '#581c87',
      secondary: '#6b21a8',
      accent: '#7c3aed',
      light: '#a78bfa',
      lightest: '#d8b4fe',
      background: '#faf5ff',
      border: '#e9d5ff',
      text: '#581c87',
      textLight: '#6b21a8',
      
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      
      gradient: 'from-purple-900 via-purple-700 to-indigo-600'
    },
    tailwind: {
      bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
      sidebar: 'bg-gradient-to-br from-purple-50 to-violet-50',
      header: 'bg-white border-b border-purple-200',
      primary: 'bg-purple-700 hover:bg-purple-800',
      secondary: 'bg-violet-600 hover:bg-violet-700',
      accent: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-purple-900',
      border: 'border-purple-200',
      focus: 'focus:ring-purple-500 focus:border-purple-500'
    }
  }

  // Slate Professional Theme
  const slateTheme = {
    name: 'slate',
    label: 'Slate Professional',
    colors: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#475569',
      light: '#64748b',
      lightest: '#94a3b8',
      background: '#f1f5f9',
      border: '#e2e8f0',
      text: '#1e293b',
      textLight: '#334155',
      
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
      
      gradient: 'from-slate-900 via-slate-700 to-blue-600'
    },
    tailwind: {
      bg: 'bg-gradient-to-br from-slate-50 to-blue-50',
      sidebar: 'bg-gradient-to-br from-slate-50 to-slate-100',
      header: 'bg-white border-b border-slate-200',
      primary: 'bg-slate-700 hover:bg-slate-800',
      secondary: 'bg-slate-600 hover:bg-slate-700',
      accent: 'bg-slate-500 hover:bg-slate-600',
      text: 'text-slate-900',
      border: 'border-slate-200',
      focus: 'focus:ring-slate-500 focus:border-slate-500'
    }
  }

  const themes = {
    deepForest: deepForestTheme,
    ocean: oceanTheme,
    purple: purpleTheme,
    slate: slateTheme
  }

  const activeTheme = computed(() => themes[currentTheme.value])

  function setTheme(themeName) {
    if (themes[themeName]) {
      currentTheme.value = themeName
      localStorage.setItem('taskmaster-theme', themeName)
    }
  }

  function toggleTheme() {
    const themeNames = Object.keys(themes)
    const currentIndex = themeNames.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themeNames.length
    setTheme(themeNames[nextIndex])
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem('taskmaster-theme')
    if (savedTheme && themes[savedTheme]) {
      currentTheme.value = savedTheme
    }
  }

  return {
    currentTheme,
    activeTheme,
    themes: computed(() => Object.values(themes)),
    setTheme,
    toggleTheme,
    initializeTheme
  }
})
