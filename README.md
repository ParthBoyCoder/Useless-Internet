# Useless Internet

A static collection of absurd, interactive distractions. No accounts, tracking, backend, API keys, or payment systems: just lovingly engineered nonsense.

## Run locally

From the project directory:

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>. In a GitHub Codespace, use the **Ports** panel to make port `8080` public or open it in the browser preview.

The site is also valid when served by any static file server. It does not need a build step or dependency installation.

## Test

Check the JavaScript syntax with:

```bash
node --check app.js
```

Then open the site and try the main interactions: theme and sound toggles, The Button, excuse generation and copying, the counter, the randomness machine, rock actions and rename, store buttons, and reset.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings -> Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the `/ (root)` folder, then save.
5. GitHub will publish `index.html` as the site entry point.

All core assets are local. The typography import is optional; if unavailable, the page still works with its fallback fonts and all interactions remain offline-capable.

## Add a custom domain

First buy a domain from a registrar such as Cloudflare, Namecheap, or GoDaddy. The simplest setup uses `www`:

1. In your domain provider's DNS settings, add a `CNAME` record with host `www` pointing to `YOUR_USERNAME.github.io`.
2. On GitHub, open the repository's **Settings -> Pages**.
3. Enter `www.yourdomain.com` in **Custom domain** and save it.
4. Wait for DNS to update, then enable **Enforce HTTPS** in the same Pages screen.

For the root domain (`yourdomain.com` without `www`), add these `A` records at your registrar, using the host `@`:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Then enter the root domain in GitHub Pages. Do not include `https://` in the custom-domain field. DNS changes can take from a few minutes to 48 hours to settle, and GitHub may take a little longer to issue the HTTPS certificate.
