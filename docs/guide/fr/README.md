# Clawpage

> 📤 Tapez `/clawpage` dans n'importe quel chat Openclaw. Votre conversation devient une page permanente à votre propre URL. Déployé sur GitHub Pages, Vercel, Netlify ou Cloudflare Pages.

[English](/docs/guide/en/README.md) · [Español](/docs/guide/es/README.md) · [中文](/docs/guide/zh/README.md) · [日本語](/docs/guide/ja/README.md) · [한국어](/docs/guide/ko/README.md)

✨ Pas d'export manuel, pas de copier-coller. Une commande et votre chat est en ligne à votre propre URL — titre, description et données sensibles gérés pour vous.

## 📌 Fonctionnalités

- ⚡ `/clawpage` dans n'importe quel chat → page en direct à votre URL en quelques minutes
- 🚀 Aucune infrastructure à gérer — purement statique, déployé sur GitHub Pages, Vercel, Netlify ou Cloudflare Pages gratuitement
- 🔀 Révisez avant de publier — chaque chat ouvre une PR pour que vous contrôliez ce qui est mis en ligne
- 🔒 Partagez en privé — le lien direct fonctionne, mais les chats restent hors de l'index public par défaut
- 🛡️ Sûr à partager — la rédaction assistée par IA remplace les données sensibles par `[REDACTED]` avant l'export
- 🧠 Fidélité totale — les appels d'outils et les traces de réflexion sont préservés dans la chronologie, pas supprimés

## Démo en Direct 🚀

<a href="https://clawpage.yelo.ooo" target="_blank"><img src="../../../media/screenshot.png" alt="Screenshot of a chat page built with clawpage" width="640" /></a>

Ou consultez un site que nous utilisons nous-mêmes : [vibe.yelo.cc](https://vibe.yelo.cc)

## ⚡ Démarrage Rapide

Copiez et collez dans votre chat d'agent :

```
Lisez https://clawhub.ai/imyelo/clawpage et installez la skill clawpage,
puis lancez la configuration initiale pour moi.
```

### 🤖 Ce Que Fait l'Agent Pendant la Configuration

L'agent va échafauder un dépôt GitHub privé, configurer `clawpage.toml` avec votre URL Pages, pousser le commit initial, activer GitHub Actions comme source Pages, et enregistrer le projet pour que `/clawpage` fonctionne immédiatement. Pour le étape par étape complet, voir [skills/clawpage/references/setup.md](../../../skills/clawpage/references/setup.md).

## 📤 Partager un Chat

Une fois la configuration terminée, utilisez la commande skill `/clawpage` dans n'importe quel chat Openclaw pour l'exporter :

```
/clawpage
```

L'agent va :

1. 🔍 Identifier la session actuelle à exporter
2. ✅ Vous demander de confirmer le titre, la description et la visibilité (`public` / `private`)
3. 🔒 Masquer les données sensibles que vous signalez
4. 📝 Écrire le fichier YAML dans votre repo de travail sur une nouvelle branche (`chat/{YYYYMMDD}-{slug}`)
5. 🔀 Vous proposer d'ouvrir une Pull Request — la fusion vers `main` déclenche le build GitHub Pages

Après la fusion de la PR, votre chat est en ligne à `https://votre-domaine/chats/{slug}`.

> **⚠️ Avant de fusionner :** La rédaction automatique par IA n'est pas fiable à 100 %. Ouvrez le YAML généré dans la PR et remplacez manuellement tout contenu sensible manqué par `[REDACTED]`. Voir [Comment protéger les informations sensibles](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info) pour plus de détails.

> **💡 Astuce :** Définissez `visibility: private` (la valeur par défaut) pour garder un chat accessible uniquement via un lien direct, sans qu'il n'apparaisse sur la page d'index publique.

## ⚙️ Comment Ça Marche

```
/clawpage
    │
    ▼
🤖 OpenClaw Skill
    │  1. 🔍 Localiser et confirmer la session à exporter
    │  2. 💬 Extraire l'historique des messages
    │  3. 📝 Remplir les métadonnées (titre, participants, description)
    │  4. 🔒 Masquer les données sensibles
    │  5. 📄 Écrire le YAML dans votre dépôt de données
    │  6. 🔀 Pousser vers une nouvelle branche → créer PR
    ▼
🚀 GitHub Pages
    └── https://votre-domaine/chats/{slug}
```

### 🌿 Flux Basé sur les Branches

Les chats sont poussés vers une nouvelle branche (`chat/{slug}`) au lieu de main, avec des conseils pour créer une PR pour révision avant de fusionner.

## 🏗️ Architecture du Dépôt

Ce dépôt est un **modèle public**. Vos données de chat réelles se trouvent dans un **dépôt de travail privé** séparé — cela garde le modèle propre et forkable sans contamination de données.

| Dépôt | Visibilité | Objectif |
|-------|------------|---------|
| `clawpage` | Public | Modèle, paquets et Skill |
| `your-clawpage` | Privé | Vos données de chat réelles |

## ⚡ Configuration

Le paquet web est configuré via `clawpage.toml` à la racine de votre dépôt de travail.

| Clé | Type | Description | Exemple |
|-----|------|-------------|---------|
| `site` | string (URL) | URL complète de votre site déployé | `"https://vous.github.io"` |
| `base` | string | Chemin de base si le site n'est pas servi depuis la racine du domaine | `"/mon-repo"` |
| `public_dir` | string | Répertoire des assets statiques (relatif au fichier de config) | `"public"` |
| `out_dir` | string | Répertoire de sortie de build (relatif au fichier de config) | `"dist"` |
| `chats_dir` | string | Chemin personnalisé du répertoire de chats (absolu ou relatif au config) | `"../mes-chats"` |
| `template.options.title` | string | Titre de la page d'accueil | `"clawpage"` |
| `template.options.subtitle` | string | Sous-titre de la page d'accueil | `"// conversation archive"` |
| `template.options.description` | string | Meta description du site | `"Mon archive de conversations"` |
| `template.options.footer` | string | Texte du pied de page (Markdown supporté) | `` |
| `template.options.analytics.google_analytics_id` | string | Google Analytics 4 Measurement ID | `"G-XXXXXXXXXX"` |
| `template.options.promo.enabled` | boolean | Afficher un bloc promotionnel sur la page d'accueil pour faire connaître clawpage | `false` |

**Exemple `clawpage.toml` :**

```toml
site = "https://votre-utilisateur.github.io"
base = "/votre-nom-de-repo"

[template.options]
title = "clawpage"
subtitle = "// conversation archive"
footer = "powered by [@imyelo](https://github.com/imyelo)"

[template.options.promo]
enabled = true
```

Lors du déploiement sur Netlify, Vercel, Cloudflare Pages ou un domaine personnalisé, définissez `site` avec votre URL complète et omettez `base`.

### 🚢 Déploiement

Le projet de base inclut des fichiers de configuration pour

- ✅ GitHub Pages
- ✅ Netlify
- ✅ Vercel
- ✅ Cloudflare Pages.

Pour les instructions étape par étape, la configuration de domaine personnalisé et les limites des niveaux gratuits de chaque plateforme, voir [docs/guide/fr/deployment.md](/docs/guide/fr/deployment.md).

## 📋 Format des Données

Les fichiers de chat sont stockés en YAML sous `chats/` dans votre dépôt de travail. Générés par la CLI à partir des fichiers JSONL de sessions OpenClaw (`{id}.jsonl`).

**Nom des fichiers :** `YYYYMMDD-{slug}.yaml`

**Champs de métadonnées de niveau supérieur :**

| Champ | Requis | Description | Exemple |
|-------|--------|-------------|---------|
| `title` | Oui | Titre de la session / nom d'export | `Ma Session` |
| `date` | Oui | Date de la session (YYYY-MM-DD) | `2026-02-15` |
| `sessionId` | Oui | ID de session unique | `cf1f8dbe-2a12-47cf-8221-9fcbf0c47466` |
| `channel` | Non | Nom du canal/plateforme | `discord`, `telegram` |
| `model` | Non | Modèle utilisé dans la session | `MiniMax-M2.5` |
| `totalMessages` | Non | Nombre total de messages | `42` |
| `totalTokens` | Non | Total de tokens consommés | `12345` |
| `tags` | Non | Tableau de tags pour la catégorisation | `[coding, debug]` |
| `visibility` | Non | Visibilité de l'index | `private` (par défaut) |
| `description` | Non | Brève description pour l'index | `Debugging a tricky async issue` |
| `defaultShowProcess` | Non | Afficher le processus (pensée, appels d'outils) par défaut | `false` |
| `participants` | Non | Map les noms des participants à `{ role: "human" | "agent" }` | voir exemple |

**Visibilité :**
- `public` — apparaît sur l'index de la page d'accueil
- `private` (par défaut) — accessible uniquement via URL directe, caché de l'index

La clé `timeline:` contient une liste ordonnée d'objets de messages et d'événements. Voir le schema complet dans [docs/clawpage-data-format.md](/docs/clawpage-data-format.md).

**Fichier d'exemple :**

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

## 📦 Paquets

### 📄 `clawpage` (CLI)

Analyse les fichiers JSONL bruts de sessions OpenClaw `sessions/{uuid}.jsonl` et génère une sortie YAML.

```bash
npx clawpage parse <sessions/{uuid}.jsonl> [-o output.yaml]
```

### 🌐 `clawpage-web`

Générateur de site statique basé sur Astro. Rend les fichiers YAML de chat en pages partageables.

```bash
npx clawpage-web dev     # serveur de développement local
npx clawpage-web build   # construire le site statique
npx clawpage-web preview # prévisualiser le site construit localement
```

### 🛠️ `create-clawpage`

Outil d'échafaudage pour initialiser un nouveau dépôt de travail à partir de ce modèle.

Le projet généré inclut des fichiers de configuration pour GitHub Pages, Netlify, Vercel et Cloudflare Pages — choisissez la plateforme que vous utilisez.

```bash
npx create-clawpage <project-name>
```

## 🧑‍💻 Développement

```bash
# Installer les dépendances
bun install

# Démarrer le serveur de développement demo
bun run dev

# Construire le site statique demo
bun run build

# Déployer demo vers GitHub Pages
bun run deploy
```

## 📜 Publication

Ce projet utilise [changesets](https://github.com/changesets/changesets) pour la gestion des versions et du changelog.

```bash
# Créer un nouveau changeset
bun run changeset

# Vérifier le statut du changeset
bunx changeset status

# Prévisualiser les montées de version (dry run)
bunx changeset version --dry-run

# Appliquer les montées de version et mettre à jour les changelogs
bun run version
```

### Flux de publication

1. Créez un changeset avant de fusionner une PR : `bun run changeset`
2. Sélectionnez les paquets affectés et le type de bump (patch/minor/major)
3. Écrivez une description des changements
4. Committez le fichier de changeset avec votre PR
5. Après la fusion, l'action changesets crée une PR "Version Packages"
6. Fusionner la PR de version déclenche npm publish

## 📁 Structure du Projet

```
packages/
  cli/     - CLI clawpage (parseur de logs de session + générateur YAML)
  web/     - clawpage-web (site statique Astro)
    src/
      components/  - MessageHeader.astro, ChatMessage.astro, CollapsibleMessage.tsx, Footer.astro, MemoryBackground.astro
      lib/         - chats.ts, config.ts, config-schema.ts
      pages/       - index.astro, chats/[slug].astro
  create/  - Outil d'échafaudage create-clawpage
chats/     - Fichiers YAML de chat de démonstration
docs/      - Documentation du projet
skills/    - Définitions des Skills OpenClaw
```

## 🌟 Sites Utilisant clawpage

Sites construits avec cet outil :

- [Yelo](https://vibe.yelo.cc)
- Votre site ici — Ajoutez le vôtre en [soumettant une PR](https://github.com/imyelo/clawpage/edit/main/README.md)

## 📚 Ressources Supplémentaires

- Voir [docs/guide/fr/deployment.md](/docs/guide/fr/deployment.md) pour les instructions de déploiement, la configuration de domaine personnalisé et les limites des niveaux gratuits de chaque plateforme.
- Voir [docs/clawpage-data-format.md](/docs/clawpage-data-format.md) pour les champs frontmatter complets et le format du contenu.

## Licence

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2026 - present
