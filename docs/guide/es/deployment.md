# Guía de Despliegue

El scaffold incluye archivos de configuración para todas las plataformas compatibles. Elige la que corresponda a tu hosting y sigue los pasos a continuación.

> **Nota sobre repositorios privados:** Recomendamos mantener tu repositorio como **privado** como buena práctica para proteger información sensible en tus chats — ver [cómo proteger información sensible](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info/). Sin embargo, GitHub Pages requiere un **plan Pro o superior** para desplegar desde un repositorio privado. Si tu repositorio es privado y estás en el plan gratuito de GitHub, usa Netlify, Vercel o Cloudflare Pages en su lugar — los tres admiten repositorios privados en sus niveles gratuitos.

---

## GitHub Pages

Usa el archivo `.github/workflows/deploy.yml` incluido, que construye el sitio en cada push a `main` y publica en la rama `gh-pages` a través de [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

**Límites del nivel gratuito:** El sitio publicado no debe superar 1 GB; límite de ancho de banda de 100 GB/mes. No está permitido para uso comercial.

**Pasos:**

1. Haz push del proyecto a un repositorio de GitHub.
2. Ve a **Settings → Pages** en tu repositorio.
3. Establece **Source** en `Deploy from a branch`, rama `gh-pages`, carpeta `/ (root)`.
4. Haz push de un commit a `main` — el workflow se ejecuta automáticamente y tu sitio estará en `https://<usuario>.github.io/<repo>/`.

**Configuración:** Establece `site` y `base` en `clawpage.toml` para que coincidan con tu URL de GitHub Pages:

```toml
site = "https://tu-usuario.github.io"
base = "/tu-nombre-de-repo"
```

Para un sitio de usuario/organización (`<usuario>.github.io`) o al usar un dominio personalizado, `base` puede omitirse.

**Dominio personalizado:**

1. Agrega un archivo `CNAME` a tu directorio `public/` con tu dominio (p.ej. `chats.ejemplo.com`).
2. En tu proveedor de DNS, agrega un registro `CNAME` apuntando tu subdominio a `<usuario>.github.io`.
3. En **Settings → Pages**, ingresa tu dominio personalizado y habilita **Enforce HTTPS** una vez que el certificado esté aprovisionado.
4. Elimina `base` de `clawpage.toml` y actualiza `site` a tu dominio personalizado.

---

## Netlify

Usa el archivo `netlify.toml` incluido. Netlify detecta Bun automáticamente.

**Límites del nivel gratuito:** 100 GB de ancho de banda/mes, 300 minutos de build/mes. Si se supera cualquiera de los límites, el sitio se suspende por el resto del mes. Admite repositorios privados. El uso comercial está permitido.

**Pasos:**

1. Haz push del proyecto a un repositorio Git (GitHub, GitLab o Bitbucket).
2. En el [panel de Netlify](https://app.netlify.com), haz clic en **Add new site → Import an existing project**.
3. Selecciona tu repositorio. Netlify lee `netlify.toml` y rellena la configuración de build automáticamente — no se necesita configuración manual.
4. Haz clic en **Deploy site**.

Tu sitio estará en `https://<nombre-del-sitio>.netlify.app`.

**Dominio personalizado:**

1. En **Site settings → Domain management**, haz clic en **Add a domain** e ingresa tu dominio.
2. Sigue las instrucciones de Netlify para actualizar tus registros DNS (apunta tus nameservers a Netlify, o agrega los registros `A`/`CNAME` proporcionados en tu proveedor de DNS).
3. Netlify aprovisiona un certificado TLS gratuito automáticamente.
4. Actualiza `site` en `clawpage.toml` a tu dominio personalizado y elimina `base` si está configurado.

---

## Vercel

Usa el archivo `vercel.json` incluido.

**Límites del nivel gratuito:** El plan Hobby es solo para uso personal y no comercial. Los proyectos comerciales requieren un plan Pro. Admite repositorios privados.

**Pasos:**

1. Haz push del proyecto a un repositorio Git.
2. En el [panel de Vercel](https://vercel.com/new), haz clic en **Import Project** y selecciona tu repositorio.
3. Vercel lee `vercel.json` automáticamente — no se necesita configuración manual.
4. Haz clic en **Deploy**.

Tu sitio estará en `https://<nombre-del-proyecto>.vercel.app`.

Alternativamente, despliega desde la CLI:

```bash
npx vercel --prod
```

**Dominio personalizado:**

1. En **Project settings → Domains**, haz clic en **Add** e ingresa tu dominio.
2. Sigue las instrucciones de Vercel para agregar el registro `A` o `CNAME` proporcionado en tu proveedor de DNS.
3. Vercel aprovisiona un certificado TLS gratuito automáticamente.
4. Actualiza `site` en `clawpage.toml` a tu dominio personalizado y elimina `base` si está configurado.

---

## Cloudflare Pages

Usa el archivo `wrangler.toml` incluido (`pages_build_output_dir = "./dist"`).

**Límites del nivel gratuito:** 500 builds/mes, ancho de banda ilimitado. Admite repositorios privados. El uso comercial está permitido.

### Opción A — Integración con Git (recomendada)

1. Ve al [panel de Cloudflare](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**.
2. Selecciona tu repositorio.
3. Configura:
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `BUN_VERSION = latest`
4. Haz clic en **Save and Deploy**.

No se requiere `wrangler.toml` para esta vía — Cloudflare lee la configuración de build desde el panel.

### Opción B — Wrangler CLI

El `wrangler.toml` en la raíz de tu proyecto configura el nombre del proyecto y el directorio de salida para despliegues basados en Wrangler.

```bash
# Instalar Wrangler
npm install -g wrangler

# Autenticarse
wrangler login

# Construir y desplegar
bun run build
wrangler pages deploy ./dist --project-name=clawpage
```

En el primer run, Wrangler crea el proyecto de Pages automáticamente. Los runs posteriores lo actualizan.

### Dominio personalizado

1. En tu proyecto de Pages, ve a **Custom domains → Set up a custom domain** e ingresa tu dominio.
2. Si tu dominio ya está en Cloudflare, el registro DNS se agrega automáticamente. De lo contrario, agrega el registro `CNAME` proporcionado en tu proveedor de DNS.
3. Cloudflare aprovisiona un certificado TLS gratuito automáticamente.
4. Actualiza `site` en `clawpage.toml` a tu dominio personalizado y elimina `base` si está configurado.
