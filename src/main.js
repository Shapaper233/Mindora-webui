import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import zhCN from '@/locales/zh-CN'
import enUS from '@/locales/en-US'
import './style.css'

// 获取持久化的语言设置
const savedLocale = localStorage.getItem('locale') || 'zh-CN';

// 国际化配置
const i18n = createI18n({
  legacy: false,
  locale: savedLocale, // 使用持久化的语言设置
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 创建应用实例
const app = createApp(App)
const pinia = createPinia()


// 挂载插件（按顺序）
app.use(pinia)    // 状态管理
app.use(router)   // 路由
app.use(i18n)     // 国际化

// 启动应用
app.mount('#app')
