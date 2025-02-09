<script setup>
// 导入主布局组件
// 提供包含导航菜单和内容区域的基础布局结构
import AppLayout from '@/components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <!-- 路由视图容器 -->
    <!-- 使用Vue Router提供的路由视图组件 -->
    <!-- v-slot获取当前路由组件，配合transition实现页面切换动画 -->
    <router-view v-slot="{ Component }">
      <!-- 渐隐渐显过渡动画 -->
      <!-- name: 定义动画类名前缀 -->
      <!-- mode="out-in": 确保当前元素先离开，新元素再进入 -->
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
</template>

<style>
/* 全局过渡动画配置 */
/* 入场和离场动画激活时的样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease; /* 透明度过渡效果，持续时间0.3秒，缓动函数 */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
