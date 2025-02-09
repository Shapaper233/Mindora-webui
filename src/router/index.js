import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SettingsView from '@/views/SettingsView.vue'

// 应用路由配置
// 基础路由结构，包含页面过渡效果元数据
const routes = [
  /* 首页路由 */
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // 页面过渡动画配置
    meta: { transition: 'slide-fade' } // 使用slide-fade过渡效果
  },
  /* 设置页路由 */
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    // 统一使用相同的过渡效果
    meta: { transition: 'slide-fade' } 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
