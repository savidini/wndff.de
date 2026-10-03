import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const expectedProfiles = [
  {
    id: 'david',
    name: 'David Wendorff',
    field: 'Industrial Robotics and Assembly Automation',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/wndff/' },
      { label: 'GitHub', url: 'https://github.com/savidini' },
    ],
  },
  {
    id: 'eva',
    name: 'Eva Wendorff',
    field: 'Specialty Coffee Operations & Leadership',
    links: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/evawendorff/',
      },
    ],
  },
] as const;

test.describe('landing page', () => {
  test('has equal desktop columns', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page).toHaveTitle('wndff.de');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      'href',
      '/favicon.svg?v=3',
    );

    const [david, eva] = await Promise.all([
      page.locator('#david').boundingBox(),
      page.locator('#eva').boundingBox(),
    ]);
    expect(david).not.toBeNull();
    expect(eva).not.toBeNull();
    expect(david?.x).toBeCloseTo(0, 0);
    expect(david?.width).toBeCloseTo(720, 0);
    expect(eva?.x).toBeCloseTo(720, 0);
    expect(eva?.width).toBeCloseTo(720, 0);
    expect(david?.height).toBeCloseTo(900, 0);
    expect(eva?.height).toBeCloseTo(900, 0);
  });

  test('uses a static composition without decorative scene animation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.locator('.pixel-scene, .art')).toHaveCount(0);
    const animatedElements = await page
      .locator('.profile *')
      .evaluateAll(
        (elements) =>
          elements.filter(
            (element) => getComputedStyle(element).animationName !== 'none',
          ).length,
      );
    expect(animatedElements).toBe(0);
  });

  test('fills mobile viewports with equal sections and no page overflow', async ({
    page,
  }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 390, height: 667 },
      { width: 320, height: 568 },
      { width: 430, height: 932 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const [home, david, eva] = await Promise.all([
        page.locator('.static-home').boundingBox(),
        page.locator('#david').boundingBox(),
        page.locator('#eva').boundingBox(),
      ]);
      expect(home).not.toBeNull();
      expect(david).not.toBeNull();
      expect(eva).not.toBeNull();
      expect(home?.height).toBeCloseTo(viewport.height, 0);
      expect(david?.x).toBeCloseTo(0, 0);
      expect(eva?.x).toBeCloseTo(0, 0);
      expect(david?.width).toBeCloseTo(viewport.width, 0);
      expect(eva?.width).toBeCloseTo(viewport.width, 0);
      expect(
        Math.abs((david?.height ?? 0) - (eva?.height ?? 0)),
      ).toBeLessThanOrEqual(1);
      expect(eva?.y).toBeCloseTo((david?.y ?? 0) + (david?.height ?? 0), 0);
      expect((eva?.y ?? 0) + (eva?.height ?? 0)).toBeCloseTo(
        viewport.height,
        0,
      );

      const overflow = await page.evaluate(() => ({
        horizontal:
          document.documentElement.scrollWidth > window.innerWidth ||
          document.body.scrollWidth > window.innerWidth,
        vertical:
          document.documentElement.scrollHeight > window.innerHeight ||
          document.body.scrollHeight > window.innerHeight,
      }));
      expect(overflow).toEqual({ horizontal: false, vertical: false });

      const [evaLinks, legalLink] = await Promise.all([
        page.locator('#eva .profile__links').boundingBox(),
        page.locator('.legal-link--home-corner').boundingBox(),
      ]);
      expect(
        (legalLink?.y ?? 0) - ((evaLinks?.y ?? 0) + (evaLinks?.height ?? 0)),
      ).toBeGreaterThanOrEqual(12);

      const mobileLinkSizes = await page.evaluate(() => ({
        legal: Number.parseFloat(
          getComputedStyle(document.querySelector('.legal-link--home-corner')!)
            .fontSize,
        ),
        profile: Number.parseFloat(
          getComputedStyle(document.querySelector('#eva .profile__link')!)
            .fontSize,
        ),
      }));
      expect(mobileLinkSizes.legal).toBeLessThan(mobileLinkSizes.profile);

      for (const link of await page.getByRole('link').all()) {
        const box = await link.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        expect(box?.width).toBeGreaterThanOrEqual(44);
      }

      for (const profile of ['#david', '#eva']) {
        const [panel, portrait, content] = await Promise.all([
          page.locator(profile).boundingBox(),
          page.locator(`${profile} .portrait`).boundingBox(),
          page.locator(`${profile} .profile__content`).boundingBox(),
        ]);
        expect((portrait?.y ?? 0) >= (panel?.y ?? 0)).toBe(true);
        expect(
          (content?.y ?? 0) + (content?.height ?? 0) <=
            (panel?.y ?? 0) + (panel?.height ?? 0),
        ).toBe(true);
      }
    }
  });

  test('fills a short mobile landscape viewport without page overflow', async ({
    page,
  }) => {
    const viewport = { width: 844, height: 390 };
    await page.setViewportSize(viewport);
    await page.goto('/');

    const [home, david, eva] = await Promise.all([
      page.locator('.static-home').boundingBox(),
      page.locator('#david').boundingBox(),
      page.locator('#eva').boundingBox(),
    ]);
    expect(home?.height).toBeCloseTo(viewport.height, 0);
    expect(david?.x).toBeCloseTo(0, 0);
    expect(david?.width).toBeCloseTo(viewport.width / 2, 0);
    expect(david?.height).toBeCloseTo(viewport.height, 0);
    expect(eva?.x).toBeCloseTo(viewport.width / 2, 0);
    expect(eva?.width).toBeCloseTo(viewport.width / 2, 0);
    expect(eva?.height).toBeCloseTo(viewport.height, 0);

    const overflow = await page.evaluate(() => ({
      horizontal:
        document.documentElement.scrollWidth > window.innerWidth ||
        document.body.scrollWidth > window.innerWidth,
      vertical:
        document.documentElement.scrollHeight > window.innerHeight ||
        document.body.scrollHeight > window.innerHeight,
    }));
    expect(overflow).toEqual({ horizontal: false, vertical: false });
  });

  test('shows circular portraits and all intended secure profile links', async ({
    page,
  }) => {
    await page.goto('/');

    for (const profile of expectedProfiles) {
      const panel = page.locator(`#${profile.id}`);
      await expect(
        panel.getByRole('heading', { name: profile.name }),
      ).toBeVisible();
      await expect(
        panel.getByText(profile.field, { exact: true }),
      ).toBeVisible();

      const portrait = panel.locator('.portrait__image');
      const portraitBox = await portrait.boundingBox();
      expect(portraitBox?.width).toBeCloseTo(portraitBox?.height ?? 0, 0);
      await expect(portrait).toHaveCSS('border-radius', /50%/);

      const portraitImage = portrait.locator('img');
      await expect(portraitImage).toHaveAttribute('loading', 'eager');
      await expect(portraitImage).toHaveAttribute('fetchpriority', 'high');
      await expect(portraitImage).toHaveJSProperty('complete', true);
      expect(
        await portraitImage.evaluate(
          (image: HTMLImageElement) => image.naturalWidth,
        ),
      ).toBeGreaterThan(0);

      for (const expectedLink of profile.links) {
        const link = panel.getByRole('link', {
          name: new RegExp(`${expectedLink.label} — ${profile.name}`),
        });
        await expect(link).toHaveText(expectedLink.label);
        await expect(link).toHaveAttribute('href', expectedLink.url);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', /noopener/);
        await expect(link).toHaveAttribute('rel', /noreferrer/);
      }
    }

    await expect(page.locator('a[href="https://savidini.de/"]')).toHaveCount(0);
  });

  test('has semantic headings, visible keyboard focus, and no axe violations', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(2);
    const orderedLinks = [
      page.getByRole('link', {
        name: 'LinkedIn — David Wendorff (opens in a new tab)',
        exact: true,
      }),
      page.getByRole('link', {
        name: 'GitHub — David Wendorff (opens in a new tab)',
        exact: true,
      }),
      page.getByRole('link', {
        name: 'LinkedIn — Eva Wendorff (opens in a new tab)',
        exact: true,
      }),
      page.getByRole('link', { name: 'Impressum & Datenschutz', exact: true }),
    ] as const;
    for (const link of orderedLinks) {
      await page.keyboard.press('Tab');
      await expect(link).toBeFocused();
      const focusStyle = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          style: style.outlineStyle,
          width: Number.parseFloat(style.outlineWidth),
        };
      });
      expect(focusStyle.style).toBe('solid');
      expect(focusStyle.width).toBeGreaterThanOrEqual(2);
    }

    // Include the warm panel's accent text in the accessibility audit.
    await orderedLinks[2].focus();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('fully disables motion when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const movingElements = await page.locator('.profile *').evaluateAll(
      (elements) =>
        elements.filter((element) => {
          return [null, '::before', '::after'].some((pseudo) => {
            const style = getComputedStyle(element, pseudo);
            return (
              style.animationName !== 'none' ||
              style.transitionDuration !== '0s'
            );
          });
        }).length,
    );
    expect(movingElements).toBe(0);
  });

  test('keeps enlarged text and links reachable on a narrow screen', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));
    expect(dimensions.width).toBe(320);
    expect(dimensions.height).toBeGreaterThan(568);

    for (const profile of ['#david', '#eva']) {
      const panel = (await page.locator(profile).boundingBox())!;
      for (const selector of [
        '.portrait',
        'h2',
        '.profile__field',
        '.profile__links',
      ]) {
        const content = (await page
          .locator(`${profile} ${selector}`)
          .boundingBox())!;
        expect(content.x).toBeGreaterThanOrEqual(panel.x);
        expect(content.x + content.width).toBeLessThanOrEqual(
          panel.x + panel.width,
        );
        expect(content.y).toBeGreaterThanOrEqual(panel.y);
        expect(content.y + content.height).toBeLessThanOrEqual(
          panel.y + panel.height,
        );
      }
    }
    for (const link of await page.getByRole('link').all()) {
      await link.focus();
      await expect(link).toBeInViewport();
      const bounds = (await link.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
    }
    const evaLinks = (await page
      .locator('#eva .profile__links')
      .boundingBox())!;
    const legalLink = (await page
      .locator('.legal-link--home-corner')
      .boundingBox())!;
    expect(legalLink.y).toBeGreaterThan(evaLinks.y + evaLinks.height);
  });

  test('makes no third-party request during initial load', async ({ page }) => {
    const externalHosts = new Set<string>();
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (!['127.0.0.1', 'localhost'].includes(url.hostname))
        externalHosts.add(url.hostname);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect([...externalHosts]).toEqual([]);
    await expect(
      page.locator('script:not([type="application/ld+json"])'),
    ).toHaveCount(0);
  });
});

test.describe('static routes', () => {
  test('loads the legal page directly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto('/legal/');
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Impressum & Datenschutz',
    );
    await expect(
      page.getByRole('heading', { level: 2, name: 'Datenschutz' }),
    ).toBeVisible();
    await expect(page.locator('address')).toContainText('Schaeferwall 11');
    await expect(
      page.locator('section[aria-labelledby="hosting"]'),
    ).toContainText(
      'in der Dokumentation zur Datensammlung bei GitHub Pages und in der Datenschutzerklärung von GitHub',
    );
    await expect(page.locator('.obfuscated-email')).toHaveCount(2);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Hinweis' })).toHaveCount(0);

    const emailSymbols = await page
      .locator('.obfuscated-email')
      .first()
      .evaluate((element) => ({
        at: getComputedStyle(
          element.querySelector('.obfuscated-email__join')!,
          '::before',
        ).content,
        dot: getComputedStyle(
          element.querySelector('.obfuscated-email__break')!,
          '::before',
        ).content,
      }));
    expect(emailSymbols).toEqual({ at: '"@"', dot: '"."' });

    const html = await page.content();
    expect(html).not.toContain('david@wndff.de');

    const [provider, privacy] = await Promise.all([
      page.locator('.legal-panel--provider').boundingBox(),
      page.locator('.legal-panel--privacy').boundingBox(),
    ]);
    expect(provider?.x).toBeCloseTo(0, 0);
    expect(provider?.width).toBeCloseTo(720, 0);
    expect(privacy?.x).toBeCloseTo(720, 0);
    expect(privacy?.width).toBeCloseTo(720, 0);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('stacks the legal panels on mobile without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/legal/');

    const [provider, privacy] = await Promise.all([
      page.locator('.legal-panel--provider').boundingBox(),
      page.locator('.legal-panel--privacy').boundingBox(),
    ]);
    expect(provider?.x).toBeCloseTo(0, 0);
    expect(provider?.width).toBeCloseTo(390, 0);
    expect(privacy?.x).toBeCloseTo(0, 0);
    expect(privacy?.width).toBeCloseTo(390, 0);
    expect(privacy?.y).toBeCloseTo(
      (provider?.y ?? 0) + (provider?.height ?? 0),
      0,
    );

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBe(false);
  });

  test('includes a styled static 404 page', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Diese Seite gibt es nicht.',
    );
    await expect(
      page.getByRole('link', { name: 'Zur Startseite' }),
    ).toHaveAttribute('href', '/');
    await expect(page.locator('.not-found-page')).toBeVisible();
  });
});
