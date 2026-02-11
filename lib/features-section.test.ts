import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('features section content and layout', () => {
  it('uses a five-feature grid and adds the profile extraction block', () => {
    const featuresSource = readFileSync(path.join(process.cwd(), 'components', 'Features.tsx'), 'utf8');

    expect(featuresSource).toContain('t.features.heading_mobile');
    expect(featuresSource).toContain('hidden md:inline');
    expect(featuresSource).toContain('title={t.features.feat1_title}');
    expect(featuresSource).toContain('title={t.features.feat2_title}');
    expect(featuresSource).toContain('title={t.features.feat3_title}');
    expect(featuresSource).toContain('title={t.features.feat4_title}');
    expect(featuresSource).toContain('t.features.feat5_title');
    expect(featuresSource).toContain('t.features.feat5_desc');
    expect(featuresSource).toContain('lg:col-span-6');
  });

  it('uses customer-focused Turkish copy in features intro', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('heading_mobile: "Yoğun mesaj trafiğini düzenli akışa çevirin."');
    expect(languageContext).toContain('heading_mobile: "Turn heavy message traffic into an organized flow."');
    expect(languageContext).toContain('Qualy, tüm konuşmalarınızı tek yerde toplar; yapay zeka ile yanıt verir, niyeti puanlar ve yalnızca doğru konuşmalara odaklanmanızı sağlar.');
    expect(languageContext).toContain('Qualy brings all your conversations into one place; replies with AI, scores intent, and helps you focus only on the right conversations.');
    expect(languageContext).not.toContain('Qualy, WhatsApp, Instagram ve Telegram konuşmalarını tek yerde toplar; Yetenekler ve Bilgi Bankasıyla yanıt verir, niyeti puanlar ve yalnızca doğru konuşmalara odaklanmanızı sağlar.');
    expect(languageContext).not.toContain('Qualy brings WhatsApp, Instagram, and Telegram conversations into one inbox, answers with Skills + Knowledge Base, scores intent, and helps your team focus only on the right conversations.');
    expect(languageContext).toContain('feat5_title');
    expect(languageContext).not.toContain('MVP için yerleşik kontrol katmanı');
    expect(languageContext).toContain('feat2_mockup_processing: "Çıkarım yapılıyor"');
  });

  it('aligns first-row cards and uses platform icons in channels card', () => {
    const featuresSource = readFileSync(path.join(process.cwd(), 'components', 'Features.tsx'), 'utf8');

    expect(featuresSource).toContain('RiWhatsappFill');
    expect(featuresSource).toContain('RiInstagramFill');
    expect(featuresSource).toContain('RiTelegramFill');
    expect(featuresSource).toContain('lg:col-span-4 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50 flex flex-col');
    expect(featuresSource).toContain('lg:col-span-2 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50 flex flex-col');
    expect(featuresSource).toContain('mt-auto relative h-[300px] md:h-[350px]');
  });
});
