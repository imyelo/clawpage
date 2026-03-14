# OpenClaw Chats Share

> 📤 Openclaw チャットで `/chats-share` と入力してください。会話は自分の URL の恒久的なページになります。GitHub Pages、Vercel、Netlify、または Cloudflare Pages にデプロイされます。

[English](/docs/guide/en/README.md) · [Español](/docs/guide/es/README.md) · [Français](/docs/guide/fr/README.md) · [中文](/docs/guide/zh/README.md) · [한국어](/docs/guide/ko/README.md)

手動エクスポート不要、コピペ不要。1つのコマンドでチャットが自分の URL でライブになります — タイトル、説明、機密データはあなたが代わりに処理されます。

## 📌 できること

- ⚡ 任意のチャットで `/chats-share` → 数分であなたの URL にライブページが公開
- 🚀 インフラ管理不要 — 純粋な静的サイト、GitHub Pages・Vercel・Netlify・Cloudflare Pages に無料デプロイ
- 🔀 公開前にレビュー — チャットごとに PR が作成され、何を公開するかをコントロール
- 🔒 プライベート共有 — 直接リンクで共有可能、公開インデックスにはデフォルトで表示されない
- 🛡️ 安全に共有 — 機密文字列をフラグすれば、エクスポート前に `[REDACTED]` に置き換えられる
- 🧠 完全な忠実性 — ツール呼び出しと思考トレースはタイムラインに保存され、削除されない

## ライブデモ 🚀

<a href="https://chats-share.yelo.ooo" target="_blank"><img src="../../../media/screenshot.png" alt="Screenshot of a chat page built with openclaw-chats-share" width="640" /></a>

または、数週間運営中のサイトを確認してください — 私たちも自分たちで使っています：[vibe.yelo.cc](https://vibe.yelo.cc)

## ⚡ クイックスタート

これをagentチャットにコピー＆ペーストしてください：

```
https://clawhub.ai/imyelo/chats-shareを読んでchats-share skillをインストールし、
その後初めての設定を実行してください。
```

## 🤖 Agentが設定中にやること

agentは私有GitHubリポジトリをスキャフォールドし、Pages URLで`chats-share.toml`を設定し、初期コミットをプッシュし、GitHub ActionsをPagesソースとして有効化し、`/chats-share`がすぐに動作するようにプロジェクトを登録します。完全なステップバイステップは [skills/chats-share/references/setup.md](../../../skills/chats-share/references/setup.md) を参照してください。

## 📤 チャットを共有する

設定が完了したら、任意のOpenclawチャットで `/chats-share` skillコマンドを使用してエクスポートします：

```
/chats-share
```

agentは以下を行います：

1. 🔍 エクスポートする現在のセッションを特定
2. ✅ タイトル、説明、公開設定（`public` / `private`）の確認を求める
3. 🔒 フラグした機密データを編集
4. 📝 新しいブランチ（`chat/{YYYYMMDD}-{slug}`）にYAMLファイルをワークリポジトリに書き込み
5. 🔀 Pull Requestを開くよう促す — `main`にマージするとGitHub Pagesビルドがトリガー

PRをマージすると、チャットは `https://your-domain/chats/{slug}` で公開されます。

> **⚠️ マージ前に確認：** AI による自動編集は100%確実ではありません。PR内の生成されたYAMLファイルを開き、見落とされた機密情報を手動で `[REDACTED]` に置き換えてください。詳細は [機密情報の保護方法](https://chats-share.yelo.ooo/share/how-to-protect-sensitive-info) をご覧ください。

> **💡 ヒント:** `visibility: private`（デフォルト）を設定すると、チャットは公開インデックスには表示されず、直接URLからのみアクセスできます。

## ⚙️ 仕組み

```
/chats-share
    │
    ▼
🤖 OpenClaw Skill
    │  1. 🔍 エクスポートするセッションを特定して確認
    │  2. 💬 メッセージ履歴を抽出
    │  3. 📝 メタデータ（タイトル、参加者、説明）を記述
    │  4. 🔒 機密データを編集
    │  5. 📄 データリポジトリにYAMLを書き込む
    │  6. 🔀 新しいブランチにプッシュ → PRを作成
    ▼
🚀 GitHub Pages
    └── https://your-domain/chats/{slug}
```

### 🌿 ブランチベースワークフロー

チャットはmainではなく新しいブランチ（`chat/{slug}`）にプッシュされ、マージ前にレビュー用のPRを作成するためのガイダンスが表示されます。

## 🏗️ リポジトリアーキテクチャ

このリポジトリは**公開テンプレート**です。実際のチャットデータは別の**私有ワークリポジトリ**に格納されます — これにより、テンプレートをデータ汚染なしにクリーンでfork可能な状態に保つことができます。

| リポジトリ | 公開設定 | 目的 |
|------|------------|---------|
| `openclaw-chats-share` | 公開 | テンプレート、パッケージ、Skill |
| `your-chats-share` | 私有 | 実際のチャットデータ |

## ⚡ 設定

webパッケージはワークリポジトリルートにある`chats-share.toml`で設定されます。

| キー | 型 | 説明 | 例 |
|-----|------|-------------|---------|
| `site` | string (URL) | デプロイしたサイトの完全なURL | `"https://you.github.io"` |
| `base` | string | GitHub Pagesプロジェクトサイトのベースパス | `"/my-repo"` |
| `public_dir` | string | 静的アセットディレクトリ（設定ファイルからの相対パス） | `"public"` |
| `out_dir` | string | ビルド出力ディレクトリ（設定ファイルからの相対パス） | `"dist"` |
| `chats_dir` | string | カスタムチャットディレクトリパス（絶対パスまたは設定ファイルからの相対パス） | `"../my-chats"` |
| `template.options.title` | string | ホームページタイトル | `"chats-share"` |
| `template.options.subtitle` | string | ホームページサブタイトル | `"// conversation archive"` |
| `template.options.description` | string | サイトのmeta description | `"My conversation archive"` |
| `template.options.footer` | string | フッターテキスト（Markdownサポート） | `` |
| `template.options.analytics.google_analytics_id` | string | Google Analytics 4 Measurement ID | `"G-XXXXXXXXXX"` |
| `template.options.promo.enabled` | boolean | ホームページにプロモーションブロックを表示して openclaw-chats-share を広める | `false` |

**例 `chats-share.toml`：**

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"

[template.options]
title = "chats-share"
subtitle = "// conversation archive"
footer = "powered by [@imyelo](https://github.com/imyelo)"

[template.options.promo]
enabled = true
```

Netlify、Vercel、Cloudflare Pages、またはカスタムドメインにデプロイする場合は、`site` に完全なURLを設定し、`base` を省略してください。

### 🚢 デプロイ

scaffoldには以下のプラットフォーム向けの設定ファイルが含まれています

- ✅ GitHub Pages
- ✅ Netlify
- ✅ Vercel
- ✅ Cloudflare Pages。

各プラットフォームの手順、カスタムドメインの設定、無料プランの制限については [docs/guide/ja/deployment.md](/docs/guide/ja/deployment.md) を参照してください。

## 📋 データ形式

チャットファイルはYAMLとしてワークリポジトリの`chats/`ディレクトリに保存されます。CLIによってOpenClawセッションJSONLファイル（`{id}.jsonl`）から生成されます。

**ファイル命名：** `YYYYMMDD-{slug}.yaml`

**トップレベルメタデータフィールド：**

| フィールド | 必須 | 説明 | 例 |
|-------|----------|-------------|---------|
| `title` | はい | セッションタイトル / エクスポート名 | `My Session` |
| `date` | はい | セッション日付 (YYYY-MM-DD) | `2026-02-15` |
| `sessionId` | はい | 一意のセッションID | `cf1f8dbe-2a12-47cf-8221-9fcbf0c47466` |
| `channel` | いいえ | チャンネル/プラットフォーム名 | `discord`, `telegram` |
| `model` | いいえ | セッションで使用されたモデル | `MiniMax-M2.5` |
| `totalMessages` | いいえ | メッセージ総数 | `42` |
| `totalTokens` | いいえ | 消費されたtoken総数 | `12345` |
| `tags` | いいえ | 分類用のタグ配列 | `[coding, debug]` |
| `visibility` | いいえ | インデックスの可視性 | `private` (デフォルト) |
| `description` | いいえ | インデックスの簡単な説明 | `Debugging a tricky async issue` |
| `defaultShowProcess` | いいえ | デフォルトでプロセス（思考、ツール呼び出し）を表示 | `false` |
| `participants` | いいえ | 参加者名を`{ role: "human" | "agent" }`にマッピング | 例を参照 |

**可視性：**
- `public` — ホームページのインデックスに表示
- `private` (デフォルト) — 直接URLからのみアクセス可能、インデックスからは隠される

`timeline:` キーはメッセージとイベントオブジェクトの順序付きリストを保持します。完全なスキーマは [docs/chats-share-data-format.md](/docs/chats-share-data-format.md) を参照してください。

**例ファイル：**

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

## 📦 パッケージ

### 📄 `openclaw-chats-share` (CLI)

OpenClaw `sessions/{uuid}.jsonl` 生JSONLファイルを解析し、YAML出力を生成します。

```bash
npx openclaw-chats-share parse <sessions/{uuid}.jsonl> [-o output.yaml]
```

### 🌐 `openclaw-chats-share-web`

Astroベースの静的サイトジェネレーター。チャットYAMLファイルを共有可能なページにレンダリングします。

```bash
npx openclaw-chats-share-web dev     # ローカル開発サーバー
npx openclaw-chats-share-web build   # 静的サイトをビルド
npx openclaw-chats-share-web preview # ローカルでビルド結果をプレビュー
```

### 🛠️ `create-openclaw-chats-share`

このテンプレートから新しいワークリポジトリを初期化するスキャフォールディングツール。

```bash
npx create-openclaw-chats-share <project-name>
```

## 🧑‍💻 開発

```bash
# 依存関係をインストール
bun install

# デモ開発サーバーを起動
bun run dev

# デモ静的サイトをビルド
bun run build

# デモをGitHub Pagesにデプロイ
bun run deploy
```

## 📜 リリース

このプロジェクトはバージョン管理と changelog 管理に [changesets](https://github.com/changesets/changesets) を使用しています。

```bash
# 新しい changeset を作成
bun run changeset

# changeset のステータスを確認
bunx changeset status

# バージョンアップをプレビュー（ドライラン）
bunx changeset version --dry-run

# バージョンアップを適用して changelog を更新
bun run version
```

### リリースワークフロー

1. PRをマージする前に changeset を作成: `bun run changeset`
2. 影響を受けるパッケージとバンプタイプ（patch/minor/major）を選択
3. 変更の説明を書く
4. changeset ファイルをPRと一緒にコミット
5. マージ後、changesets actionが"Version Packages"PRを作成
6. バージョンPRをマージするとnpm publishがトリガーされます

## 📁 プロジェクト構造

```
packages/
  cli/     - openclaw-chats-share CLI（セッションログ解析 + YAMLジェネレーター）
  web/     - openclaw-chats-share-web（Astro静的サイト）
    src/
      components/  - MessageHeader.astro, ChatMessage.astro, CollapsibleMessage.tsx, Footer.astro, MemoryBackground.astro
      lib/         - chats.ts, config.ts, config-schema.ts
      pages/       - index.astro, share/[slug].astro
  create/  - create-openclaw-chats-share スキャフォールディングツール
chats/     - デモ用YAMLチャットファイル
docs/      - プロジェクトドキュメント
skills/    - OpenClaw Skill定義
```

## 🌟 openclaw-chats-shareを使用したサイト

このツールで構築されたサイト：

- [Yelo](https://vibe.yelo.cc)
- あなたのサイト — [PRを提交](https://github.com/imyelo/openclaw-chats-share/edit/main/README.md)して追加！

## 📚 追加リソース

- 各プラットフォームのデプロイ手順、カスタムドメイン設定、無料プランの制限については [docs/guide/ja/deployment.md](/docs/guide/ja/deployment.md) を参照してください。
- 完全なfrontmatterフィールドとコンテンツ形式については [docs/chats-share-data-format.md](/docs/chats-share-data-format.md) を参照してください。

## ライセンス

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2026 - present
