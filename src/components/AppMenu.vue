<script setup>
import { useThemeStore } from "@/stores/theme";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import HomeIcon from "@/assets/icons/home.svg";
import TestIcon from "@/assets/icons/test.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import CollapseIcon from "@/assets/icons/collapse.svg";

import { computed, onMounted } from "vue";
const themeStore = useThemeStore();

const { t } = useI18n();

// 响应式菜单项配置
const topMenu = computed(() => [
  { name: t("menu.home"), path: "/", icon: HomeIcon },
  { name: t("menu.test"), path: "/test", icon: TestIcon },
]);

const bottomMenu = computed(() => [
  { name: t("menu.settings"), path: "/settings", icon: SettingsIcon },
  {
    name: themeStore.isMenuCollapsed
      ? t("common.expand")
      : t("common.collapse"),
    action: themeStore.toggleMenu,
    icon: CollapseIcon,
  },
]);

// 监听语言变化事件
onMounted(() => {
  window.addEventListener("language-changed", () => {
    // 强制重新计算翻译
    themeStore.locale = themeStore.locale === "zh-CN" ? "en-US" : "zh-CN";
    themeStore.locale = themeStore.locale === "en-US" ? "zh-CN" : "en-US";
  });
});
</script>

<template>
  <nav
    class="side-menu"
    :class="{ collapsed: themeStore.isMenuCollapsed }"
    :style="{ width: themeStore.cssVariables['--menu-width'] }"
  >
    <!-- 顶部菜单 -->
    <div class="menu-section top">
      <RouterLink
        v-for="item in topMenu"
        :key="item.path"
        :to="item.path"
        class="menu-item"
      >
        <!-- 动态渲染图标 -->
        <component :is="item.icon" class="icon" />
        <span class="text" v-show="!themeStore.isMenuCollapsed">{{
          item.name
        }}</span>
      </RouterLink>
    </div>

    <!-- 底部菜单 -->
    <div class="menu-section bottom">
      <template v-for="item in bottomMenu" :key="item.path || item.name">
        <RouterLink v-if="item.path" :to="item.path" class="menu-item">
          <!-- 动态渲染图标 -->
          <component :is="item.icon" class="icon" />
          <span class="text" v-show="!themeStore.isMenuCollapsed">{{
            item.name
          }}</span>
        </RouterLink>
        <button v-else @click="item.action()" class="menu-item">
          <!-- 动态渲染图标 -->
          <component :is="item.icon" class="icon" />
          <span class="text" v-show="!themeStore.isMenuCollapsed">{{
            item.name
          }}</span>
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
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 100;
  min-width: 4rem; /* 增加最小宽度保证折叠状态下的显示 */
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
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  margin-right: 0.75rem;
  color: currentColor;
  stroke: currentColor;
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
