# Vue3 Dashboard 项目架构说明

## 技术栈
- 核心框架：Vue3 + Composition API
- 构建工具：Vite 4.x
- 状态管理：Pinia
- 路由管理：Vue Router 4.x
- 样式处理：原生CSS
- 多语言支持：Vue I18n
- 图标方案：SVG Sprite

## 项目启动流程
1. 入口文件：`src/main.js`
   - 初始化Vue应用实例
   - 挂载全局配置：
     - 路由系统（src/router/index.js）
     - 状态管理（src/stores/theme.js）
     - 多语言配置（src/locales/）
   - 挂载根组件App.vue到DOM

2. 应用初始化阶段：
   ```mermaid
   graph TD
       A[index.html] --> B(main.js)
       B --> C[初始化Vue应用]
       C --> D[挂载全局配置]
       D --> D1[路由系统]
       D --> D2[状态管理]
       D --> D3[多语言配置]
       C --> E[注册全局组件]
       C --> F[加载环境变量]
       C --> G[注入CSS变量]
       C --> H[挂载根组件App.vue]
       H --> I[AppLayout布局初始化]
       I --> I1[导航菜单初始化]
       I --> I2[路由视图容器初始化]
       I2 --> J[路由匹配]
       J --> J1[HomeView]
       J --> J2[SettingsView]
       
       style A fill:#4CAF50,stroke:#388E3C
       style B fill:#2196F3,stroke:#1976D2
       style C fill:#9C27B0,stroke:#7B1FA2
   ```

   详细初始化步骤：
   1. 环境准备阶段
      - 加载Vite环境变量（import.meta.env）
      - 检测浏览器语言偏好
      - 初始化CSS自定义属性

   2. 核心模块挂载
      ```javascript
      // main.js 典型配置
      const app = createApp(App)
         .use(createPinia()) // 状态管理
         .use(router)       // 路由系统
         .use(i18n)         // 多语言
         .use(IconPlugin)   // SVG图标组件
      ```

   3. DOM挂载阶段
      - 检测#app容器存在性
      - 注入全局错误处理
      - 挂载前执行路由守卫
      - 调用mount('#app')

## 目录结构解析
```
vue3-dashboard/
├── public/            # 静态资源
├── src/
│   ├── assets/        # 项目资源文件
│   │   └── icons/     # SVG图标集
│   ├── components/    # 通用组件
│   │   ├── AppLayout.vue  # 基础布局组件
│   │   └── AppMenu.vue    # 导航菜单组件
│   ├── locales/       # 多语言配置
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── views/         # 路由页面组件
│   ├── App.vue        # 根组件
│   ├── main.js        # 应用入口
│   └── style.css     # 全局样式
├── vite.config.js     # Vite配置
└── package.json       # 项目依赖配置
```

## 核心模块说明

### 路由系统 (Vue Router)
- 路由配置：`src/router/index.js`
- 功能特性：
  - 基于hash的路由模式
  - 路由懒加载配置
  - 导航守卫集成
  - 多级路由支持

### 状态管理 (Pinia)
- 核心store：`src/stores/theme.js`
- 管理内容：
  - 应用主题配置
  - 颜色方案切换
  - 布局状态持久化

### 多语言实现
- 语言包：
  - `src/locales/en-US.js`
  - `src/locales/zh-CN.js`
- 实现方式：
  - 按需加载语言包
  - 通过Vue插件注入
  - 响应式语言切换

## 构建流程
1. 开发环境：
   ```bash
   npm run dev
   ```
   - Vite启动开发服务器
   - 实时HMR热更新
   - 按需编译ES模块

2. 生产构建：
   ```bash
   npm run build
   ```
   - Rollup打包优化
   - 代码压缩混淆
   - 静态资源哈希处理
   - 自动生成preload提示
