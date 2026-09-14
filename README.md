# San Antonio Caregivers — Website

Static marketing site for San Antonio Caregivers LLC. Plain HTML/CSS/JS,
no build step, no dependencies — open `index.html` directly or serve the
folder with any static file server.

```
index.html            Full one-page site
assets/css/           tokens.css (design tokens), global.css (reset/base),
                       components.css (all components)
assets/js/main.js     Nav, modals, FAQ accordion, form handling, animations
assets/images/        Photos, logo, county-service-area map
assets/icons/         SVG icons
```

## Local development

No build step — just serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8090
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the cPanel Git Version Control
setup used to deploy this to production.

## Known gaps before launch

- Phone number, email address, and HCSSA license number are placeholders
  (search for `[Phone number]`, `[Email address]`, `#XXXXXX`) — replace
  with real values.
- The contact form and the caregiver application form both give the
  visitor an in-browser confirmation but do not send data anywhere yet —
  they need a real submit handler (e.g. Formspree, Netlify Forms, or a
  custom API endpoint) before launch.
