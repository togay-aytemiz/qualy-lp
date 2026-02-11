import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('impact metrics section', () => {
  it('lazy loads the impact metrics section component', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain('lazy(() => import(\'./components/ImpactMetrics\'))');
  });

  it('renders impact metrics between challenges and features', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    const challengesIndex = appSource.indexOf('<Challenges />');
    const impactMetricsIndex = appSource.indexOf('<ImpactMetrics />');
    const featuresIndex = appSource.indexOf('<Features />');

    expect(challengesIndex).toBeGreaterThan(-1);
    expect(impactMetricsIndex).toBeGreaterThan(-1);
    expect(featuresIndex).toBeGreaterThan(-1);
    expect(challengesIndex).toBeLessThan(impactMetricsIndex);
    expect(impactMetricsIndex).toBeLessThan(featuresIndex);
  });
});
