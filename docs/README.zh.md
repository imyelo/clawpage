# openclaw-chats-share

> 📤 一条命令将你的 OpenClaw 对话转换为精美的永久页面 — 自动部署到你的 GitHub Pages

一个将 OpenClaw 对话历史分享为静态网站的 monorepo。在聊天频道触发分享命令，即可获得一个永久公开可访问的页面 — 通过 GitHub Pages 自动构建和部署。

## 快速开始

复制粘贴到你的 agent 对话中：

```
阅读 https://clawhub.ai/imyelo/chats-share 并安装 chats-share skill，
然后帮我运行首次设置。
```

## Agent 会做什么

Agent 会搭建一个私有 GitHub 仓库，用你的 Pages URL 配置 `chats-share.toml`，推送初始提交，启用 GitHub Actions 作为 Pages 来源，并注册项目使 `/chats-share` 立即可用。完整步骤详见 [skills/chats-share/references/setup.md](skills/chats-share/references/setup.md)。

## 工作原理

```
/chats-share
    │
    ▼
OpenClaw Skill
    │  1. 定位并确认要导出的会话
    │  2. 提取消息历史
    │  3. 填充元数据（标题、参与者、描述）
    │  4. 脱敏敏感数据
    │  5. 写入 YAML 到你的数据仓库
    │  6. 推送到新分支 → 创建 PR
    ▼
GitHub Pages
    └── https://your-domain/share/{slug}
```

### 基于分支的工作流

对话被推送到新分支（`chat/{slug}`）而非 main，并提供指导在合并前创建 PR 进行审查。

## 仓库架构

此仓库是一个**公共模板**。你实际的聊天数据存放在另一个**私有工作仓库**中 — 这样可以保持模板干净、可fork而不会污染数据。

| 仓库 | 可见性 | 用途 |
|------|--------|------|
| `openclaw-chats-share` | 公共 | 模板、packages 和 Skill |
| `your-chats-share` | 私有 | 你实际的聊天数据 |

## Packages

### `openclaw-chats-share` (CLI)

解析 OpenClaw `sessions/{uuid}.jsonl` 原始 JSONL 文件并生成 YAML 输出。

```bash
npx openclaw-chats-share parse <sessions/{uuid}.jsonl> [-o output.yaml]
```

### `openclaw-chats-share-web`

基于 Astro 的静态网站生成器。将聊天 YAML 文件渲染为可分享的页面。

```bash
npx openclaw-chats-share-web dev     # 本地开发服务器
npx openclaw-chats-share-web build   # 构建静态网站
npx openclaw-chats-share-web preview # 本地预览构建结果
```

### `create-openclaw-chats-share`

脚手架工具从此模板初始化新的工作仓库。

```bash
npx create-openclaw-chats-share <project-name>
```

## 数据格式

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
| `participants` | 否 | 参与者名称映射到 `{ role: "human" \| "agent" }` | 见示例 |

**可见性：**
- `public` — 出现在首页索引中
- `private`（默认）— 仅可通过直接 URL 访问，索引中隐藏

`timeline:` 键保存消息和事件对象的有序列表。完整 schema 详见 [docs/chats-share-data-format.md](/docs/chats-share-data-format.md)。

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

## 配置

Web 包通过工作仓库根目录的 `chats-share.toml` 进行配置。

| 键 | 类型 | 描述 | 示例 |
|-----|------|------|------|
| `site` | string (URL) | 部署站点的完整 URL | `"https://you.github.io"` |
| `base` | string | GitHub Pages 项目站点的基础路径 | `"/my-repo"` |
| `public_dir` | string | 静态资源目录（相对于配置文件） | `"public"` |
| `out_dir` | string | 构建输出目录（相对于配置文件） | `"dist"` |
| `chats_dir` | string | 自定义聊天目录路径（绝对或相对于配置文件） | `"../my-chats"` |
| `template.options.title` | string | 首页标题 | `"chats-share"` |
| `template.options.subtitle` | string | 首页副标题 | `"// conversation archive"` |
| `template.options.description` | string | 站点 meta 描述 | `"My conversation archive"` |
| `template.options.footer` | string | 页脚文本（支持 Markdown） | `` |

**示例 `chats-share.toml`：**

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"

[template.options]
title = "chats-share"
subtitle = "// conversation archive"
footer = "powered by [@imyelo](https://github.com/imyelo)"
```

### 自定义域名（GitHub Pages）

如果想用自定义域名而非 `your-username.github.io` 来托管你的站点：

1. 在 `public/` 目录中添加包含你域名的 `CNAME` 文件：

   ```
   chats-share.example.com
   ```

2. 在 `chats-share.toml` 中将 `site` 设置为你的自定义域名：

   ```toml
   site = "https://chats-share.example.com"
   ```

3. 在 DNS 提供商处配置域名指向 GitHub Pages：
   - 对于根域名 (`example.com`): 添加指向 GitHub IP 的 A 记录
   - 对于子域名 (`chats-share.example.com`): 添加指向 `your-username.github.io` 的 CNAME 记录

4. DNS 生效后在 GitHub 仓库的 **Settings → Pages** 中启用 HTTPS。

> 使用自定义域名时，从 `chats-share.toml` 中省略 `base`（或设置为 `"/"`），因为站点从域名根目录提供服务。

另请参阅 [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) 了解详细的 GitHub Pages 自定义域名设置说明。

## 开发

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

## 发布

本项目使用 [changesets](https://github.com/changesets/changesets) 进行版本管理和变更日志管理。

```bash
# 创建新的 changeset
bun run changeset

# 检查 changeset 状态
bunx changeset status

# 预览版本升级（干跑）
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

## 项目结构

```
packages/
  cli/     - openclaw-chats-share CLI（会话日志解析器 + YAML 生成器）
  web/     - openclaw-chats-share-web（Astro 静态站点）
    src/
      components/  - MessageHeader.astro, ChatMessage.astro, CollapsibleMessage.tsx, Footer.astro, MemoryBackground.astro
      lib/         - chats.ts, config.ts, config-schema.ts
      pages/       - index.astro, share/[slug].astro
  create/  - create-openclaw-chats-share 脚手架工具
chats/     - 演示用 YAML 聊天文件
docs/      - 项目文档
skills/    - OpenClaw Skill 定义
```

## 使用 openclaw-chats-share 的站点

使用此工具构建的站点：

- [Yelo](https://vibe.yelo.cc)
- 你的站点 — 通过 [提交 PR](https://github.com/imyelo/openclaw-chats-share/edit/main/README.md) 添加！

## 更多资源

- 完整的前matter 字段和内容格式请参阅 [docs/chats-share-data-format.md](/docs/chats-share-data-format.md)。

## 许可证

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2026 - present
