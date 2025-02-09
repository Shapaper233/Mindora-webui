import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const primaryColor = ref('#4361ee')
  const isMenuCollapsed = ref(false)
  
  // 计算属性
  const cssVariables = computed(() => ({
    '--menu-width': isMenuCollapsed.value ? '64px' : '240px',
    '--primary-color': primaryColor.value,
    '--settings-bg': `linear-gradient(145deg, 
      ${primaryColor.value}33 0%, 
      ${primaryColor.value}11 100%)`
  }))

  // 动作方法
  function toggleMenu() {
    isMenuCollapsed.value = !isMenuCollapsed.value
  }

  function setPrimaryColor(color) {
    primaryColor.value = color
  }

  return { 
    primaryColor,
    isMenuCollapsed,
    cssVariables,
    toggleMenu,
    setPrimaryColor
  }
})
