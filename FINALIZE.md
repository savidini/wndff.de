# Finalization checklist

1. Add the original portraits as `.portrait-source/david.*` and `.portrait-source/eva.*`. Each image must be at least 1200 px on its shorter edge.
2. Generate and review the responsive crops:

   ```sh
   npm run portraits:prepare
   npm run verify
   npm run lighthouse
   ```

   Adjust the focal points in `src/data/profiles.ts` if either crop needs repositioning.

3. Have `/legal/` reviewed by a qualified German legal professional and incorporate any required changes.
4. Initialize and publish the repository from a workspace with a writable `.git` directory:

   ```sh
   git init -b main
   git add .
   git commit -m "Launch wndff.de landing page"
   gh auth refresh -h github.com
   gh repo create savidini/wndff.de --public --source=. --remote=origin --push
   ```

5. In the repository settings, select **GitHub Actions** as the Pages source and set `wndff.de` as the custom domain.
6. Verify the domain with GitHub's account-specific TXT record before changing DNS. Then apply the A, AAAA, and `www` CNAME records documented in `README.md`.
7. After propagation, make `wndff.de` primary, enable HTTPS, and verify the production site on desktop and mobile.
