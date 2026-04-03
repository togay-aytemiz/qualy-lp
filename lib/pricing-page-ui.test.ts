import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const readJson = <T>(relativePath: string) =>
  JSON.parse(readFileSync(path.join(process.cwd(), relativePath), 'utf8')) as T;

describe('pricing page ui', () => {
  it('does not render a badge chip above the main pricing hero title', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).not.toContain('{copy.badge}');
    expect(pricingSource).not.toContain('badge:');
  });

  it('removes legacy language-context pricing fields now that pricing copy is local to the page', () => {
    const languageContextSource = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContextSource).not.toContain('priceMonthly:');
    expect(languageContextSource).not.toContain('priceYearly:');
    expect(languageContextSource).not.toContain('save: "Save 20%"');
    expect(languageContextSource).not.toContain('save: "%20 İndirim"');
  });

  it('loads localized pricing copy from dedicated locale message files instead of hardcoding the visible text', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');
    const enMessages = readJson<{ pricingPage: Record<string, unknown> }>('messages/en.json');
    const trMessages = readJson<{ pricingPage: Record<string, unknown> }>('messages/tr.json');

    expect(pricingSource).toContain("../messages/en.json");
    expect(pricingSource).toContain("../messages/tr.json");
    expect(pricingSource).not.toContain('const COPY_BY_LANGUAGE');

    expect(enMessages).toHaveProperty('pricingPage');
    expect(trMessages).toHaveProperty('pricingPage');
  });

  it('includes finalized self-serve tiers with subscription-oriented monthly allowance copy', () => {
    const enMessages = JSON.stringify(readJson('messages/en.json'));
    const trMessages = JSON.stringify(readJson('messages/tr.json'));

    expect(trMessages).toContain('Temel');
    expect(trMessages).toContain('Gelişmiş');
    expect(trMessages).toContain('Profesyonel');

    expect(trMessages).toContain('349');
    expect(trMessages).toContain('649');
    expect(trMessages).toContain('949');

    expect(trMessages).toContain('PAKETE DAHİL KULLANIM');
    expect(trMessages).toContain('Ayda yaklaşık 90-120 konuşma');
    expect(trMessages).toContain('Ayda yaklaşık 180-240 konuşma');
    expect(trMessages).toContain('Ayda yaklaşık 360-480 konuşma');
    expect(trMessages).not.toContain('Ayda yaklaşık 90-120 konuşma dahil');
    expect(trMessages).not.toContain('Ayda yaklaşık 180-240 konuşma dahil');
    expect(trMessages).not.toContain('Ayda yaklaşık 360-480 konuşma dahil');
    expect(enMessages).toContain('USAGE INCLUDED IN PLAN');
    expect(enMessages).toContain('About 90-120 conversations/month');
    expect(enMessages).toContain('About 180-240 conversations/month');
    expect(enMessages).toContain('About 360-480 conversations/month');
    expect(enMessages).not.toContain('About 90-120 conversations/month included');
    expect(enMessages).not.toContain('About 180-240 conversations/month included');
    expect(enMessages).not.toContain('About 360-480 conversations/month included');

    expect(trMessages).not.toContain('1000 KREDİ / AY');
    expect(trMessages).not.toContain('2000 KREDİ / AY');
    expect(trMessages).not.toContain('4000 KREDİ / AY');
    expect(trMessages).not.toContain('kredi / ay');
    expect(enMessages).not.toContain('credits / month');
  });

  it('renders shared standard features inside each pricing card instead of a global top section', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');
    const trMessages = JSON.stringify(readJson('messages/tr.json'));

    expect(pricingSource).toContain('planIncludesLabel');
    expect(pricingSource).toContain('planIncludedFeatures');
    expect(trMessages).toContain('WhatsApp, Instagram, Messenger, Telegram tek gelen kutusu');
    expect(trMessages).toContain('Yetenek + Bilgi Bankası ile yapay zeka yanıtı');
    expect(trMessages).toContain('Kişi nitelendirme ve skorlama');
    expect(trMessages).toContain('Konuşma özeti');
    expect(trMessages).not.toContain('Konuşma özeti ve kişi skoru');
    expect(trMessages).not.toContain('Hazır yanıtlar ve temel raporlar');
    expect(pricingSource).not.toContain('sameFeatures:');
    expect(pricingSource).not.toContain('sameFeatureLabel');
  });

  it('keeps trial messaging card-neutral and renders a left-aligned three-line pricing notes block', () => {
    const messages = `${JSON.stringify(readJson('messages/tr.json'))}\n${JSON.stringify(readJson('messages/en.json'))}`;
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(messages).toContain('14 gün ücretsiz dene');
    expect(messages).toContain('Kart bilgisi gerekmez');
    expect(messages).toContain('Start your 14-day free trial');
    expect(messages).toContain('No card required');
    expect(messages).toContain('Paket ücretine yazılım aboneliği ve aylık kullanım hakkı dahildir.');
    expect(messages).toContain('Fiyatlara KDV dahildir.');
    expect(messages).toContain('Listed prices include VAT.');
    expect(messages).toContain('The plan fee includes software subscription and a monthly usage allowance.');
    expect(messages).not.toContain('Ayrı kredi/token/coin satışı yapılmaz.');
    expect(messages).not.toContain('Separate credit/token/coin sales are not offered.');

    expect(messages).not.toContain('Kredi kartı gerekmez');
    expect(messages).not.toContain('No credit card required');
    expect(pricingSource).toContain('copy.notes.map');
    expect(pricingSource).toContain('text-left text-sm');
    expect(pricingSource).toContain("aria-hidden=\"true\">*</span>");
    expect(pricingSource).toContain('plan.allowanceDescription');
    expect(pricingSource).toContain('items-start gap-2');
    expect(pricingSource).toContain('href={AUTH_URLS.register}');
    expect(pricingSource).not.toContain('trialBadge:');
    expect(pricingSource).not.toContain('trialTitle:');
    expect(pricingSource).not.toContain('trialDescription:');
    expect(pricingSource).not.toContain('topup:');
    expect(pricingSource).not.toContain('Top-up packs');
  });

  it('uses fixed-height card layout and keeps clear spacing above the cta without most-popular badge', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).toContain('flex h-full flex-col');
    expect(pricingSource).toContain('truncate whitespace-nowrap');
    expect(pricingSource).toContain('mb-6 rounded-2xl border');
    expect(pricingSource).toContain('mt-auto inline-flex');
    expect(pricingSource).not.toContain('recommendedRibbon');
    expect(pricingSource).not.toContain('Most popular');
    expect(pricingSource).not.toContain('En çok tercih edilen');
  });

  it('keeps a separate custom-package contact path with dedicated card marker and tr-localized labels', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');
    const messages = `${JSON.stringify(readJson('messages/tr.json'))}\n${JSON.stringify(readJson('messages/en.json'))}`;

    expect(pricingSource).toContain('enterpriseCard');
    expect(messages).toContain('Özel Paket');
    expect(messages).toContain('Özel Çözüm');
    expect(messages).toContain('Özel Teklif Al');
    expect(pricingSource).toContain('data-pricing-enterprise="true"');
    expect(messages).not.toContain('kredi hacmi');
    expect(messages).not.toContain('monthly credits');
  });

  it('uses slightly roomier line-height on pricing hero headline for multiline titles', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).toContain('leading-[1.15]');
    expect(pricingSource).toContain('md:leading-[1.12]');
  });

  it('uses section-level background gradient to soften footer transition without extra overlay layers', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).toContain('bg-[linear-gradient(to_bottom,#f8fafc_0%,#f8fafc_82%,#ffffff_100%)]');
    expect(pricingSource).not.toContain('data-pricing-footer-fade="true"');
  });
});
