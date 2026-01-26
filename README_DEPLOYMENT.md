# Bangumi Tracker - 部署指南

## 项目概述

这是一个基于 Vite + React + TypeScript + Tailwind CSS 的 Bangumi 追番网站，用于展示和管理用户的番剧收藏。

## 新增功能

### 1. Vercel 部署支持
项目已优化以支持在 Vercel 平台上部署：
- 添加了 `vercel.json` 配置文件
- 添加了 `.vercelignore` 文件
- 优化了 `vite.config.ts` 构建配置
- 配置了代码分割以优化加载性能

### 2. 时间线视图
新增了时间线视图功能，提供更直观的番剧观看历史展示：
- 按年月分组显示番剧记录
- 垂直时间轴设计，清晰展示时间流
- 显示封面、标题、状态、评分、更新时间等信息
- 支持点击卡片查看详情
- 平滑的动画效果和响应式设计

## 部署到 Vercel

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 在项目目录下运行：
```bash
vercel
```

3. 按照提示完成部署配置

### 方法二：通过 Vercel 网站

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. Vercel 会自动检测到 Vite 项目并使用正确的配置
5. 点击 "Deploy" 开始部署

### 方法三：通过 GitHub 集成

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中连接你的 GitHub 账户
3. 选择仓库并导入
4. Vercel 会自动部署，并在每次推送时自动更新

## 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: Framer Motion
- **数据获取**: TanStack Query
- **路由**: React Router
- **日期处理**: date-fns
- **图表**: Recharts

## 项目结构

```
anime-watchlist-refresh-main/
├── src/
│   ├── components/       # React 组件
│   │   ├── ui/          # shadcn/ui 组件
│   │   ├── AnimeCard.tsx
│   │   ├── AnimeGrid.tsx
│   │   ├── TimelineView.tsx  # 新增：时间线视图
│   │   └── ...
│   ├── hooks/           # 自定义 Hooks
│   ├── pages/           # 页面组件
│   ├── services/        # API 服务
│   ├── types/           # TypeScript 类型定义
│   └── lib/             # 工具函数
├── public/              # 静态资源
├── vercel.json          # 新增：Vercel 配置
├── .vercelignore        # 新增：Vercel 忽略文件
└── vite.config.ts       # 优化：Vite 配置

```

## 功能特性

1. **用户收藏展示**：展示用户的番剧收藏列表
2. **多种视图模式**：
   - 网格视图：卡片式展示
   - 时间线视图：按时间轴展示（新增）
   - 数据统计：图表分析
3. **筛选和搜索**：按状态筛选、关键词搜索、多种排序方式
4. **主题切换**：5种精美主题可选
5. **响应式设计**：完美适配各种设备
6. **动画效果**：流畅的过渡和交互动画

## 环境要求

- Node.js >= 18
- npm >= 9

## 注意事项

1. 项目使用 Bangumi API，请遵守 API 使用规范
2. 首次加载可能需要一些时间来获取数据
3. 建议使用现代浏览器以获得最佳体验

## 许可证

本项目仅供学习和个人使用。
