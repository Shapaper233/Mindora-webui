// 核心依赖导入
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// 创建应用实例
const app = createApp(App)
const pinia = createPinia()

// 挂载插件
app.use(pinia)  // 先挂载状态管理
app.use(router) // 再挂载路由

// 启动应用
app.mount('#app')
