# 배포 가이드

scaffold에는 지원되는 모든 플랫폼의 설정 파일이 포함되어 있습니다. 사용 중인 호스팅에 맞는 플랫폼을 선택하고 아래 단계를 따르세요.

> ⚠️ **비공개 저장소에 대한 참고 사항:** 채팅 내 민감한 정보를 보호하기 위해 저장소를 **비공개**로 유지하는 것을 권장합니다 — [민감한 정보 보호 방법](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info/)을 참조하세요. 단, GitHub Pages에서 비공개 저장소로 배포하려면 **Pro 플랜 이상**이 필요합니다. 저장소가 비공개이고 GitHub 무료 플랜을 사용 중이라면 Netlify, Vercel, 또는 Cloudflare Pages를 사용하세요 — 세 플랫폼 모두 무료 티어에서 비공개 저장소를 지원합니다.

---

## GitHub Pages

포함된 `.github/workflows/deploy.yml`을 사용합니다. `main`에 푸시할 때마다 사이트를 빌드하고 [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)를 통해 `gh-pages` 브랜치에 게시합니다.

**무료 티어 제한:** 게시된 사이트는 1 GB 이하여야 하며, 대역폭 소프트 제한은 월 100 GB입니다. 상업적 사용은 허용되지 않습니다.

**단계:**

1. 프로젝트를 GitHub 저장소에 푸시합니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Source**를 `Deploy from a branch`, 브랜치 `gh-pages`, 폴더 `/ (root)`로 설정합니다.
4. `main`에 커밋을 푸시합니다 — 워크플로우가 자동으로 실행되고 사이트가 `https://<사용자명>.github.io/<repo>/`에 공개됩니다.

**설정:** GitHub Pages URL에 맞게 `clawpage.toml`에 `site`와 `base`를 설정합니다:

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"
```

사용자/조직 사이트(`<사용자명>.github.io`)이거나 사용자 정의 도메인을 사용할 때는 `base`를 생략할 수 있습니다.

**사용자 정의 도메인:**

1. `public/` 디렉터리에 도메인이 포함된 `CNAME` 파일을 추가합니다 (예: `chats.example.com`).
2. DNS 공급자에서 서브도메인을 `<사용자명>.github.io`로 가리키는 `CNAME` 레코드를 추가합니다.
3. **Settings → Pages**에서 사용자 정의 도메인을 입력하고, 인증서가 발급되면 **Enforce HTTPS**를 활성화합니다.
4. `clawpage.toml`에서 `base`를 제거하고 `site`를 사용자 정의 도메인으로 업데이트합니다.

---

## Netlify

포함된 `netlify.toml`을 사용합니다. Netlify는 Bun을 자동으로 감지합니다.

**무료 티어 제한:** 대역폭 월 100 GB, 빌드 시간 월 300분. 둘 중 하나라도 초과하면 해당 월 나머지 기간 동안 사이트가 일시 중단됩니다. 비공개 저장소를 지원합니다. 상업적 사용이 허용됩니다.

**단계:**

1. 프로젝트를 Git 저장소(GitHub, GitLab, 또는 Bitbucket)에 푸시합니다.
2. [Netlify 대시보드](https://app.netlify.com)에서 **Add new site → Import an existing project**를 클릭합니다.
3. 저장소를 선택합니다. Netlify가 `netlify.toml`을 읽어 빌드 설정을 자동으로 채웁니다 — 수동 설정이 필요 없습니다.
4. **Deploy site**를 클릭합니다.

사이트는 `https://<사이트명>.netlify.app`에 공개됩니다.

**사용자 정의 도메인:**

1. **Site settings → Domain management**에서 **Add a domain**을 클릭하고 도메인을 입력합니다.
2. Netlify의 지침에 따라 DNS 레코드를 업데이트합니다 (네임서버를 Netlify로 지정하거나, DNS 공급자에 제공된 `A`/`CNAME` 레코드를 추가합니다).
3. Netlify가 무료 TLS 인증서를 자동으로 발급합니다.
4. `clawpage.toml`의 `site`를 사용자 정의 도메인으로 업데이트하고, `base`가 설정된 경우 제거합니다.

---

## Vercel

포함된 `vercel.json`을 사용합니다.

**무료 티어 제한:** Hobby 플랜은 개인 비상업적 용도 전용입니다. 상업 프로젝트는 Pro 플랜이 필요합니다. 비공개 저장소를 지원합니다.

**단계:**

1. 프로젝트를 Git 저장소에 푸시합니다.
2. [Vercel 대시보드](https://vercel.com/new)에서 **Import Project**를 클릭하고 저장소를 선택합니다.
3. Vercel이 `vercel.json`을 자동으로 읽습니다 — 수동 설정이 필요 없습니다.
4. **Deploy**를 클릭합니다.

사이트는 `https://<프로젝트명>.vercel.app`에 공개됩니다.

CLI로도 배포할 수 있습니다:

```bash
npx vercel --prod
```

**사용자 정의 도메인:**

1. **Project settings → Domains**에서 **Add**를 클릭하고 도메인을 입력합니다.
2. Vercel의 지침에 따라 DNS 공급자에 제공된 `A` 또는 `CNAME` 레코드를 추가합니다.
3. Vercel이 무료 TLS 인증서를 자동으로 발급합니다.
4. `clawpage.toml`의 `site`를 사용자 정의 도메인으로 업데이트하고, `base`가 설정된 경우 제거합니다.

---

## Cloudflare Pages

포함된 `wrangler.toml`(`pages_build_output_dir = "./dist"`)을 사용합니다.

**무료 티어 제한:** 월 500회 빌드, 대역폭 무제한. 비공개 저장소를 지원합니다. 상업적 사용이 허용됩니다.

### 옵션 A — Git 연동 (권장)

1. [Cloudflare 대시보드](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**으로 이동합니다.
2. 저장소를 선택합니다.
3. 다음을 설정합니다:
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `BUN_VERSION = latest`
4. **Save and Deploy**를 클릭합니다.

이 방법에서는 `wrangler.toml`이 필요하지 않습니다 — Cloudflare가 대시보드에서 빌드 설정을 읽습니다.

### 옵션 B — Wrangler CLI

프로젝트 루트의 `wrangler.toml`이 Wrangler 기반 배포를 위한 프로젝트 이름과 출력 디렉터리를 설정합니다.

```bash
# Wrangler 설치
npm install -g wrangler

# 로그인 인증
wrangler login

# 빌드 및 배포
bun run build
wrangler pages deploy ./dist --project-name=clawpage
```

첫 실행 시 Wrangler가 Pages 프로젝트를 자동으로 생성합니다. 이후 실행 시에는 업데이트됩니다.

### 사용자 정의 도메인

1. Pages 프로젝트에서 **Custom domains → Set up a custom domain**으로 이동하고 도메인을 입력합니다.
2. 도메인이 이미 Cloudflare에 있는 경우 DNS 레코드가 자동으로 추가됩니다. 그렇지 않으면 DNS 공급자에 제공된 `CNAME` 레코드를 추가합니다.
3. Cloudflare가 무료 TLS 인증서를 자동으로 발급합니다.
4. `clawpage.toml`의 `site`를 사용자 정의 도메인으로 업데이트하고, `base`가 설정된 경우 제거합니다.
