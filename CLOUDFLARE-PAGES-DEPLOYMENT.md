# Cloudflare Pages Deployment

This project is ready to move from Netlify to Cloudflare Pages.

## Import Settings

- Repository root: `APTITUDE-site`
- Production branch: your current main deployment branch
- Framework preset: `None`
- Build command: `bundle exec jekyll build`
- Build output directory: `_site`

## Environment Variables

- `JEKYLL_ENV=production`
- `RUBY_VERSION=3.3.5`

## Notes

- The site no longer hardcodes the old `biasbeacon.netlify.app` URL.
- Cloudflare-compatible `_headers` and `_redirects` files are included and will be copied into the build output by Jekyll.
- After Cloudflare Pages assigns your `*.pages.dev` URL or your custom domain, update `url` in `_config.yml` if you want absolute canonical URLs again.

## Netlify Cleanup

In Netlify, open your site and go to `Domain management > Production domains`. If your custom domain is listed there, use the row actions menu or the remove option next to the domain entry to detach it from the site before switching DNS to Cloudflare.
