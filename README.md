# wndff.de

A static, two-person landing page for David and Eva Wendorff. It is built with Astro and TypeScript, has no client framework or backend, and is designed for GitHub Pages.

## Local development

Use Node.js 24 and npm 11 or newer.

```sh
npm ci
npm run dev
```

The full verification command checks portrait assets, Astro types, ESLint, formatting, the production build, and Playwright/axe tests:

```sh
npx playwright install chromium
npm run verify
```

`npm run verify:code` runs the same code and browser checks without the portrait publication gate. `npm run lighthouse` checks the 95+ performance, accessibility, best-practices, and SEO targets against the built site.

## Portrait workflow

Original portraits are private source material and must not enter Git history. Create the ignored `.portrait-source/` directory and place exactly two high-resolution originals inside it:

```text
.portrait-source/
├── david.jpg
└── eva.jpg
```

JPEG, PNG, TIFF, or WebP originals are accepted. Each original must be at least 1200 pixels on its shorter edge. Then run:

```sh
npm run portraits:prepare
npm run portraits:check
```

The preparation command strips metadata and writes AVIF, WebP, and JPEG derivatives at 640, 960, and 1280 pixels wide. Only these responsive derivatives in `public/portraits/` are committed. The page renders them in stable 4:5 frames using the focal points in `src/data/profiles.ts`; review those crops visually and adjust the focal points if necessary.

## Deployment

Pushes to `main` run all checks and deploy `dist/` through GitHub Pages. CI intentionally fails if either portrait set is absent, so no placeholder build can reach production.

After creating the public `savidini/wndff.de` repository, select **GitHub Actions** as the Pages build source and configure `wndff.de` as the custom domain. Verify the domain in the GitHub account before changing DNS. The current GitHub Pages records are:

```text
@    A       185.199.108.153
@    A       185.199.109.153
@    A       185.199.110.153
@    A       185.199.111.153
@    AAAA    2606:50c0:8000::153
@    AAAA    2606:50c0:8001::153
@    AAAA    2606:50c0:8002::153
@    AAAA    2606:50c0:8003::153
www  CNAME   savidini.github.io
```

Make `wndff.de` primary and enable HTTPS after DNS and certificate propagation. Recheck the values against [GitHub’s custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) before the cutover.

## Privacy and rights

The site uses no analytics, trackers, remote fonts, embeds, or third-party requests on initial load. Legal text is maintained at `/legal/` and must receive qualified review before production.

No license is granted for this repository. All rights are reserved. In particular, portraits, names, personal likenesses, and other personal material may not be copied or reused without the relevant person’s explicit permission.
