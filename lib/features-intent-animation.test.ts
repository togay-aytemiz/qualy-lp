import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('features intent scoring card animation', () => {
  it('keeps card footprint and adds looping message-to-score flow', () => {
    const featuresSource = readFileSync(path.join(process.cwd(), 'components', 'Features.tsx'), 'utf8');

    expect(featuresSource).toContain('col-span-1 lg:col-span-4');
    expect(featuresSource).toContain('h-[380px] md:h-[350px]');
    expect(featuresSource).toContain("style={{ overflowAnchor: 'none' }}");
    expect(featuresSource).toContain('const mobileVisibleMessages = visibleMessages.slice(-2);');
    expect(featuresSource).toContain('const desktopVisibleMessages = visibleMessages.slice(-3);');
    expect(featuresSource).toContain('md:hidden h-full w-full bg-white p-2 flex min-h-0 flex-col');
    expect(featuresSource).toContain('mt-2 min-h-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-2 overflow-hidden');
    expect(featuresSource).toContain('hidden md:flex h-full w-full min-h-0');
    expect(featuresSource).toContain('w-1/2 border-r border-slate-100 bg-white p-3 md:p-4 flex flex-col min-h-0');
    expect(featuresSource).toContain('w-1/2 border-r border-slate-100 bg-white p-3 md:p-4 flex flex-col min-h-0 overflow-hidden');
    expect(featuresSource).toContain('mt-3 min-h-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-2.5 md:p-3 overflow-hidden');
    expect(featuresSource).toContain('flex h-full min-h-0 flex-col justify-end gap-2 overflow-hidden');
    expect(featuresSource).toContain('{desktopVisibleMessages.map((message) => (');
    expect(featuresSource).toContain('max-h-[54px] overflow-hidden');
    expect(featuresSource).toContain('max-h-[56px] overflow-hidden max-w-[88%]');
    expect(featuresSource).toContain('name: second?.name ?? t.hero.mockup.thirdLeadName');
    expect(featuresSource).not.toContain("name: 'Qualy'");
    expect(featuresSource).toContain('className="mt-2 flex items-center justify-between gap-2">');
    expect(featuresSource).toContain('<p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{t.hero.mockup.leadScore}</p>');
    expect(featuresSource).toContain('t.hero.mockup.animatedScenarios');
    expect(featuresSource).toContain('setActiveScenarioIndex');
    expect(featuresSource).toContain('setActiveMessageIndex');
    expect(featuresSource).toContain('scoreProgress');
    expect(featuresSource).toContain('leftStatusLabel');
    expect(featuresSource).toContain('extractionPhaseLabel');
    expect(featuresSource).toContain('activeScenarioPlatform');
    expect(featuresSource).toContain('activeScenarioPlatformLogo');
    expect(featuresSource).toContain('activeScenarioPlatform.label');
  });
});
