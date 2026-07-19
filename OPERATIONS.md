# Operations

## Local development and verification

Use Node.js 24 and npm 11 or newer.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Run the complete release gate with:

```sh
npm run verify
npm run lighthouse
```

`npm run verify` checks portrait assets, Astro types, ESLint, formatting, the production build, and Playwright/axe tests. `npm run lighthouse` audits the home and legal pages three times each and requires scores of at least 95 for performance, accessibility, best practices, and SEO.

## Portraits

Original portraits are private source material and must never enter Git history. Place exactly one source image per person in the ignored directory:

```text
.portrait-source/
├── david.jpg
└── eva.jpg
```

JPEG, PNG, TIFF, and WebP sources are supported. Each source must be at least 1200 pixels on its shorter edge.

```sh
npm run portraits:prepare
npm run portraits:check
```

Preparation strips metadata and writes AVIF, WebP, and JPEG derivatives at 640, 960, and 1280 pixels wide to `public/portraits/`. Only these derivatives are committed. Circular cropping happens in CSS; adjust the `focalPoint` values in `src/data/profiles.ts` when a face needs repositioning.

## GitHub Pages deployment

Pushes to `main` run `.github/workflows/deploy.yml`, including all verification and Lighthouse gates, before deploying `dist/` through GitHub Pages.

Repository Pages settings:

- Build source: GitHub Actions
- Custom domain: `wndff.de`
- Domain ownership: verified for the `savidini` account
- HTTPS: enable only after DNS and certificate checks succeed

Because this site uses a custom GitHub Actions workflow, `public/CNAME` is not authoritative; GitHub's Pages settings store the custom domain. GitHub documents that a `CNAME` file is ignored and not required for Actions-based publishing.

The account-level user site in `savidini/savidini.github.io` uses `savidini.de`. That does not conflict with this project site: configuring `wndff.de` on `savidini/wndff.de` overrides the account-level domain for this repository. The `www` hostnames for both sites can point to the same `savidini.github.io.` CNAME target, while the apex hosts use their own A/AAAA records. GitHub associates each requested custom hostname with its configured Pages site.

References:

- [About custom domains and multiple repositories](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verifying a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)

## DNS

Use the following records for `wndff.de`:

```text
@    A       185.199.108.153
@    A       185.199.109.153
@    A       185.199.110.153
@    A       185.199.111.153
@    AAAA    2606:50c0:8000::153
@    AAAA    2606:50c0:8001::153
@    AAAA    2606:50c0:8002::153
@    AAAA    2606:50c0:8003::153
www  CNAME   savidini.github.io.
```

The trailing dot in `savidini.github.io.` marks it as a fully-qualified domain name. It is required by the current DNS provider behavior; without it, the provider expands the target to the invalid `savidini.github.io.wndff.de.`. The CNAME must not contain the repository name or a URL path.

Verify the records with:

```sh
dig +short wndff.de A
dig +short wndff.de AAAA
dig +short www.wndff.de CNAME
```

The final command must return `savidini.github.io.`. After DNS propagation, confirm the Pages DNS check, wait for the certificate to cover both `wndff.de` and `www.wndff.de`, then enable **Enforce HTTPS** in the repository's Pages settings.

## Legal review

The text at `/legal/` reflects the site's current implementation but should receive qualified German legal review before being treated as final.
