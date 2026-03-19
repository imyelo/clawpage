# Guide de Déploiement

Le scaffold inclut des fichiers de configuration pour toutes les plateformes supportées. Choisissez celle qui correspond à votre hébergeur et suivez les étapes ci-dessous.

> ⚠️ **Note sur les dépôts privés :** Nous recommandons de garder votre dépôt **privé** comme bonne pratique pour protéger les informations sensibles dans vos chats — voir [comment protéger les informations sensibles](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info/). Cependant, GitHub Pages nécessite un **plan Pro ou supérieur** pour déployer depuis un dépôt privé. Si votre dépôt est privé et que vous êtes sur le plan gratuit GitHub, utilisez Netlify, Vercel ou Cloudflare Pages à la place — les trois supportent les dépôts privés sur leurs niveaux gratuits.

---

## GitHub Pages

Utilise le fichier `.github/workflows/deploy.yml` inclus, qui construit le site à chaque push sur `main` et publie sur la branche `gh-pages` via [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

**Limites du niveau gratuit :** Le site publié ne doit pas dépasser 1 Go ; limite de bande passante de 100 Go/mois. Non autorisé pour un usage commercial.

**Étapes :**

1. Poussez le projet vers un dépôt GitHub.
2. Allez dans **Settings → Pages** de votre dépôt.
3. Définissez **Source** sur `Deploy from a branch`, branche `gh-pages`, dossier `/ (root)`.
4. Poussez un commit sur `main` — le workflow s'exécute automatiquement et votre site sera en ligne à `https://<utilisateur>.github.io/<repo>/`.

**Configuration :** Définissez `site` et `base` dans `clawpage.toml` pour correspondre à votre URL GitHub Pages :

```toml
site = "https://votre-utilisateur.github.io"
base = "/votre-nom-de-repo"
```

Pour un site utilisateur/organisation (`<utilisateur>.github.io`) ou lors de l'utilisation d'un domaine personnalisé, `base` peut être omis.

**Domaine personnalisé :**

1. Ajoutez un fichier `CNAME` à votre répertoire `public/` contenant votre domaine (ex. `chats.example.com`).
2. Chez votre fournisseur DNS, ajoutez un enregistrement `CNAME` pointant votre sous-domaine vers `<utilisateur>.github.io`.
3. Dans **Settings → Pages**, entrez votre domaine personnalisé et activez **Enforce HTTPS** une fois le certificat provisionné.
4. Supprimez `base` de `clawpage.toml` et mettez à jour `site` avec votre domaine personnalisé.

---

## Netlify

Utilise le fichier `netlify.toml` inclus. Netlify détecte Bun automatiquement.

**Limites du niveau gratuit :** 100 Go de bande passante/mois, 300 minutes de build/mois. Si l'une des limites est dépassée, le site est suspendu pour le reste du mois. Supporte les dépôts privés. L'usage commercial est autorisé.

**Étapes :**

1. Poussez le projet vers un dépôt Git (GitHub, GitLab ou Bitbucket).
2. Dans le [tableau de bord Netlify](https://app.netlify.com), cliquez sur **Add new site → Import an existing project**.
3. Sélectionnez votre dépôt. Netlify lit `netlify.toml` et pré-remplit les paramètres de build — aucune configuration manuelle requise.
4. Cliquez sur **Deploy site**.

Votre site est en ligne à `https://<nom-du-site>.netlify.app`.

**Domaine personnalisé :**

1. Dans **Site settings → Domain management**, cliquez sur **Add a domain** et entrez votre domaine.
2. Suivez les instructions de Netlify pour mettre à jour vos enregistrements DNS (pointez vos serveurs de noms vers Netlify, ou ajoutez les enregistrements `A`/`CNAME` fournis chez votre fournisseur DNS).
3. Netlify provisionne un certificat TLS gratuit automatiquement.
4. Mettez à jour `site` dans `clawpage.toml` avec votre domaine personnalisé et supprimez `base` si défini.

---

## Vercel

Utilise le fichier `vercel.json` inclus.

**Limites du niveau gratuit :** Le plan Hobby est réservé à un usage personnel et non commercial. Les projets commerciaux nécessitent un plan Pro. Supporte les dépôts privés.

**Étapes :**

1. Poussez le projet vers un dépôt Git.
2. Dans le [tableau de bord Vercel](https://vercel.com/new), cliquez sur **Import Project** et sélectionnez votre dépôt.
3. Vercel lit `vercel.json` automatiquement — aucune configuration manuelle requise.
4. Cliquez sur **Deploy**.

Votre site est en ligne à `https://<nom-du-projet>.vercel.app`.

Vous pouvez également déployer depuis la CLI :

```bash
npx vercel --prod
```

**Domaine personnalisé :**

1. Dans **Project settings → Domains**, cliquez sur **Add** et entrez votre domaine.
2. Suivez les instructions de Vercel pour ajouter l'enregistrement `A` ou `CNAME` fourni chez votre fournisseur DNS.
3. Vercel provisionne un certificat TLS gratuit automatiquement.
4. Mettez à jour `site` dans `clawpage.toml` avec votre domaine personnalisé et supprimez `base` si défini.

---

## Cloudflare Pages

Utilise le fichier `wrangler.toml` inclus (`pages_build_output_dir = "./dist"`).

**Limites du niveau gratuit :** 500 builds/mois, bande passante illimitée. Supporte les dépôts privés. L'usage commercial est autorisé.

### Option A — Intégration Git (recommandée)

1. Allez dans le [tableau de bord Cloudflare](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**.
2. Sélectionnez votre dépôt.
3. Configurez :
   - **Build command :** `bun run build`
   - **Build output directory :** `dist`
   - **Environment variable :** `BUN_VERSION = latest`
4. Cliquez sur **Save and Deploy**.

Aucun `wrangler.toml` n'est requis pour cette méthode — Cloudflare lit les paramètres de build depuis le tableau de bord.

### Option B — Wrangler CLI

Le `wrangler.toml` à la racine de votre projet configure le nom du projet et le répertoire de sortie pour les déploiements basés sur Wrangler.

```bash
# Installer Wrangler
npm install -g wrangler

# S'authentifier
wrangler login

# Construire et déployer
bun run build
wrangler pages deploy ./dist --project-name=clawpage
```

Au premier lancement, Wrangler crée le projet Pages automatiquement. Les lancements suivants le mettent à jour.

### Domaine personnalisé

1. Dans votre projet Pages, allez dans **Custom domains → Set up a custom domain** et entrez votre domaine.
2. Si votre domaine est déjà sur Cloudflare, l'enregistrement DNS est ajouté automatiquement. Sinon, ajoutez l'enregistrement `CNAME` fourni chez votre fournisseur DNS.
3. Cloudflare provisionne un certificat TLS gratuit automatiquement.
4. Mettez à jour `site` dans `clawpage.toml` avec votre domaine personnalisé et supprimez `base` si défini.
