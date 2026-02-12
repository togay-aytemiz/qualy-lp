import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('cta visual system', () => {
  it('uses only channel svg badges, keeps them borderless, and removes trial-note copy', () => {
    const ctaSource = readFileSync(path.join(process.cwd(), 'components', 'CTA.tsx'), 'utf8');

    expect(ctaSource).toContain("src: '/whatsapp.svg'");
    expect(ctaSource).toContain("src: '/instagram.svg'");
    expect(ctaSource).toContain("src: '/Telegram.svg'");
    expect(ctaSource).toContain("src: '/messenger.svg'");
    expect(ctaSource).not.toContain("type: 'system'");
    expect(ctaSource).not.toContain('border border-slate-200');
    expect(ctaSource).not.toContain('border border-slate-100');
    expect(ctaSource).toContain('bg-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)]');
    expect(ctaSource).not.toContain('{t.cta.note}');
  });

  it('uses softer CTA copy without team-heavy emphasis in Turkish and English', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('title: "Mesaj trafiğini temiz bir akışa çevirmeye hazır mısın?"');
    expect(languageContext).toContain('desc: "Tekrarlayan mesajları otomatik yanıtla, adayları erken nitelendir ve yüksek niyetli konuşmaları doğru anda devral."');
    expect(languageContext).toContain('title: "Ready to turn message traffic into a cleaner flow?"');
    expect(languageContext).toContain('desc: "Automate repetitive messaging, qualify leads earlier, and take over high-intent conversations at the right moment."');
    expect(languageContext).not.toContain('let your team focus on conversations that convert');
    expect(languageContext).not.toContain('ekibinizin dönüşecek konuşmalara odaklanmasını sağlayın');
  });
});
