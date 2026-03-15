# 部署指南

脚手架已包含所有支持平台的配置文件。选择与你的托管服务匹配的平台，按照以下步骤操作。

> **关于私有仓库的说明：** 我们建议将仓库设为**私有**，以保护聊天中的敏感信息 — 参阅[如何保护敏感信息](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info/)。但是，GitHub Pages 从私有仓库部署需要 **Pro 计划或更高版本**。如果你的仓库是私有的且使用 GitHub 免费计划，请改用 Netlify、Vercel 或 Cloudflare Pages — 三者均在免费层支持私有仓库。

---

## GitHub Pages

使用内置的 `.github/workflows/deploy.yml`，每次推送到 `main` 时自动构建站点，并通过 [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) 发布到 `gh-pages` 分支。

**免费层限制：** 发布的站点不超过 1 GB；带宽软限制为 100 GB/月。不允许商业使用。

**步骤：**

1. 将项目推送到 GitHub 仓库。
2. 进入仓库的 **Settings → Pages**。
3. 将 **Source** 设置为 `Deploy from a branch`，分支选 `gh-pages`，文件夹选 `/ (root)`。
4. 推送一个 commit 到 `main` — 工作流自动运行，站点将在 `https://<用户名>.github.io/<repo>/` 上线。

**配置：** 在 `clawpage.toml` 中设置 `site` 和 `base` 以匹配你的 GitHub Pages URL：

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"
```

对于用户/组织站点（`<用户名>.github.io`）或使用自定义域名时，可以省略 `base`。

**自定义域名：**

1. 在 `public/` 目录中添加包含你域名的 `CNAME` 文件（例如 `chats.example.com`）。
2. 在 DNS 提供商处，添加一条 `CNAME` 记录将你的子域名指向 `<用户名>.github.io`。
3. 在 **Settings → Pages** 中填写自定义域名，证书签发后启用 **Enforce HTTPS**。
4. 从 `clawpage.toml` 中删除 `base`，并将 `site` 更新为你的自定义域名。

---

## Netlify

使用内置的 `netlify.toml`。Netlify 会自动检测 Bun。

**免费层限制：** 带宽 100 GB/月，构建时长 300 分钟/月。超出任一限制后，站点将在当月剩余时间内暂停。支持私有仓库。允许商业使用。

**步骤：**

1. 将项目推送到 Git 仓库（GitHub、GitLab 或 Bitbucket）。
2. 在 [Netlify 控制台](https://app.netlify.com) 点击 **Add new site → Import an existing project**。
3. 选择你的仓库。Netlify 读取 `netlify.toml` 并自动填写构建配置 — 无需手动配置。
4. 点击 **Deploy site**。

站点将在 `https://<站点名>.netlify.app` 上线。

**自定义域名：**

1. 在 **Site settings → Domain management** 点击 **Add a domain** 并填写域名。
2. 按照 Netlify 的指示更新 DNS 记录（将 nameserver 指向 Netlify，或在 DNS 提供商处添加提供的 `A`/`CNAME` 记录）。
3. Netlify 自动签发免费 TLS 证书。
4. 将 `clawpage.toml` 中的 `site` 更新为自定义域名，并删除 `base`（如已设置）。

---

## Vercel

使用内置的 `vercel.json`。

**免费层限制：** Hobby 计划仅供个人非商业使用。商业项目需要 Pro 计划。支持私有仓库。

**步骤：**

1. 将项目推送到 Git 仓库。
2. 在 [Vercel 控制台](https://vercel.com/new) 点击 **Import Project** 并选择你的仓库。
3. Vercel 自动读取 `vercel.json` — 无需手动配置。
4. 点击 **Deploy**。

站点将在 `https://<项目名>.vercel.app` 上线。

也可以通过 CLI 部署：

```bash
npx vercel --prod
```

**自定义域名：**

1. 在 **Project settings → Domains** 点击 **Add** 并填写域名。
2. 按照 Vercel 的指示在 DNS 提供商处添加提供的 `A` 或 `CNAME` 记录。
3. Vercel 自动签发免费 TLS 证书。
4. 将 `clawpage.toml` 中的 `site` 更新为自定义域名，并删除 `base`（如已设置）。

---

## Cloudflare Pages

使用内置的 `wrangler.toml`（`pages_build_output_dir = "./dist"`）。

**免费层限制：** 500 次构建/月，带宽不限。支持私有仓库。允许商业使用。

### 方案 A — Git 集成（推荐）

1. 前往 [Cloudflare 控制台](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**。
2. 选择你的仓库。
3. 配置：
   - **Build command：** `bun run build`
   - **Build output directory：** `dist`
   - **Environment variable：** `BUN_VERSION = latest`
4. 点击 **Save and Deploy**。

此方式无需 `wrangler.toml` — Cloudflare 从控制台读取构建配置。

### 方案 B — Wrangler CLI

项目根目录的 `wrangler.toml` 配置 Wrangler 部署所需的项目名称和输出目录。

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录认证
wrangler login

# 构建并部署
bun run build
wrangler pages deploy ./dist --project-name=clawpage
```

首次运行时，Wrangler 会自动创建 Pages 项目。后续运行将更新该项目。

### 自定义域名

1. 在你的 Pages 项目中，前往 **Custom domains → Set up a custom domain** 并填写域名。
2. 如果域名已在 Cloudflare 上，DNS 记录会自动添加。否则，在 DNS 提供商处添加提供的 `CNAME` 记录。
3. Cloudflare 自动签发免费 TLS 证书。
4. 将 `clawpage.toml` 中的 `site` 更新为自定义域名，并删除 `base`（如已设置）。
