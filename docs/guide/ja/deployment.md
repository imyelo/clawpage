# デプロイガイド

scaffoldにはすべてのサポートプラットフォーム向けの設定ファイルが含まれています。ご利用のホスティングに合ったものを選び、以下の手順に従ってください。

> **プライベートリポジトリに関する注意：** チャット内の機密情報を保護するために、リポジトリを**プライベート**に保つことをベストプラクティスとして推奨します — [機密情報の保護方法](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info/)を参照してください。ただし、GitHub Pagesでプライベートリポジトリからデプロイするには**Proプラン以上**が必要です。リポジトリがプライベートでGitHub無料プランをご利用の場合は、Netlify、Vercel、またはCloudflare Pagesをご利用ください — 3つとも無料プランでプライベートリポジトリをサポートしています。

---

## GitHub Pages

付属の `.github/workflows/deploy.yml` を使用します。`main` へのプッシュごとにサイトをビルドし、[peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) を通じて `gh-pages` ブランチに公開します。

**無料プランの制限：** 公開サイトは1 GB以下；帯域幅は100 GB/月のソフトリミット。商用利用は不可。

**手順：**

1. プロジェクトをGitHubリポジトリにプッシュします。
2. リポジトリの **Settings → Pages** に移動します。
3. **Source** を `Deploy from a branch`、ブランチ `gh-pages`、フォルダ `/ (root)` に設定します。
4. `main` にコミットをプッシュします — ワークフローが自動実行され、サイトが `https://<ユーザー名>.github.io/<repo>/` で公開されます。

**設定：** GitHub Pages URLに合わせて `clawpage.toml` に `site` と `base` を設定します：

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"
```

ユーザー/組織サイト（`<ユーザー名>.github.io`）またはカスタムドメインを使用する場合、`base` は省略できます。

**カスタムドメイン：**

1. `public/` ディレクトリにドメインを記載した `CNAME` ファイルを追加します（例：`chats.example.com`）。
2. DNSプロバイダーで、サブドメインを `<ユーザー名>.github.io` に向ける `CNAME` レコードを追加します。
3. **Settings → Pages** でカスタムドメインを入力し、証明書が発行されたら **Enforce HTTPS** を有効化します。
4. `clawpage.toml` から `base` を削除し、`site` をカスタムドメインに更新します。

---

## Netlify

付属の `netlify.toml` を使用します。NetlifyはBunを自動的に検出します。

**無料プランの制限：** 帯域幅100 GB/月、ビルド時間300分/月。いずれかの制限を超えると、その月の残り期間はサイトが停止します。プライベートリポジトリをサポート。商用利用可。

**手順：**

1. プロジェクトをGitリポジトリ（GitHub、GitLab、またはBitbucket）にプッシュします。
2. [Netlifyダッシュボード](https://app.netlify.com)で **Add new site → Import an existing project** をクリックします。
3. リポジトリを選択します。Netlifyが `netlify.toml` を読み込んでビルド設定を自動入力します — 手動設定は不要です。
4. **Deploy site** をクリックします。

サイトは `https://<サイト名>.netlify.app` で公開されます。

**カスタムドメイン：**

1. **Site settings → Domain management** で **Add a domain** をクリックし、ドメインを入力します。
2. Netlifyの指示に従ってDNSレコードを更新します（ネームサーバーをNetlifyに向けるか、提供された `A`/`CNAME` レコードをDNSプロバイダーに追加します）。
3. NetlifyがTLS証明書を自動で無料発行します。
4. `clawpage.toml` の `site` をカスタムドメインに更新し、`base` が設定されていれば削除します。

---

## Vercel

付属の `vercel.json` を使用します。

**無料プランの制限：** Hobbyプランは個人・非商用利用のみ。商用プロジェクトにはProプランが必要です。プライベートリポジトリをサポート。

**手順：**

1. プロジェクトをGitリポジトリにプッシュします。
2. [Vercelダッシュボード](https://vercel.com/new)で **Import Project** をクリックし、リポジトリを選択します。
3. Vercelが `vercel.json` を自動読み込みします — 手動設定は不要です。
4. **Deploy** をクリックします。

サイトは `https://<プロジェクト名>.vercel.app` で公開されます。

CLIからデプロイすることもできます：

```bash
npx vercel --prod
```

**カスタムドメイン：**

1. **Project settings → Domains** で **Add** をクリックし、ドメインを入力します。
2. Vercelの指示に従って、提供された `A` または `CNAME` レコードをDNSプロバイダーに追加します。
3. VercelがTLS証明書を自動で無料発行します。
4. `clawpage.toml` の `site` をカスタムドメインに更新し、`base` が設定されていれば削除します。

---

## Cloudflare Pages

付属の `wrangler.toml`（`pages_build_output_dir = "./dist"`）を使用します。

**無料プランの制限：** 500ビルド/月、帯域幅無制限。プライベートリポジトリをサポート。商用利用可。

### オプション A — Git統合（推奨）

1. [Cloudflareダッシュボード](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git** に移動します。
2. リポジトリを選択します。
3. 以下を設定します：
   - **Build command：** `bun run build`
   - **Build output directory：** `dist`
   - **Environment variable：** `BUN_VERSION = latest`
4. **Save and Deploy** をクリックします。

この方法では `wrangler.toml` は不要です — Cloudflareはダッシュボードからビルド設定を読み込みます。

### オプション B — Wrangler CLI

プロジェクトルートの `wrangler.toml` が、Wranglerベースのデプロイ用プロジェクト名と出力ディレクトリを設定します。

```bash
# Wranglerをインストール
npm install -g wrangler

# 認証
wrangler login

# ビルドしてデプロイ
bun run build
wrangler pages deploy ./dist --project-name=clawpage
```

初回実行時、WranglerがPagesプロジェクトを自動作成します。以降の実行では更新されます。

### カスタムドメイン

1. Pagesプロジェクトで **Custom domains → Set up a custom domain** に移動し、ドメインを入力します。
2. ドメインがすでにCloudflareにある場合、DNSレコードは自動追加されます。それ以外の場合は、提供された `CNAME` レコードをDNSプロバイダーに追加します。
3. CloudflareがTLS証明書を自動で無料発行します。
4. `clawpage.toml` の `site` をカスタムドメインに更新し、`base` が設定されていれば削除します。
