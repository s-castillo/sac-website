# Deploying this site via cPanel Git Version Control

This repo is a plain static site — no build step. cPanel can clone it
directly and copy the files into `public_html` using the included
`.cpanel.yml`. This is a **pull-based** setup: pushing to GitHub does not
automatically update the live site. After each push, someone with cPanel
access needs to click two buttons (Update from Remote, then Deploy HEAD
Commit) as described below.

This repo is **private**. cPanel needs a deploy key to read it — no
GitHub account is required on the hosting side, just a one-time key
exchange with the repo owner (see Step 1).

## One-time setup

### Step 1 — Generate an SSH key in cPanel and send the public key to the repo owner

1. Log into cPanel.
2. Go to **SSH Access** → **Manage SSH Keys**.
3. Click **Generate a New Key**, accept the defaults (or set a passphrase
   if you prefer), and click **Generate Key**.
4. Back on the Manage SSH Keys page, find the new key and click
   **View/Download** (or **Manage**) to see the **public** key. Copy the
   whole thing (starts with `ssh-rsa` or `ssh-ed25519`).
5. Send that public key to the repo owner. They'll add it to the
   repository as a **read-only Deploy Key** (GitHub → repo → Settings →
   Deploy keys → Add deploy key) — this grants access to pull *this one
   repository only*, nothing else on the account.

### Step 2 — Create the Git repository in cPanel

1. In cPanel, go to **Git™ Version Control** → **Create**.
2. **Clone URL**: `git@github.com:s-castillo/sac-website.git`
   (must be the SSH form, not `https://`, so it uses the key from Step 1)
3. **Repository Path**: accept the suggested path (something like
   `repositories/sac-website`) — this is just where the git checkout
   lives; it is *not* the same as `public_html`, which is handled
   automatically by `.cpanel.yml` in Step 3.
4. Click **Create**. If it fails with an authentication error, double
   check the repo owner has added the public key from Step 1 as a Deploy
   Key on GitHub.

### Step 3 — First deploy

1. From **Git™ Version Control**, click **Manage** next to the repo.
2. Open the **Pull or Deploy** tab.
3. Click **Deploy HEAD Commit**. This runs the tasks in `.cpanel.yml`,
   which copies the site files into `public_html` (and cleans up the
   `.git`/`.cpanel.yml`/`.gitignore` files so they aren't publicly
   served).
4. Visit the domain to confirm the site is live.

## Every time the site is updated

1. The repo owner pushes new changes to GitHub as usual.
2. In cPanel → **Git™ Version Control** → **Manage** → **Pull or Deploy**:
   - Click **Update from Remote** (pulls the latest commit down).
   - Click **Deploy HEAD Commit** (copies the updated files into
     `public_html`).

That's it — no build tools, no dependencies, no server restart needed.

## Troubleshooting

- **"Permission denied (publickey)" when creating the repo**: the public
  key from Step 1 hasn't been added as a Deploy Key on GitHub yet, or was
  copied incompletely (make sure you copied the *entire* line, including
  the `ssh-rsa`/`ssh-ed25519` prefix and the trailing comment).
- **Site doesn't update after deploying**: hard-refresh the browser
  (Cmd/Ctrl+Shift+R) — this is a static site with no server-side caching,
  so a stale view is almost always just browser cache.
- **Want to skip the SSH key setup?** The repo owner can make it public
  instead, and cPanel can then use the plain `https://github.com/...`
  clone URL with no credentials at all. Ask them if that's preferred.
