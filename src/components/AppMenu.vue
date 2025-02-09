<script setup>
import { useThemeStore } from '@/stores/theme'
import { RouterLink } from 'vue-router'

const theme = useThemeStore()

// 菜单项配置
const topMenu = [
  { name: 'Home', icon: '🏠', path: '/' }
]

const bottomMenu = [
  { name: 'Settings', icon: '⚙️', path: '/settings' },
  { 
    name: 'Collapse', 
    icon: '↔️', 
    action: () => theme.toggleMenu()
  }
]
</script>

<template>
  <nav class="side-menu" :class="{ collapsed: theme.isMenuCollapsed }" :style="{ width: theme.cssVariables['--menu-width'] }">
    <!-- 顶部菜单 -->
    <div class="menu-section top">
      <RouterLink 
        v-for="item in topMenu" 
        :key="item.path" 
        :to="item.path"
        class="menu-item"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="text" v-show="!theme.isMenuCollapsed">{{ item.name }}</span>
      </RouterLink>
    </div>

    <!-- 底部菜单 -->
    <div class="menu-section bottom">
      <template v-for="item in bottomMenu" :key="item.path">
        <RouterLink 
          v-if="item.path"
          :to="item.path"
          class="menu-item"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="text" v-show="!theme.isMenuCollapsed">{{ item.name }}</span>
        </RouterLink>
        <button
          v-else
          @click="item.action()"
          class="menu-item"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="text" v-show="!theme.isMenuCollapsed">{{ item.name }}</span>
        </button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.side-menu {
  position: fixed;
  height: 100vh;
  background: white;
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 100;
  min-width: 4rem;  /* 增加最小宽度保证折叠状态下的显示 */
  max-width: 18rem; /* 增加最大宽度限制 */
}

.menu-section {
  padding: 1rem 0.75rem 1rem 0.75rem;
  justify-content: center;
}

.top {
  flex: 1;
}

.bottom {
  border-top: 1px solid #eee;
}

.menu-item {
  display: flex;
  align-items: center;
  width: calc(100% - 1rem);
  max-width: 16rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  overflow: hidden;
}

.menu-item:hover {
  background: color-mix(in srgb, var(--primary-color) 10%, transparent);
}

.icon {
  font-size: 1.5rem;
  min-width: 1.5rem;
  flex-shrink: 0;
  margin-right: 0.75rem;
  text-align: center;
  transition: margin 0.3s ease;
}

/* 折叠状态样式 */
.side-menu.collapsed {
  .menu-item {
    padding: 0.75rem 0.5rem;
    justify-content: center;
    width: 100%;
    min-width: 2.5rem;
    display: flex !important; /* 强制flex布局 */
    height: 3rem; /* 固定高度 */
    box-sizing: border-box; /* 统一盒模型 */
  }

  button.menu-item {
    background: transparent; /* 重置按钮背景 */
    border: none; /* 移除默认边框 */
  }
  
  .icon {
    margin: 0;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    padding: 0 0.5rem;
  }
}

/* 移除overflow限制 */
.menu-item {
  overflow: visible;
}

.text {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 2.5rem);
}
</style>
