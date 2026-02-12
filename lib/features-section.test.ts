import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('features section content and layout', () => {
  it('uses a five-feature grid and adds the profile extraction block', () => {
    const featuresSource = readFileSync(path.join(process.cwd(), 'components', 'Features.tsx'), 'utf8');

    expect(featuresSource).toContain('t.features.heading_mobile');
    expect(featuresSource).toContain('hidden md:inline');
    expect(featuresSource).toContain('t.features.feat1_mockup_kb_items.map');
    expect(featuresSource).toContain('t.features.feat1_mockup_skill_items.map');
    expect(featuresSource).toContain("{ name: 'Messenger', status: false");
    expect(featuresSource).not.toContain('bg-slate-950');
    expect(featuresSource).not.toContain('t.features.feat1_mockup_step1');
    expect(featuresSource).not.toContain('t.features.feat1_mockup_preview_label');
    expect(featuresSource).not.toContain('Do you have a price list?');
    expect(featuresSource).not.toContain('Reading document...');
    expect(featuresSource).not.toContain('Here is the summary of our Growth package...');
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

    expect(languageContext).toContain('heading_mobile: "Yoğun mesaj trafiğini düzenli akışa çevir."');
    expect(languageContext).toContain('heading_mobile: "Turn heavy message traffic into an organized flow."');
    expect(languageContext).toContain('feat1_title: "Koda dokunmadan işletmeni Qualy\'ye öğret. 5 dk\'da hazır"');
    expect(languageContext).toContain('feat1_title: "Teach Qualy your business without touching code. Ready in 5 min"');
    expect(languageContext).toContain('feat1_title_highlight: "5 dk\'da hazır"');
    expect(languageContext).toContain('feat1_title_highlight: "Ready in 5 min"');
    expect(languageContext).toContain('feat2_title: "Qualy yapay zeka ile mesajları cevaplar ve otomatik skor üretir"');
    expect(languageContext).toContain('feat2_title: "Qualy replies to messages with AI and generates scores automatically"');
    expect(languageContext).toContain('feat2_title_highlight: "yapay zeka ile"');
    expect(languageContext).toContain('feat2_title_highlight: "with AI"');
    expect(languageContext).toContain('feat3_title: "Tüm konuşmalar tek ekranda"');
    expect(languageContext).toContain('feat3_title: "All conversations on one screen"');
    expect(languageContext).toContain('feat3_mockup_easy: "Dakikalar içinde bağlantı"');
    expect(languageContext).toContain('feat3_mockup_easy: "Connect in minutes"');
    expect(languageContext).toContain('feat4_title: "Gerekli durumlarda insan devri"');
    expect(languageContext).toContain('feat4_title: "Human handover when needed"');
    expect(languageContext).toContain('feat4_title_highlight: "insan devri"');
    expect(languageContext).toContain('feat4_title_highlight: "Human handover"');
    expect(languageContext).toContain('feat5_title_highlight: "otomatik netleştirir"');
    expect(languageContext).toContain('feat5_title_highlight: "automatically clarifies missing details"');
    expect(languageContext).toContain('"Tek tıkla devral"');
    expect(languageContext).toContain('"One-click take over"');
    expect(languageContext).toContain('feat1_desc1: "İşletmenle ilgili dokümanlarını ve hazır yanıtlarını ekle. Qualy bunları referans alarak tutarlı yanıt verir."');
    expect(languageContext).toContain('feat1_desc1: "Add your business documents and ready responses. Qualy uses them as references for consistent replies."');
    expect(languageContext).toContain('feat1_mockup_kb_items');
    expect(languageContext).toContain('feat1_mockup_skill_items');
    expect(languageContext).toContain('"İptal politikası"');
    expect(languageContext).toContain('"Cancellation policy"');
    expect(languageContext).toContain('Qualy, tüm konuşmalarını tek yerde toplar; yapay zeka ile yanıt verir, niyeti puanlar ve yalnızca doğru konuşmalara odaklanmanı sağlar.');
    expect(languageContext).toContain('Qualy brings all your conversations into one place; replies with AI, scores intent, and helps you focus only on the right conversations.');
    expect(languageContext).not.toContain('Qualy, WhatsApp, Instagram ve Telegram konuşmalarını tek yerde toplar; Yetenekler ve Bilgi Bankasıyla yanıt verir, niyeti puanlar ve yalnızca doğru konuşmalara odaklanmanızı sağlar.');
    expect(languageContext).not.toContain('Qualy brings WhatsApp, Instagram, and Telegram conversations into one inbox, answers with Skills + Knowledge Base, scores intent, and helps your team focus only on the right conversations.');
    expect(languageContext).toContain('feat5_title');
    expect(languageContext).not.toContain('MVP için yerleşik kontrol katmanı');
    expect(languageContext).toContain('feat2_mockup_processing: "Çıkarım yapılıyor"');
  });

  it('aligns first-row cards and uses platform icons in channels card', () => {
    const featuresSource = readFileSync(path.join(process.cwd(), 'components', 'Features.tsx'), 'utf8');

    expect(featuresSource).toContain("logo: '/whatsapp.svg'");
    expect(featuresSource).toContain("logo: '/instagram.svg'");
    expect(featuresSource).toContain("logo: '/Telegram.svg'");
    expect(featuresSource).toContain('lg:col-span-4 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50 flex flex-col');
    expect(featuresSource).toContain('lg:col-span-2 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50 flex flex-col');
    expect(featuresSource).toContain('mt-auto relative h-[320px] md:h-[350px]');
  });
});
