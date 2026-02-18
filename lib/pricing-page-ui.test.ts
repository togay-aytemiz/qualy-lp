import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

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

  it('includes finalized self-serve tiers with distinct prices and credits', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).toContain('Temel');
    expect(pricingSource).toContain('Gelişmiş');
    expect(pricingSource).toContain('Profesyonel');

    expect(pricingSource).toContain('349');
    expect(pricingSource).toContain('649');
    expect(pricingSource).toContain('949');

    expect(pricingSource).toContain('1000');
    expect(pricingSource).toContain('2000');
    expect(pricingSource).toContain('4000');

    expect(pricingSource).toContain('Ayda yaklaşık 90-120 konuşma');
    expect(pricingSource).toContain('Ayda yaklaşık 180-240 konuşma');
    expect(pricingSource).toContain('Ayda yaklaşık 360-480 konuşma');

    expect(pricingSource).toContain('İlk otomasyon adımını atan işletmeler');
    expect(pricingSource).toContain('Düzenli mesaj trafiği olan işletmeler');
    expect(pricingSource).toContain('Yüksek konuşma hacmi yöneten işletmeler');
    expect(pricingSource).not.toContain('İlk otomasyon adımını atan işletmeler için');
    expect(pricingSource).not.toContain('Düzenli mesaj trafiği olan işletmeler için');
    expect(pricingSource).not.toContain('Yüksek konuşma hacmi yöneten işletmeler için');
  });

  it('renders shared standard features inside each pricing card instead of a global top section', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).toContain('planIncludesLabel');
    expect(pricingSource).toContain('planIncludedFeatures');
    expect(pricingSource).toContain('WhatsApp, Instagram, Telegram tek gelen kutusu');
    expect(pricingSource).toContain('Yetenek + Bilgi Bankası ile yapay zeka yanıtı');
    expect(pricingSource).toContain('Kişi nitelendirme ve skorlama');
    expect(pricingSource).toContain('Konuşma özeti');
    expect(pricingSource).not.toContain('Konuşma özeti ve kişi skoru');
    expect(pricingSource).not.toContain('Hazır yanıtlar ve temel raporlar');
    expect(pricingSource).not.toContain('sameFeatures:');
    expect(pricingSource).not.toContain('sameFeatureLabel');
  });

  it('keeps trial message in hero and removes standalone trial panel plus top-up packs', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).toContain('14 gün ücretsiz dene');
    expect(pricingSource).toContain('Start your 14-day free trial');
    expect(pricingSource).toContain('Kredi kartı gerekmez');
    expect(pricingSource).toContain('No credit card required');
    expect(pricingSource).toContain('href={AUTH_URLS.register}');
    expect(pricingSource).not.toContain('mailto:askqualy@gmail.com?subject=${encodeURIComponent(plan.subject)}');
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

    expect(pricingSource).toContain('enterpriseCard');
    expect(pricingSource).toContain('Özel Paket');
    expect(pricingSource).toContain('Özel Çözüm');
    expect(pricingSource).toContain('Özel Teklif Al');
    expect(pricingSource).toContain('data-pricing-enterprise="true"');
  });

  it('uses section-level background gradient to soften footer transition without extra overlay layers', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).toContain('bg-[linear-gradient(to_bottom,#f8fafc_0%,#f8fafc_82%,#ffffff_100%)]');
    expect(pricingSource).not.toContain('data-pricing-footer-fade="true"');
  });
});
