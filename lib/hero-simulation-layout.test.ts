import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('hero simulation layout', () => {
  it('defines data-driven inbox queue for the desktop simulation panel', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');

    expect(hero).toContain('const scenarios = useMemo(() => t.hero.mockup.animatedScenarios, [t]);');
    expect(hero).toContain('const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);');
    expect(hero).toContain('const [visibleStep, setVisibleStep] = useState(0);');
    expect(hero).toContain("const visibleCustomerMessages = visibleMessages.filter((message) => message.role === 'customer');");
    expect(hero).toContain('Math.max(0, visibleCustomerMessages.length - 1)');
    expect(hero).toContain('key={`${activeScenarioIndex}-${visibleCustomerStep}-intent`}');
    expect(hero).toContain('key={`${activeScenarioIndex}-${visibleCustomerStep}-${selectedLeadScore}`}');
    expect(hero).toContain('key={`${activeScenarioIndex}-${visibleCustomerStep}-score-progress`}');
    expect(hero).toContain(': 4300);');
  });

  it('uses muted desktop panel shell styles matching product inbox UI direction', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');

    expect(hero).toContain('rounded-[30px] border border-slate-200 bg-[#ECEFF3]');
    expect(hero).toContain('rounded-[26px] border border-slate-200 bg-white');
    expect(hero).toContain('md:min-h-screen');
    expect(hero).toContain('h-[650px]');
    expect(hero).toContain('sm:h-[700px]');
    expect(hero).toContain('md:h-auto md:aspect-[16/9]');
    expect(hero).toContain('flex min-h-0 flex-1 overflow-hidden');
    expect(hero).toContain('overflow-y-auto overscroll-contain');
    expect(hero).toContain('flex min-h-full flex-col justify-end gap-5');
    expect(hero).not.toContain('aspect-[16/10]');
    expect(hero).not.toContain('h-32 w-full bg-gradient-to-b from-transparent via-white to-white');
    expect(hero).not.toContain('h-20 bg-gradient-to-t from-white via-white/80 to-transparent');
  });

  it('uses leadqualifier-style platform icons and avoids unknown placeholder naming in sidebar', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');

    expect(hero).toContain("from 'react-icons/ri'");
    expect(hero).toContain('RiWhatsappFill');
    expect(hero).toContain('RiInstagramFill');
    expect(hero).toContain('RiTelegramFill');
    expect(hero).toContain('size={size}');
    expect(hero).toContain('absolute -bottom-4');
    expect(hero).toContain('border-[0.15px] border-white/20');
    expect(hero).toContain('t.hero.mockup.animatedScenarios');
    expect(hero).toContain('activeScenario.messages.slice(0, visibleStep + 1)');
    expect(hero).toContain('setActiveScenarioIndex((current) => (current + 1) % scenarios.length);');
    expect(hero).toContain("const [simulationPhase, setSimulationPhase] = useState<'idle' | 'typing'>('idle');");
    expect(hero).toContain('t.hero.mockup.thinking');
    expect(hero).toContain('t.hero.mockup.typing');
    expect(hero).toContain('t.hero.mockup.summaryTitle');
    expect(hero).toContain('t.hero.mockup.summaryPlaceholder');
    expect(hero).toContain('HiMiniSparkles');
    expect(hero).toContain('ChevronDown');
    expect(hero).toContain('t.hero.mockup.composerPlaceholder');
    expect(hero).toContain('t.hero.mockup.leadScoreShort');
    expect(hero).toContain('renderPlatformIcon(activeScenario.platform, 16)');
    expect(hero).toContain('const renderPlatformIcon = (platform: Platform, size = 20)');
    expect(hero).toContain('chatViewportRef');
    expect(hero).toContain('isMobileViewport');
    expect(hero).toContain("window.matchMedia('(max-width: 767px)')");
    expect(hero).toContain('viewport.scrollTo');
    expect(hero).toContain('mobile-scrollbar-hide');
    expect(hero).toContain('layout={isMobileViewport && !prefersReducedMotion}');
    expect(hero).toContain('hidden h-2 w-2 rounded-full bg-emerald-500 sm:block');
    expect(hero).toContain('hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 sm:flex');
    expect(hero).toContain('sm:hidden flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5');
    expect(hero).toContain('t.hero.mockup.onlineShort');
    expect(hero).toContain('text-sm font-semibold text-slate-700 sm:hidden');
    expect(hero).toContain('type="text"');
    expect(hero).toContain('h-10 shrink-0 rounded-lg bg-gray-900');
    expect((hero.match(/t\.hero\.mockup\.takeOver/g) ?? []).length).toBe(1);
    expect(hero).toContain('getLeadToneLabel(score)');
    expect(hero).toContain('bg-red-50 text-red-700');
    expect(hero).toContain('bg-amber-50 text-amber-700');
    expect(hero).toContain('bg-slate-100 text-slate-600');
    expect(hero).not.toContain('t.hero.mockup.newLead');
    expect(hero).not.toContain('t.hero.mockup.unknown');
  });
});
