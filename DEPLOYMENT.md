# Deploying this site (cPanel Git Version Control)

The site is plain static HTML, CSS and JS with no build step. cPanel pulls this repo, and `.cpanel.yml` copies the site files into `public_html`.

This is a **pull-based** setup: merging on GitHub does not update the live site. After each merge, someone with cPanel access clicks two buttons.

- Live site: https://sanantoniocare.com
- Hosting: GoDaddy cPanel
- Repo: https://github.com/s-castillo/sac-website (public)

## Every time the site is updated

1. The change is merged into `main` on GitHub.
2. In cPanel go to **Git™ Version Control** → **Manage** → **Pull or Deploy**, then:
   1. Click **Update from Remote** (pulls the latest commit down).
   2. Click **Deploy HEAD Commit** (copies the files into `public_html`).
3. Hard-refresh the site (Cmd/Ctrl+Shift+R) to see the change.

No build tools and no server restart are needed.

## What the deploy copies

`.cpanel.yml` is the complete list. Anything not in it is **not** deployed.

| In the repo | On the server (`public_html`) |
| :-- | :-- |
| `*.html` | Same file names |
| `404.html` | Also copied as `404.shtml`. cPanel serves its own default 404 from `404.shtml`, so this copy is what makes the branded 404 page appear. |
| `sitemap.xml`, `robots.txt` | Same file names |
| `assets/` | Copied recursively |

Two things to know:

- A deploy overwrites files but never deletes them. If a page is removed from the repo, also delete it from `public_html` in cPanel File Manager.
- If you add a new kind of file at the top level of the repo, add it to `.cpanel.yml` or it won't go live.

## One-time setup

### 1. Create the repository in cPanel

1. In cPanel, go to **Git™ Version Control** → **Create**.
2. **Clone URL:** `https://github.com/s-castillo/sac-website.git`. The repo is public, so no credentials are needed.
3. **Repository Path:** accept the suggested path (something like `repositories/sac-website`). This is where the git checkout lives. It is not `public_html`; `.cpanel.yml` handles that. Don't edit files inside this folder by hand, since that can make **Update from Remote** fail.
4. Click **Create**.

### 2. First deploy

From **Git™ Version Control**, click **Manage**, open **Pull or Deploy**, and click **Deploy HEAD Commit**. Visit the domain to confirm the site is live.

### If the repo is ever made private

cPanel then needs an SSH deploy key:

1. In cPanel, go to **SSH Access** → **Manage SSH Keys** → **Generate a New Key**, then view the **public** key and copy the whole line.
2. The repo owner adds it on GitHub under the repo's **Settings** → **Deploy keys** as a read-only key.
3. Create the cPanel repository with the SSH clone URL `git@github.com:s-castillo/sac-website.git`.

## Server settings that are not in the repo

These live on the server, and a deploy never touches them.

### `public_html/.htaccess`

Edited in cPanel File Manager (turn on **Show Hidden Files** in Settings). It sends all http traffic to https, leaving the SSL validation path alone so certificate renewals keep working:

```apache
# Send all http traffic to https (leave the SSL validation path alone so renewals keep working)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Use the site's own 404 page
ErrorDocument 404 /404.html
```

The `ErrorDocument` line is harmless, but on this host the branded 404 actually comes from `404.shtml` (see above).

### Domain, DNS and HTTPS

- The domain is registered at GoDaddy, with the nameservers set at the registrar. The root domain's A record must point at the hosting account's **Shared IP** (cPanel → **General Information**).
- HTTPS certificates are issued and renewed automatically by **AutoSSL** (cPanel → **SSL/TLS Status**). AutoSSL checks the domain over plain http, so two things must stay true: the domain keeps pointing at this hosting account, and the `.well-known` exemption in the `.htaccess` redirect stays in place. If a browser ever shows a certificate warning, open **SSL/TLS Status** and click **Run AutoSSL**.
- `www.sanantoniocare.com` serves the same site. Every page carries a canonical link to `https://sanantoniocare.com/…`, which tells search engines the main domain is the one to list.

### Things the host adds

GoDaddy shared hosting injects a small performance-monitoring script after `</html>` on every page. It isn't part of this repo, and the Privacy Policy discloses it.

## Contact and careers forms

Both forms post straight from the browser to Formspree, with no server code. The two endpoints are set in `assets/js/site.js`.

Formspree emails each submission to the address on the Formspree account that owns the form. To change who receives them, change it in the Formspree dashboard, not in the code.

If a form stops working, check the Formspree dashboard first: the account email must be confirmed, and the plan's monthly submission limit must not be used up.

## Search engines

`sitemap.xml` lists the public pages, and `robots.txt` points to it. When a page is added or removed, update `sitemap.xml`. After launch, add the site in Google Search Console and submit `https://sanantoniocare.com/sitemap.xml`.

## Troubleshooting

- **Site doesn't update after deploying:** confirm both buttons were clicked, in order (Update from Remote first, then Deploy HEAD Commit), then hard-refresh the browser.
- **Update from Remote or Deploy fails:** open the repo's **Pull or Deploy** tab and read the log. The usual causes are files edited by hand inside the cPanel checkout, or a typo in `.cpanel.yml` (it is whitespace-sensitive).
- **A missing page shows a plain "File Not Found" instead of the branded page:** `404.shtml` isn't in `public_html`. Run **Deploy HEAD Commit** again.
- **Browser shows a certificate warning:** see "Domain, DNS and HTTPS" above.
- **"Permission denied (publickey)" when creating the repository:** this only happens with the SSH clone URL. Use the https URL, or check that the deploy key was added on GitHub with the whole line copied.
