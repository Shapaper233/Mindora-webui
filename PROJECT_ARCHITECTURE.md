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
   sequenceDiagram
       index.html->>main.js: 加载入口文件
       main.js->>App.vue: 创建根组件
       App.vue->>AppLayout.vue: 初始化布局组件
       AppLayout.vue->>AppMenu.vue: 加载导航菜单
       AppLayout.vue->>RouterView: 渲染路由内容
       RouterView->>HomeView/SettingsView: 根据路由匹配组件
   ```

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
