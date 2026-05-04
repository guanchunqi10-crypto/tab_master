# Chrome Web Store 发布指南

## Tab Master 发布流程

### 第一步：注册开发者账号

#### 1.1 访问开发者控制台
打开：https://chromewebstore.dev.google.com/

#### 1.2 登录 Google 账号
使用你的 Gmail 账号登录（如果没有，需要先注册）

#### 1.3 支付注册费（一次性 $5）
- 点击 "Pay $5.00 registration fee"
- 使用信用卡/借记卡支付（国内可用）
- ⚠️ **注意**：这是一次性费用，之后发布的插件不再收费

#### 1.4 完成开发者信息
- 填写开发者名称（会显示在插件商店）
- 选择开发者类型：个人 / 组织
- 填写地址信息（可选）

---

### 第二步：准备发布材料

#### 2.1 必需材料清单

| 材料 | 要求 | 说明 |
|------|------|------|
| **插件图标** | PNG，128x128px | ✅ 已准备 |
| **商店图标** | PNG，多尺寸 | ✅ 已准备 (16-512px) |
| **封面图片** | PNG，1280x800px | 可选，但建议添加 |
| **英文描述** | 300字以上 | 必须英文 |
| **简短描述** | 150字以内 | 英文 |
| **隐私政策** | URL 或文档 | 必须，说明数据使用 |
| **截图** | PNG/GIF，1300x866px | 至少1张，建议3-5张 |

#### 2.2 更新 manifest.json
```json
{
  "manifest_version": 3,
  "name": "Tab Master",
  "version": "1.0.0",
  "description": "Powerful tab management - search, group, recent tabs, instant access",
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

### 第三步：构建发布包

#### 3.1 重新构建
```bash
cd tab-master/frontend
npm run build
```

#### 3.2 打包 ZIP
```bash
cd dist
zip -r tab-master-v1.0.0.zip .
```

#### 3.3 检查 ZIP 内容
```
tab-master-v1.0.0.zip
├── manifest.json
├── index.html
├── assets/
│   ├── index-xxx.js
│   └── index-xxx.css
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

### 第四步：提交审核

#### 4.1 上传 ZIP
1. 打开 https://chromewebstore.dev.google.com/
2. 点击 "添加新的商品"
3. 上传 ZIP 文件

#### 4.2 填写商品信息

**必填项**：

1. **商店listing**
   - 语言：English (US)
   - 标题：Tab Master
   - 简短描述（≤150字）：
     ```
     Powerful tab management for Chrome. Search, group, and organize your tabs with ease.
     ```
   - 详细描述（≥300字）：
     ```
     Tab Master transforms your new tab into a productivity powerhouse.
     
     FEATURES:
     • Smart Tab Search - Find any tab instantly with fuzzy search
     • Auto Grouping - Tabs are automatically organized by domain
     • Manual Groups - Create custom groups to organize your workflow
     • Recent Tabs - Never lose a tab again with recent close history
     • Most Visited - Quick access to your top 10 most visited sites
     • Right-click Menu - Full tab management without leaving the page
     
     DESIGN:
     • Clean, modern interface
     • Fast and lightweight
     • Works offline
     
     PRIVACY:
     Tab Master only uses Chrome's built-in APIs. No data is sent to any server.
     Your tabs stay on your device.
     ```

2. **视觉资源**
   - 主图标：128x128 PNG ✅
   - 商店图标：512x512 PNG ✅
   - 截图：至少1张 1300x866 PNG
   - 宣传图（可选）：1400x560 PNG

3. **隐私政策**
   - 可以创建 GitHub Pages 页面托管隐私政策
   - 或者使用隐私政策生成器

4. **分类**
   - 类别：Productivity
   - 标签：tab, tabs, manager, organize, productivity

#### 4.3 发布设置

- **发布方式**：
  - "公开" - 所有人可见
  - "不公开" - 只有知道链接的人可见
  - "测试" - 最多100个测试用户

- **首次发布建议**：
  选择 "不公开" 或 "测试"，等审核通过后再改为公开

---

### 第五步：等待审核

#### 审核时长
- 通常：1-3 个工作日
- 首次提交：可能需要 3-7 天

#### 审核标准
Chrome 会检查：
- [ ] 功能是否正常工作
- [ ] 描述是否准确
- [ ] 图标是否符合要求
- [ ] 隐私政策是否完整
- [ ] 是否有违规内容

#### 常见被拒原因
1. 隐私政策缺失或不足
2. 功能描述与实际不符
3. 图标包含误导性内容
4. 截图质量差或包含敏感信息

---

### 第六步：发布成功

审核通过后：
1. 将发布状态改为 "公开"
2. 插件即可在 Chrome Web Store 搜索到
3. 分享链接：https://chrome.google.com/webstore/detail/[ITEM_ID]

---

## 图标存放位置

已生成的图标位于：
```
frontend/public/icons/chrome-store/
├── icon16.png
├── icon32.png
├── icon48.png
├── icon64.png
├── icon96.png
├── icon128.png
├── icon256.png
├── icon512.png  (商店图标)
└── icon.png
```

---

## 常见问题

### Q: 需要公司账号吗？
A: 不需要，个人账号即可发布。

### Q: $5 费用可以用支付宝吗？
A: 不可以，只支持信用卡/借记卡。

### Q: 插件需要包含源代码吗？
A: 不需要，Chrome Web Store 只需要打包好的文件。

### Q: 审核被拒了怎么办？
A: 查看拒绝原因，按要求修改后重新提交。

### Q: 如何更新插件？
A: 在开发者控制台编辑已有商品，上传新版本 ZIP 即可。

---

## 快速检查清单

发布前确认：
- [ ] manifest.json 完整无误
- [ ] 图标都是 PNG 格式
- [ ] 英文描述 ≥300 字
- [ ] 隐私政策已准备
- [ ] 至少1张截图
- [ ] ZIP 包已准备好
