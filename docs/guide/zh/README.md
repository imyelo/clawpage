<div align="center">

# Clawpage

**在 Openclaw 中输入 `/clawpage`，将历史对话变成精美的网页。**<br />
**已集成 GitHub Pages、Vercel、Netlify 及 Cloudflare Pages 部署。**

<img src="../../../media/info-card.svg" alt="Clawpage Info Card">

[English](/docs/guide/en/README.md) · [Español](/docs/guide/es/README.md) · [Français](/docs/guide/fr/README.md) · [日本語](/docs/guide/ja/README.md) · [한국어](/docs/guide/ko/README.md)

✨ **无需手动导出，无需复制粘贴，敏感数据自动脱敏**

</div>

## 为什么？

与 AI 的对话里常常藏着好想法、难得的思路，但它们会消失。 Clawpage 把它们变成可以保存和发布的内容。

## 实时演示 🚀

<a href="https://clawpage.yelo.ooo/chats/building-a-conversation-sharing-tool" target="_blank"><img src="../../../media/screenshot.png" alt="Screenshot of a chat page built with clawpage" width="640" /></a>

或者看看我们实际在用的站点：[vibe.yelo.cc](https://vibe.yelo.cc)

## 📌 功能特性

- ⚡ **基于 Skills** - 在聊天中随时输入 `/clawpage` 开始分享
- 🕐 **任意会话** — 不仅支持当前对话，还可以通过 ID / 关键词导出任意历史会话
- 🚀 **无需服务器** — 纯静态，免费部署到 GitHub Pages、Vercel、Netlify 或 Cloudflare Pages
- 🔀 **发布前先审查** — 每次导出都会创建一个 PR，让你在合并前审核内容
- 🔒 **私密分享** — 通过直达链接分享，默认不出现在公开索引中
- 🛡️ **安全分享** — AI 辅助脱敏，在导出时自动将敏感数据替换为 `[REDACTED]`
- 🧠 **完整保真** — 工具调用和思考轨迹也都完整保留在时间线中

## ⚡ 快速开始

复制粘贴到你的 agent 对话中：

```
阅读 https://clawhub.ai/imyelo/clawpage 并安装 clawpage skill，
然后帮我运行首次设置。
```

### 🤖 Agent 在设置期间做什么

Agent 会搭建一个私有 GitHub 仓库，用你的 Pages URL 配置 `clawpage.toml`，推送初始提交，启用 GitHub Actions 作为 Pages 来源，并注册项目使 `/clawpage` 立即可用。完整步骤详见 [skills/clawpage/references/setup.md](../../../skills/clawpage/references/setup.md)。

## 📤 分享对话

设置完成后，在任何 Openclaw 聊天中使用 `/clawpage` skill 命令来导出：

```
/clawpage
```

Agent 会：

1. 🔍 定位要导出的会话 — 默认为当前对话；也可通过 ID 或关键词选取任意历史会话
2. ✅ 请你确认标题、描述和可见性（`public` / `private`）
3. 🔒 将你标记的敏感数据脱敏
4. 📝 将 YAML 文件写入工作仓库的新分支（`chat/{YYYYMMDD}-{slug}`）
5. 🔀 提示你创建 Pull Request — 合并到 `main` 会触发 GitHub Pages 构建

PR 合并后，你们的对话将在 `https://your-domain/chats/{slug}` 上线。

> **⚠️ 注意：** AI 自动脱敏并非 100% 可靠。请在 PR 中检查 YAML 文件，将遗漏的敏感内容手动替换为 `[REDACTED]`。详情请参阅 [如何保护敏感信息](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info)。

> **💡 提示：** 设置 `visibility: private`（默认）可以让聊天仅通过直接链接访问，而不会出现在公开索引页面上。

## ⚙️ 工作原理

```
/clawpage
    │
    ▼
🤖 OpenClaw Skill
    │  1. 🔍 定位会话（当前或历史）→ 确认
    │  2. 💬 提取消息历史
    │  3. 📝 填充元数据（标题、参与者、描述）
    │  4. 🔒 脱敏敏感数据
    │  5. 📄 写入 YAML 到你的数据仓库
    │  6. 🔀 推送到新分支 → 创建 PR
    ▼
🚀 GitHub Pages
    └── https://your-domain/chats/{slug}
```

### 🌿 基于分支的工作流

对话会推送到新分支（`chat/{slug}`）而不是 main，合并前你可以先创建 PR 进行审查。

## 🏗️ 仓库架构

此仓库是一个**公共模板**。你实际的聊天数据存放在另一个**私有工作仓库**中 — 这样可以保持模板整洁、便于 fork，同时避免数据污染。

| 仓库 | 可见性 | 用途 |
|------|--------|------|
| `clawpage` | 公共 | 模板、packages 和 Skill |
| `your-clawpage` | 私有 | 你实际的聊天数据 |

## ⚡ 配置

Web 包通过工作仓库根目录的 `clawpage.toml` 进行配置。

| 键 | 类型 | 描述 | 示例 |
|-----|------|------|------|
| `site` | string (URL) | 部署站点的完整 URL | `"https://you.github.io"` |
| `base` | string | 站点不在域名根路径下时使用的基础路径 | `"/my-repo"` |
| `public_dir` | string | 静态资源目录（相对于配置文件） | `"public"` |
| `out_dir` | string | 构建输出目录（相对于配置文件） | `"dist"` |
| `chats_dir` | string | 自定义聊天目录路径（绝对或相对于配置文件） | `"../my-chats"` |
| `template.options.title` | string | 首页标题 | `"clawpage"` |
| `template.options.subtitle` | string | 首页副标题 | `"// conversation archive"` |
| `template.options.description` | string | 站点 meta 描述 | `"My conversation archive"` |
| `template.options.footer` | string | 页脚文本（支持 Markdown） | `` |
| `template.options.analytics.google_analytics_id` | string | Google Analytics 4 Measurement ID | `"G-XXXXXXXXXX"` |
| `template.options.promo.enabled` | boolean | 在首页显示推广区块，帮助传播 clawpage | `false` |

**示例 `clawpage.toml`：**

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"

[template.options]
title = "clawpage"
subtitle = "// conversation archive"
footer = "powered by [@imyelo](https://github.com/imyelo)"

[template.options.promo]
enabled = true
```

部署到 Netlify、Vercel、Cloudflare Pages 或自定义域名时，将 `site` 设置为完整 URL 并省略 `base`。

### 🚢 部署

脚手架已包含以下平台的配置文件

- ✅ GitHub Pages
- ✅ Netlify
- ✅ Vercel
- ✅ Cloudflare Pages。

各平台的逐步说明、自定义域名配置和免费层限制，请参阅 [docs/guide/zh/deployment.md](/docs/guide/zh/deployment.md)。

## 📋 数据格式

聊天文件以 YAML 格式存储在工作仓库的 `chats/` 目录下。由 CLI 从 OpenClaw 会话 JSONL 文件（`{id}.jsonl`）生成。

**文件命名：** `YYYYMMDD-{slug}.yaml`

**顶层元数据字段：**

| 字段 | 必填 | 描述 | 示例 |
|-------|------|------|------|
| `title` | 是 | 会话标题 / 导出名称 | `My Session` |
| `date` | 是 | 会话日期 (YYYY-MM-DD) | `2026-02-15` |
| `sessionId` | 是 | 唯一会话 ID | `cf1f8dbe-2a12-47cf-8221-9fcbf0c47466` |
| `channel` | 否 | 频道/平台名称 | `discord`, `telegram` |
| `model` | 否 | 会话使用的模型 | `MiniMax-M2.5` |
| `totalMessages` | 否 | 消息总数 | `42` |
| `totalTokens` | 否 | 消耗的 token 总数 | `12345` |
| `tags` | 否 | 用于分类的标签数组 | `[coding, debug]` |
| `visibility` | 否 | 索引可见性 | `private`（默认） |
| `description` | 否 | 索引简短描述 | `Debugging a tricky async issue` |
| `defaultShowProcess` | 否 | 默认显示过程（思考、工具调用） | `false` |
| `participants` | 否 | 参与者名称映射到 `{ role: "human" | "agent" }` | 见示例 |

**可见性：**
- `public` — 出现在首页索引中
- `private`（默认）— 仅可通过直接 URL 访问，索引中隐藏

`timeline:` 键保存消息和事件对象的有序列表。完整 schema 详见 [docs/clawpage-data-format.md](/docs/clawpage-data-format.md)。

**示例文件：**

```yaml
title: Debugging Async Issue
date: 2026-02-15
sessionId: cf1f8dbe-2a12-47cf-8221-9fcbf0c47466
model: MiniMax-M2.5
totalMessages: 4
totalTokens: 12345
visibility: public
defaultShowProcess: false
participants:
  Alice:
    role: human
  Claude:
    role: agent

timeline:
  - type: message
    role: human
    speaker: Alice
    timestamp: "2026-02-15T06:13:50.514Z"
    content: |
      Message content...

  - type: message
    role: agent
    speaker: Claude
    timestamp: "2026-02-15T06:14:05.123Z"
    model: claude-sonnet-4-6
    content: |
      Response content...
```

## 📦 Packages

### 📄 `clawpage` (CLI)

解析 OpenClaw `sessions/{uuid}.jsonl` 原始 JSONL 文件并生成 YAML 输出。

```bash
npx clawpage parse <sessions/{uuid}.jsonl> [-o output.yaml]
```

### 🌐 `clawpage-web`

基于 Astro 的静态网站生成器。将聊天 YAML 文件渲染为可分享的页面。

```bash
npx clawpage-web dev     # 本地开发服务器
npx clawpage-web build   # 构建静态网站
npx clawpage-web preview # 本地预览构建结果
```

### 🛠️ `create-clawpage`

脚手架工具从此模板初始化新的工作仓库。

生成的项目已包含 GitHub Pages、Netlify、Vercel 和 Cloudflare Pages 的部署配置——选择你使用的平台即可。

```bash
npx create-clawpage <project-name>
```

## 🧑‍💻 开发

```bash
# 安装依赖
bun install

# 启动演示开发服务器
bun run dev

# 构建演示静态网站
bun run build

# 部署演示到 GitHub Pages
bun run deploy
```

## 📜 发布

本项目使用 [changesets](https://github.com/changesets/changesets) 来管理版本和变更日志。

```bash
# 创建新的 changeset
bun run changeset

# 检查 changeset 状态
bunx changeset status

# 预览版本变动（模拟运行）
bunx changeset version --dry-run

# 应用版本升级并更新变更日志
bun run version
```

### 发布流程

1. 合并 PR 前创建 changeset：`bun run changeset`
2. 选择受影响的包和升级类型（patch/minor/major）
3. 描述变更内容
4. 将 changeset 文件与 PR 一起提交
5. 合并后，changesets action 会创建一个 "Version Packages" PR
6. 合并版本 PR 触发 npm 发布

## 📁 项目结构

```
packages/
  cli/     - clawpage CLI（会话日志解析器 + YAML 生成器）
  web/     - clawpage-web（Astro 静态站点）
    src/
      components/  - MessageHeader.astro, ChatMessage.astro, CollapsibleMessage.tsx, Footer.astro, MemoryBackground.astro
      lib/         - chats.ts, config.ts, config-schema.ts
      pages/       - index.astro, chats/[slug].astro
  create/  - create-clawpage 脚手架工具
chats/     - 演示用 YAML 聊天文件
docs/      - 项目文档
skills/    - OpenClaw Skill 定义
```

## 🌟 使用 clawpage 的站点

使用此工具构建的站点：

- [Yelo](https://vibe.yelo.cc)
- 你的站点 — 通过 [提交 PR](https://github.com/imyelo/clawpage/edit/main/README.md) 添加

## 📚 更多资源

- 各平台的部署说明、自定义域名配置和免费层限制，请参阅 [docs/guide/zh/deployment.md](/docs/guide/zh/deployment.md)。
- 完整的 frontmatter 字段和内容格式请参阅 [docs/clawpage-data-format.md](/docs/clawpage-data-format.md)。

## 许可证

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2026 - present
