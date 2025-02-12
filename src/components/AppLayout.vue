<script setup>
import { useThemeStore } from "@/stores/theme";
import AppMenu from "./AppMenu.vue";
import { useRouter } from "vue-router";

const theme = useThemeStore();
const router = useRouter();
</script>

<template>
  <div
    class="app-container"
    :style="theme.cssVariables"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- 侧边菜单 -->
    <AppMenu />

    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
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
  margin-left: var(--menu-width, 240px); /* 添加默认值 */
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 4rem);
  overflow-y: auto;
}

/* RTL布局支持 */
[dir="rtl"] .main-content {
  margin-left: 0;
  margin-right: var(--menu-width, 240px);
}
</style>
