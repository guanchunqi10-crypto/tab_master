# Tab Master 前端

强大的 Chrome New Tab 插件，支持 Tab 搜索、分组管理、最近关闭、最常访问等功能。

## 环境要求

- Node.js >= 18
- npm >= 9

## 启动步骤

```bash
cd frontend
npm install
npm run dev
```

访问地址：http://localhost:5173

## 接口配置

本项目为 Chrome 扩展插件，无需后端接口。

所有数据通过 Chrome Extension API 获取：
- `chrome.tabs.query()` - 获取 Tab 列表
- `chrome.storage.local` - 存储用户分组、最近关闭等数据

## 开发说明

### 项目结构

```
src/
├── components/     # React 组件
│   ├── SearchBar.jsx      # 搜索栏
│   ├── TabCard.jsx        # Tab卡片
│   ├── GroupHeader.jsx    # 分组标题
│   ├── GroupSection.jsx   # 分组区域
│   ├── BottomBar.jsx      # 底部工具栏
│   ├── ContextMenu.jsx    # 右键菜单
│   ├── Modal.jsx          # 弹窗
│   ├── EmptyState.jsx     # 空状态
│   ├── Skeleton.jsx       # 骨架屏
│   └── Toast.jsx          # Toast提示
├── hooks/          # 自定义Hooks
├── services/       # Chrome API封装
├── App.jsx         # 主页面
└── main.jsx        # 入口文件
```

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 安装到 Chrome

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `dist/` 目录

## 功能特性

- [x] Tab 列表展示（按分组折叠）
- [x] 关键词搜索（防抖 300ms）
- [x] 自动域名分组
- [x] 手动分组（拖拽移动）
- [x] Tab 跳转和关闭
- [x] 分组操作（展开/折叠/重命名/删除/合并）
- [x] 最近关闭（最多 20 条，仅保留当天）
- [x] 最常访问（Top 10）
- [x] 右键菜单
- [x] 空状态和加载状态
- [x] Toast 提示
- [x] 响应式布局
