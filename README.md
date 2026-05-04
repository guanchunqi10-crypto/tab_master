# Tab Master

<div align="center">

![Tab Master Icon](./frontend/public/icons/chrome-store/icon256.png)

**强大的 Chrome 新标签页插件 - 搜索、分组、最近关闭，一触即达**

[English](./README.md) | 中文

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/placeholder?style=for-the-badge)](placeholder)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/yourusername/tab-master/pulls)

</div>

---

## ✨ 功能特性

### 🔍 智能 Tab 搜索
- 支持标题和 URL 模糊搜索
- 300ms 防抖优化，快速响应

### 📁 自动分组
- 按域名自动将 Tab 分组
- 减少标签栏混乱

### 🎯 手动分组
- 创建自定义分组
- 拖拽移动 Tab
- 展开/折叠管理

### 🕐 最近关闭
- 恢复误关闭的 Tab
- 最多保存 20 条
- 只保留当天记录

### ⭐ 最常访问
- 快速访问 Top 10 常访站点
- 个性化快捷入口

### 🍰 随手开分类
- 智能识别一次性 Tab
- 一键批量关闭
- 保持标签页清爽

---

## 📸 截图

| 暗色主题 | 分类视图 |
|:---:|:---:|
| ![Dark Theme](./docs/screenshots/dark.png) | ![Categories](./docs/screenshots/categories.png) |

---

## 🚀 安装

### Chrome Web Store（推荐）

1. 访问 [Chrome Web Store](https://chrome.google.com/webstore/detail/tab-master)
2. 点击「添加至 Chrome」
3. 完成！

### 开发者模式安装

1. 下载 [最新版本](https://github.com/yourusername/tab-master/releases)
2. 解压 ZIP 文件
3. 打开 Chrome，访问 `chrome://extensions/`
4. 开启「开发者模式」
5. 点击「加载已解压的扩展程序」
6. 选择解压后的 `dist` 文件夹

---

## 🛠️ 开发

### 环境要求

- Node.js >= 18
- npm >= 9

### 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/tab-master.git
cd tab-master/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

---

## 🔒 隐私政策

Tab Master 尊重您的隐私。

**我们不收集、存储或传输任何个人数据。**

本插件仅使用 Chrome 原生 API：
- `chrome.tabs` - 获取和管理标签页
- `chrome.storage` - 本地存储用户数据

您的所有数据都保存在您的设备上，不会发送到任何服务器。

查看完整隐私政策：[Privacy Policy](./PRIVACY.md)

---

## 📄 许可证

[MIT License](./LICENSE)

---

## 🙏 致谢

- [React](https://react.dev/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Vite](https://vitejs.dev/) - 构建工具

---

## 📬 联系

- Issue: [GitHub Issues](https://github.com/yourusername/tab-master/issues)
- Email: your.email@example.com

---

<div align="center">

**如果你觉得 Tab Master 有用，请给我们一个 ⭐**

</div>
