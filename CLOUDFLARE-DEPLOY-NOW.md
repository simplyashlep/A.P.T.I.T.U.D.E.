# Cloudflare Deployment — Action Checklist

## Current Setup (Direct Cloudflare Pages Git Integration)

Your current dashboard settings (as you reported):
- Build command: `npm install && npm run build` (or the yarn equivalent)
- Deploy command: `npx wrangler versions upload`
- Non-production branch deploy command: `npx wrangler versions upload`

**Recommended settings in CF dashboard for the premium UI + brain docs:**

- **Production branch**: `claude/judge-bias-beacon-scoring-8qAT3`
- **Framework preset**: None
- **Build command**: `npm install && npm run build`   (or `yarn install && yarn build` if you prefer yarn)
- **Build output directory**: `_site`

(The copy of brain docs is now baked into the `build` script in package.json, so no need for long command in dashboard.)

After saving, go to the Deployments tab and click "Create a new deployment". Select the `claude/judge-bias-beacon-scoring-8qAT3` branch and the latest commit. This forces a fresh build using the new command/settings.

If you still see the old UI after the build succeeds:
- Double-check the build log in CF for any errors.
- Make sure there are no other auto-deploy sources (like the GitHub Action) overwriting it.
- The queued builds should now use the updated settings.

---

## Alternative: GitHub Actions + Wrangler

If direct integration is flaky, you can rely on the GH Action:
- In CF, you can leave the settings or turn off certain auto features if possible.
- Ensure secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set.
- The workflow on the branch will build the React premium UI (to _site), copy the brain docs, and deploy via wrangler.
- Just push to the claude branch.

The current workflow on the branch does exactly the copy logic via the package.json build script.

---

## Notes
- Project name: `aptitude-site`
- Once deployed, the brain docs should be at the root and in /brain/ alongside the premium UI.
- If the old pre-premium UI persists, it is usually because CF is still serving a previous successful deployment artifact. Forcing "Create a new deployment" from the exact latest commit usually resolves it.
