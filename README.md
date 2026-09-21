# Mudassir Tahir — Portfolio Site

A single-page portfolio site with a 3D workflow visualization (Three.js) in the hero, built from your résumé content.

## Files

```
index.html          the whole page
css/style.css        styling
js/script.js          hero 3D graph + scroll behavior
assets/Mudassir_Tahir_Resume.pdf   your résumé, linked from the "Download résumé" button
```

No build step — it's plain HTML/CSS/JS, so it runs on GitHub Pages with zero configuration.

## Deploy to your existing repo (github.com/mudassirkhokher/AI-Automation-Portfolio)

1. Clone your repo if you haven't already:
   ```
   git clone https://github.com/mudassirkhokher/AI-Automation-Portfolio.git
   cd AI-Automation-Portfolio
   ```
2. Copy `index.html`, the `css/` folder, `js/` folder, and `assets/` folder from this download into the root of that repo (overwrite anything already there if you're replacing an older version).
3. Commit and push:
   ```
   git add .
   git commit -m "Add portfolio site"
   git push origin main
   ```
   (use `master` instead of `main` if that's your repo's default branch)
4. On GitHub: go to the repo → **Settings** → **Pages** → under "Build and deployment" set **Source** to "Deploy from a branch" → pick **main** (or **master**) and **/ (root)** → **Save**.
5. GitHub will give you a live URL, typically:
   ```
   https://mudassirkhokher.github.io/AI-Automation-Portfolio/
   ```
   It usually goes live within a minute or two.

## Making it your GitHub *profile* site instead (optional)

If you'd rather this live at `mudassirkhokher.github.io` (no repo name in the URL), create a repo named exactly `mudassirkhokher.github.io` and put these same files at its root instead — GitHub treats that repo name as a special case and serves it from the bare domain automatically.

## Editing later

- Text content: edit the sections directly in `index.html` — each section is commented (`<!-- ===== WORKFLOWS ===== -->` etc.).
- Colors/fonts: all defined as CSS variables at the top of `css/style.css` under `:root`.
- The hero graph: `js/script.js`, in the `nodeDefs` / `edgeDefs` arrays — add or move nodes there if your workflow shape changes.
