import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态初始化（带持久化）
  const primaryColor = ref(localStorage.getItem('primaryColor') || '#4361ee')
  const isMenuCollapsed = ref(JSON.parse(localStorage.getItem('isMenuCollapsed') || 'false'))
  const locale = ref(localStorage.getItem('locale') || 'zh-CN')
  
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
    localStorage.setItem('isMenuCollapsed', isMenuCollapsed.value)
  }

  function setPrimaryColor(color) {
    primaryColor.value = color
    localStorage.setItem('primaryColor', color)
  }

  function setLanguage(lang) {
    locale.value = lang;
    localStorage.setItem('locale', lang);
    // 确保更新所有依赖语言状态的组件
    window.dispatchEvent(new CustomEvent('language-changed', { detail: lang }));
    // 强制Pinia更新所有计算属性
    primaryColor.value = primaryColor.value;
  }

  return { 
    primaryColor,
    isMenuCollapsed,
    locale,
    cssVariables,
    toggleMenu,
    setPrimaryColor,
    setLanguage
  }
})
