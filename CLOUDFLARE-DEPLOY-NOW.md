# Cloudflare Deployment — Action Checklist

## Current Setup (Direct Cloudflare Pages Git Integration)

Your current dashboard settings:
- Build command: `npm install && npm run build` (or `yarn install && yarn build`)
- Deploy command: `npx wrangler versions upload`
- Non-production branch deploy command: `npx wrangler versions upload`

This is the modern Wrangler versions-based deploy (good).

**Recommended Build command** (update in CF dashboard):
```
yarn install && yarn build && mkdir -p _site/brain && cp APTITUDE-BRAIN.md INCIDENT-INTAKE-DEMO.md PROJECT-STATUS.md README.md _site/brain/ || true && cp APTITUDE-BRAIN.md INCIDENT-INTAKE-DEMO.md _site/ || true
```

**Why this?**
- Uses yarn (we have .yarnrc.yml and yarn.lock for consistency and to avoid previous install issues).
- Runs the Vite React premium UI build (vite.config.js sets outDir: "_site").
- Copies the new brain docs and updated status into the output so they are served in the deployed site (at / and /brain/).

**Build output directory**: `_site` (or let it auto-detect).

**Production branch**: `claude/judge-bias-beacon-scoring-8qAT3`

After updating the build command in the CF dashboard, trigger a new deployment from the latest commit on the claude branch (use "Create a new deployment" if needed). The queued builds should pick it up.

---

## Alternative: GitHub Actions + Wrangler (if you prefer the Action over direct)

The current workflow on the branch already does the equivalent (yarn build + copy brain docs + wrangler deploy). If you want to use this:
- In CF dashboard, turn off auto deploys / direct builds for this project.
- Make sure the two secrets (CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID) are set in GitHub repo secrets.
- Push to the claude branch (or manually run the workflow).

The workflow will handle everything.

---

## Notes
- Project name in CF: `aptitude-site`
- The brain docs will be available alongside the premium UI once deployed.
- If you see the old pre-premium UI, it's likely because an older successful deployment is still active or the build command didn't include the copy step. Forcing a new deployment from the latest commit on the claude branch fixes it.
