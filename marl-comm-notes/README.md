# MARL 通信学习笔记

基于「Communication in Multi-Agent Reinforcement Learning」综述的交互式学习笔记站点。

## 如何打开

1. 直接用浏览器打开 `index.html` 即可（双击文件，或拖入浏览器窗口）。
2. 无需安装任何依赖，无需网络连接，纯静态本地站点。

> **推荐浏览器**：Chrome / Edge / Firefox 最新版。

## 目录结构

```
marl-comm-notes/
├── index.html                  # 主页（论文定位 + 章节导航）
├── styles.css                  # 统一样式
├── app.js                      # 交互逻辑（搜索、进度条、答案切换）
├── README.md                   # 本文件
└── pages/
    ├── nonstationarity.html    # 第1章：非平稳性与MARL基础
    ├── ctde.html               # 第2章：CTDE范式
    ├── communication.html      # 第3章：通信的三层作用
    ├── bandwidth.html          # 第4章：代理通信与带宽限制
    ├── symmetry.html           # 第5章：对称性与角色分工
    └── takeaways.html          # 第6章：终极总结
```

## 功能说明

| 功能 | 说明 |
|------|------|
| 左侧导航栏 | 固定侧边栏，包含完整章节目录 |
| 搜索 | 输入关键词过滤导航条目，并高亮页面内匹配文本 |
| 学习进度条 | 页面顶部蓝紫渐变条，随滚动更新 |
| 折叠概念块 | 每个核心概念用 `<details>` 包裹，可展开/收起 |
| 自测题 | 每节末尾的"查看答案"按钮，点击显示/隐藏参考答案 |
| 术语提示 | 关键术语悬停显示一句话解释（tooltip） |
| 页间导航 | 每页底部有"上一页/下一页"链接 |
| 移动端适配 | 窄屏幕下侧边栏可通过 ☰ 按钮切换 |

## 如何扩展

### 添加新页面

1. 在 `pages/` 下创建新 HTML 文件（如 `pages/new-topic.html`）。
2. 复制任意已有页面的骨架结构（`<head>` + sidebar + `<main>` + `<script>`）。
3. 在 **所有文件** 的 `<aside id="sidebar">` 的 `<nav><ul>` 中添加新条目：
   ```html
   <li><a href="new-topic.html">新主题名称</a></li>
   ```
   （index.html 中的路径为 `pages/new-topic.html`，pages/ 下文件中为 `new-topic.html`）
4. 在 `index.html` 的 `.chapter-grid` 中添加对应的卡片。

### 可用的 CSS 类

- `.concept-block` — 折叠概念块（配合 `<details>/<summary>`）
- `.analogy-box` — 绿色生活类比框
- `.example-box` — 橙色双智能体示例框
- `.key-insight` — 紫色核心洞察框
- `.quiz-section` / `.quiz-item` — 自测题区域
- `.term-tooltip` / `.tooltip-text` — 术语悬浮提示
- `.svg-container` — SVG 图表容器
- `.tag` + `.tag-info` / `.tag-key` / `.tag-analogy` / `.tag-example` / `.tag-warning` — 标签徽章

### 内容写作约定

- 中文为主，术语括号标注英文
- 每个概念 ≥1 个生活类比 + ≥1 个极简双智能体例子
- 避免公式推导，强调设计动机与机制链路
- SVG 内联在 HTML 中，不使用外部图片

## 技术栈

- 纯 HTML + CSS + Vanilla JS
- 零外部依赖
- 零构建步骤
