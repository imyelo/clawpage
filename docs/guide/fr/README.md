# openclaw-chats-share

> 📤 Tapez `/chats-share` dans n'importe quel chat Openclaw. Votre conversation devient une page permanente et partageable — construite et déployée sur GitHub Pages automatiquement.

Pas d'export manuel, pas de copier-coller. Une commande skill exporte la session, ouvre une PR, et publie votre chat sur votre propre site GitHub Pages.

## Démarrage Rapide

Copiez et collez ceci dans votre chat d'agent :

```
Lisez https://clawhub.ai/imyelo/chats-share et installez la skill chats-share,
puis lancez la configuration initiale pour moi.
```

## Ce Que Fait l'Agent Pendant la Configuration

L'agent va échafauder un dépôt GitHub privé, configurer `chats-share.toml` avec votre URL Pages, pousser le commit initial, activer GitHub Actions comme source Pages, et enregistrer le projet pour que `/chats-share` fonctionne immédiatement. Pour le étape par étape complet, voir [skills/chats-share/references/setup.md](../../skills/chats-share/references/setup.md).

## Démo en Direct

<a href="https://chats-share.yelo.ooo" target="_blank"><img src="../../media/screenshot.png" alt="Screenshot of a chat page built with openclaw-chats-share" width="640" /></a>

## Partager un Chat

Une fois la configuration terminée, utilisez la commande skill `/chats-share` dans n'importe quel chat Openclaw pour l'exporter :

```
/chats-share
```

L'agent va :

1. Identifier la session actuelle à exporter
2. Vous demander de confirmer le titre, la description et la visibilité (`public` / `private`)
3. Masquer les données sensibles que vous signalez
4. Écrire le fichier YAML dans votre repo de travail sur une nouvelle branche (`chat/{YYYYMMDD}-{slug}`)
5. Vous proposer d'ouvrir une Pull Request — la fusion vers `main` déclenche le build GitHub Pages

Après la fusion de la PR, votre chat est en ligne à `https://votre-domaine/share/{slug}`.

> **Astuce :** Définissez `visibility: private` (la valeur par défaut) pour garder un chat accessible uniquement via un lien direct, sans qu'il n'apparaisse sur la page d'index publique.

## Comment Ça Marche

```
/chats-share
    │
    ▼
OpenClaw Skill
    │  1. Localiser et confirmer la session à exporter
    │  2. Extraire l'historique des messages
    │  3. Remplir les métadonnées (titre, participants, description)
    │  4. Masquer les données sensibles
    │  5. Écrire le YAML dans votre dépôt de données
    │  6. Pousser vers une nouvelle branche → créer PR
    ▼
GitHub Pages
    └── https://votre-domaine/share/{slug}
```

### Flux Basé sur les Branches

Les chats sont poussés vers une nouvelle branche (`chat/{slug}`) au lieu de main, avec des conseils pour créer une PR pour révision avant de fusionner.

## Architecture du Dépôt

Ce dépôt est un **modèle public**. Vos données de chat réelles vivent dans un **dépôt de travail privé** séparé — cela garde le modèle propre et forkable sans contamination de données.

| Dépôt | Visibilité | Purpose |
|-------|------------|---------|
| `openclaw-chats-share` | Public | Modèle, paquets et Skill |
| `your-chats-share` | Privé | Vos données de chat réelles |

## Paquets

### `openclaw-chats-share` (CLI)

Analyse les fichiers JSONL bruts de sessions OpenClaw `sessions/{uuid}.jsonl` et génère une sortie YAML.

```bash
npx openclaw-chats-share parse <sessions/{uuid}.jsonl> [-o output.yaml]
```

### `openclaw-chats-share-web**

Générateur de site statique basé sur Astro. Rend les fichiers YAML de chat en pages partageables.

```bash
npx openclaw-chats-share-web dev     # serveur de développement local
npx openclaw-chats-share-web build   # construire le site statique
npx openclaw-chats-share-web preview # prévisualiser le site construit localement
```

### `create-openclaw-chats-share**

Outil d'échafaudage pour initialiser un nouveau dépôt de travail à partir de ce modèle.

```bash
npx create-openclaw-chats-share <project-name>
```

## Format des Données

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
| `participants` | Non | Map les noms des participants à `{ role: "human" \| "agent" }` | voir exemple |

**Visibilité :**
- `public` — apparaît sur l'index de la page d'accueil
- `private` (par défaut) — accessible uniquement via URL directe, caché de l'index

La clé `timeline:` contient une liste ordonnée d'objets de messages et d'événements. Voir le schema complet dans [docs/chats-share-data-format.md](/docs/chats-share-data-format.md).

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

## Configuration

Le paquet web est configuré via `chats-share.toml` à la racine de votre dépôt de travail.

| Clé | Type | Description | Exemple |
|-----|------|-------------|---------|
| `site` | string (URL) | URL complète de votre site déployé | `"https://vous.github.io"` |
| `base` | string | Chemin de base pour les sites de projet GitHub Pages | `"/mon-repo"` |
| `public_dir` | string | Répertoire des assets statiques (relatif au fichier de config) | `"public"` |
| `out_dir` | string | Répertoire de sortie de build (relatif au fichier de config) | `"dist"` |
| `chats_dir` | string | Chemin personnalisé du répertoire de chats (absolu ou relatif au config) | `"../mes-chats"` |
| `template.options.title` | string | Titre de la page d'accueil | `"chats-share"` |
| `template.options.subtitle` | string | Sous-titre de la page d'accueil | `"// conversation archive"` |
| `template.options.description` | string | Meta description du site | `"Mon archive de conversations"` |
| `template.options.footer` | string | Texte du pied de page (Markdown supporté) | `` |

**Exemple `chats-share.toml` :**

```toml
site = "https://votre-utilisateur.github.io"
base = "/votre-nom-de-repo"

[template.options]
title = "chats-share"
subtitle = "// conversation archive"
footer = "powered by [@imyelo](https://github.com/imyelo)"
```

### Domaine Personnalisé (GitHub Pages)

Pour servir votre site depuis un domaine personnalisé au lieu de `votre-utilisateur.github.io` :

1. Ajoutez un fichier `CNAME` à votre répertoire `public/` contenant votre domaine :

   ```
   chats-share.exemple.com
   ```

2. Configurez `site` dans `chats-share.toml` vers votre domaine personnalisé :

   ```toml
   site = "https://chats-share.exemple.com"
   ```

3. Configurez votre fournisseur DNS pour pointer le domaine vers GitHub Pages :
   - Pour un domaine apex (`exemple.com`) : ajoutez des enregistrements A pointant vers les IPs de GitHub
   - Pour un sous-domaine (`chats-share.exemple.com`) : ajoutez un enregistrement CNAME pointant vers `votre-utilisateur.github.io`

4. Activez HTTPS dans **Settings → Pages** de votre dépôt GitHub après la propagation DNS.

> Lors de l'utilisation d'un domaine personnalisé, omettez `base` de `chats-share.toml` (ou définissez-le à `"/"`), car le site est servi depuis la racine du domaine.

Consultez également [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) pour les instructions détaillées de configuration de domaine personnalisé GitHub Pages.

## Développement

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

## Release

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

### Flux de Release

1. Créez un changeset avant de fusionner une PR : `bun run changeset`
2. Sélectionnez les paquets affectés et le type de bump (patch/minor/major)
3. Écrivez une description des changements
4. Committez le fichier de changeset avec votre PR
5. Après la fusion, l'action changesets crée une PR "Version Packages"
6. Fusionner la PR de version déclenche npm publish

## Structure du Projet

```
packages/
  cli/     - CLI openclaw-chats-share (parseur de logs de session + générateur YAML)
  web/     - openclaw-chats-share-web (site statique Astro)
    src/
      components/  - MessageHeader.astro, ChatMessage.astro, CollapsibleMessage.tsx, Footer.astro, MemoryBackground.astro
      lib/         - chats.ts, config.ts, config-schema.ts
      pages/       - index.astro, share/[slug].astro
  create/  - Outil d'échafaudage create-openclaw-chats-share
chats/     - Fichiers YAML de chat de démonstration
docs/      - Documentation du projet
skills/    - Définitions des Skills OpenClaw
```

## Sites Utilisant openclaw-chats-share

Sites construits avec cet outil :

- [Yelo](https://vibe.yelo.cc)
- Votre site ici — Ajoutez le vôtre en [soumettant une PR](https://github.com/imyelo/openclaw-chats-share/edit/main/README.md) !

## Ressources Supplémentaires

- Voir [docs/chats-share-data-format.md](/docs/chats-share-data-format.md) pour les champs frontmatter complets et le format du contenu.

## Licence

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2026 - present
