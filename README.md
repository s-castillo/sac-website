# San Antonio Caregivers — Website

Static marketing site for San Antonio Caregivers LLC, live at https://sanantoniocare.com.
Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Pages

| File | Page |
| :-- | :-- |
| `index.html` | Home |
| `services.html` | Services |
| `families.html` | For Families |
| `about.html` | About |
| `careers.html` | Careers (caregiver application form) |
| `contact.html` | Contact (care inquiry form) |
| `legal.html` | Privacy Policy, Terms of Service, Accessibility, Licensing, Client Rights |
| `404.html` | Page not found (deployed to the server as `404.shtml`, see `DEPLOYMENT.md`) |

## What's where

- `assets/css/site.css` — all styles. Colors, fonts and radii are CSS variables in `:root` at the top.
- `assets/js/site.js` — mobile menu and form handling. The two Formspree form endpoints are set here.
- `assets/img/` — photos as `-sm` (760 px) and `-lg` (1600 px) pairs, plus `og-share.jpg` (1200×630 link-preview image).
- `assets/logo/` — logo files and favicons.
- `sitemap.xml`, `robots.txt` — search engine files.

## Run it locally

From this folder:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. This server doesn't serve `404.html` for missing URLs, so open `/404.html` directly to preview that page.

## Editing

- Every page is a standalone HTML file with its own header, footer and icon sprite. A change to the navigation or footer has to be made in all eight files.
- Business details (phone, email, license number) are written directly into the pages. Search the repo for the old value and update every file.
- Adding a page: copy an existing one, set its `<title>`, description, `og:url` and canonical link, add it to `sitemap.xml`, and link it from the navigation or footer.
- **Keep the Privacy Policy accurate.** It states that the site uses no analytics, ad tools or cookies of its own, and names the outside services it uses (GoDaddy hosting, Google Fonts, Formspree, Gmail). If any of that changes (analytics, embedded maps or video, a new form service), update the Privacy Policy section of `legal.html` in the same change.
- Forms post from the browser to Formspree; there is no server code. See `DEPLOYMENT.md` for how to handle form problems.

## Deploying

Merging to `main` does not update the live site. The host pulls the repo on request. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the two-button deploy, what gets copied to the server, and troubleshooting.

## Workflow

Work happens on a branch, goes through a pull request, and is merged into `main`. `main` is what gets deployed.
