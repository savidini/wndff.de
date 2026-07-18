import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

execFileSync(join(process.cwd(), 'node_modules', '.bin', 'lhci'), ['autorun'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CHROME_PATH: chromium.executablePath(),
  },
});
