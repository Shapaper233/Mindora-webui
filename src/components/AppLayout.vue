<script setup>
import { useThemeStore } from '@/stores/theme'
import AppMenu from './AppMenu.vue'

const theme = useThemeStore()
</script>

<template>
  <div class="app-container" :style="theme.cssVariables">
    <!-- 侧边菜单 -->
    <AppMenu />
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--background-color, #f8f9fa);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-left: var(--menu-width);
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 4rem);
  overflow-y: auto;
}
</style>
