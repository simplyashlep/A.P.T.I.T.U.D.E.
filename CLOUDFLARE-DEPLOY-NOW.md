# Cloudflare Deployment — Action Checklist

## Option A: Direct Cloudflare Pages Git Integration (RECOMMENDED — No secrets needed)

1. Go to https://dash.cloudflare.com → **Pages** → **Create a project** → **Connect to Git**
2. Select your new GitHub repo
3. Use these exact settings:
   - **Framework preset**: None
   - **Build command**: `bundle exec jekyll build`
   - **Build output directory**: `_site`
4. Add these **Environment Variables**:
   - `JEKYLL_ENV` = `production`
   - `RUBY_VERSION` = `3.3.5`
5. Click **Save and Deploy**

Cloudflare will handle the build directly — no GitHub Actions, no secrets required.

---

## Option B: GitHub Actions → Wrangler Deploy (Current workflow setup)

Requires two GitHub repository secrets to be set in the **new** repo:

1. Go to your new GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add:
   - `CLOUDFLARE_API_TOKEN` — from https://dash.cloudflare.com/profile/api-tokens (use "Edit Cloudflare Workers" template or create with Pages write permission)
   - `CLOUDFLARE_ACCOUNT_ID` — found on the right sidebar of https://dash.cloudflare.com

Once both secrets are set, push to `main` and the workflow will trigger.

---

## What was fixed in this repo

| File | Fix |
|---|---|
| `.github/workflows/deploy-cloudflare-pages.yml` | Branch trigger changed to `main`; `--project-name aptitude-site` added to deploy command; `bundle lock` added to handle missing Gemfile.lock |
| `wrangler.jsonc` | `$schema` changed from broken local path to remote URL |

## Notes

- The site name in Cloudflare Pages should be `aptitude-site` (matching `wrangler.jsonc`)
- After the first successful deploy, Cloudflare will assign a `*.pages.dev` URL
- Update `url:` in `_config.yml` once you have your final domain
