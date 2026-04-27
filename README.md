Here's a complete guide — minimal project code first, then deployment steps.

---

## Minimal E-Commerce PWA Project

The project structure looks like this:

```
ecommerce-pwa/
├── index.html
├── manifest.json
├── sw.js
├── style.css
└── app.js
```

---

### 1. `manifest.json`
```json
{
  "name": "ShopPWA",
  "short_name": "Shop",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#111111",
  "icons": [
    {
      "src": "https://via.placeholder.com/192",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://via.placeholder.com/512",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### 2. `sw.js` (Service Worker)
```js
const CACHE_NAME = "shop-pwa-v1";
const ASSETS = ["/", "/index.html", "/style.css", "/app.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
```

---

### 3. `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="theme-color" content="#111111"/>
  <link rel="manifest" href="manifest.json"/>
  <link rel="stylesheet" href="style.css"/>
  <title>ShopPWA</title>
</head>
<body>
  <header><h1>🛍️ ShopPWA</h1></header>
  <main id="products"></main>
  <script src="app.js"></script>
</body>
</html>
```

---

### 4. `style.css`
```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Georgia, serif; background: #f5f5f5; color: #111; }
header { background: #111; color: #fff; padding: 1rem 2rem; font-size: 1.5rem; }
#products { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 1rem; padding: 2rem; }
.card { background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
.card h3 { margin-bottom: .5rem; }
.card button { margin-top: .75rem; padding: .5rem 1rem; background: #111; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
```

---

### 5. `app.js`
```js
const products = [
  { id: 1, name: "Wireless Headphones", price: "$49" },
  { id: 2, name: "Leather Wallet",      price: "$29" },
  { id: 3, name: "Running Shoes",       price: "$89" },
];

const container = document.getElementById("products");
products.forEach(p => {
  container.innerHTML += `
    <div class="card">
      <h3>${p.name}</h3>
      <p>${p.price}</p>
      <button onclick="alert('Added: ${p.name}')">Add to Cart</button>
    </div>`;
});

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("SW registered"))
    .catch(err => console.error("SW error:", err));
}
```

---

## Deployment Steps to GitHub Pages

### Step 1 — Create a GitHub Repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name it `ecommerce-pwa` (keep it public)
3. Don't initialize with README (you'll push your own files)

---

### Step 2 — Initialize Git Locally
```bash
cd ecommerce-pwa
git init
git add .
git commit -m "Initial PWA commit"
```

---

### Step 3 — Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-pwa.git
git branch -M main
git push -u origin main
```

---

### Step 4 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Click **Settings** → scroll to **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**

---

### Step 5 — Fix Service Worker Path (Critical!)

GitHub Pages serves your site at `https://YOUR_USERNAME.github.io/ecommerce-pwa/` — note the **sub-path**. Update `sw.js` cache assets:

```js
// In sw.js — update ASSETS to include the repo subfolder
const ASSETS = [
  "/ecommerce-pwa/",
  "/ecommerce-pwa/index.html",
  "/ecommerce-pwa/style.css",
  "/ecommerce-pwa/app.js"
];
```

Also update `manifest.json`:
```json
"start_url": "/ecommerce-pwa/"
```

Commit and push again:
```bash
git add .
git commit -m "Fix paths for GitHub Pages"
git push
```

---

### Step 6 — Visit Your Live PWA

After ~1 minute, your site is live at:
```
https://YOUR_USERNAME.github.io/ecommerce-pwa/
```

---

### Step 7 — Verify PWA is Working

Open Chrome DevTools → **Application** tab:

| Check | What to look for |
|---|---|
| **Manifest** | Name, icons, display mode shown |
| **Service Workers** | Status: "activated and running" |
| **Cache Storage** | `shop-pwa-v1` with your files |
| **Installable** | "Add to Home Screen" prompt appears |

---

### Common Pitfalls

**HTTPS required** — GitHub Pages provides HTTPS automatically. Service workers won't work on plain `http://`.

**Path mismatch** — The most common error. Always prefix asset paths with `/repo-name/` when hosted in a subdirectory.

**Cache busting** — When updating the site, bump `CACHE_NAME` (e.g., `shop-pwa-v2`) so old caches are cleared.
