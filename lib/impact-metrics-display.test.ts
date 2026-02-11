import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { formatMetricValue, getMetricTargetValue } from './impact-metrics';

describe('impact metrics display', () => {
  it('formats values without signed prefixes', () => {
    expect(formatMetricValue('-78%')).toBe('78%');
    expect(formatMetricValue('+42%')).toBe('42%');
    expect(formatMetricValue('29%')).toBe('29%');
  });

  it('extracts absolute numeric targets for count-up animation', () => {
    expect(getMetricTargetValue('-61%')).toBe(61);
    expect(getMetricTargetValue('+42%')).toBe(42);
    expect(getMetricTargetValue('29%')).toBe(29);
  });

  it('includes icon mapping and count-up behavior in the section component', () => {
    const impactMetricsSource = readFileSync(
      path.join(process.cwd(), 'components/ImpactMetrics.tsx'),
      'utf8',
    );

    expect(impactMetricsSource).toContain('animate(0, numericTarget');
    expect(impactMetricsSource).toContain('FaStopwatch');
    expect(impactMetricsSource).toContain('FaMessage');
    expect(impactMetricsSource).toContain('FaRankingStar');
    expect(impactMetricsSource).toContain('FaCalendarCheck');
    expect(impactMetricsSource).not.toContain('rotate: 360');
    expect(impactMetricsSource).toContain('formatMetricValue(metric.value)');
    expect(impactMetricsSource).toContain('text-black');
    expect(impactMetricsSource).not.toContain('text-blue-500/90');
    expect(impactMetricsSource).toContain('max-w-[38ch]');
  });
});
