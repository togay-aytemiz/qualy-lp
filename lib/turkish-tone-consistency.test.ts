import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('turkish tone consistency', () => {
  it('keeps Turkish product copy in singular sen language', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('headline: "Herkese değil, doğru müşteriye odaklan."');
    expect(languageContext).toContain('heading: "Yoğun mesaj trafiğini düzenli bir müşteri akışına çevir."');
    expect(languageContext).toContain('heading_mobile: "Yoğun mesaj trafiğini düzenli akışa çevir."');
    expect(languageContext).toContain('feat3_desc1: "WhatsApp, Instagram, Telegram ve Messenger mesajlarını tek ekrandan yönet. Kanalları dakikalar içinde bağla, uygulama değiştirmeden yanıtla."');
    expect(languageContext).toContain('feat4_desc: "Qualy rutin mesajları yönetir; gerektiğinde konuşma insana devredilir. Tek tıkla devral, uygun olduğunda AI akışına geri ver."');
    expect(languageContext).toContain('desc: "Tekrarlayan mesajları otomatik yanıtla, adayları erken nitelendir ve yüksek niyetli konuşmaları doğru anda devral."');
    expect(languageContext).toContain('desc: "Servis işletmen için AI öncelikli gelen kutu. Yanıtları otomatikleştir, adayları nitelendir ve doğru anda devral."');
    expect(languageContext).toContain('centerDescription: "Gizlilik Politikası ve Hizmet Şartları dahil tüm yasal dokümanlara tek sayfadan erişebilirsin."');
    expect(languageContext).toContain('notFoundDescription: "Talep ettiğin yasal doküman şu anda mevcut değil."');

    expect(languageContext).not.toMatch(/\bodaklanın\b/u);
    expect(languageContext).not.toMatch(/\bçevirin\b/u);
    expect(languageContext).not.toMatch(/\byönetin\b/u);
    expect(languageContext).not.toMatch(/\bbağlayın\b/u);
    expect(languageContext).not.toMatch(/\byanıtlayın\b/u);
    expect(languageContext).not.toMatch(/\bdevralın\b/u);
    expect(languageContext).not.toMatch(/\botomatikleştirin\b/u);
    expect(languageContext).not.toMatch(/\bnitelendirin\b/u);
    expect(languageContext).not.toMatch(/\berişebilirsiniz\b/u);
    expect(languageContext).not.toContain('İsterseniz');
    expect(languageContext).not.toContain('mısınız');
    expect(languageContext).not.toContain('misiniz');
  });

  it('uses singular sen language in Turkish SEO copy', () => {
    const seoSource = readFileSync(path.join(process.cwd(), 'lib', 'seo.ts'), 'utf8');

    expect(seoSource).toContain('Tekrarlayan konuşmaları otomatikleştir, AI skorlama ile adayları nitelendir ve yüksek niyetli konuşmaları doğru anda devral.');
    expect(seoSource).toContain('Qualy yasal dokümanlarına tek sayfadan eriş; Hizmet Şartları ve Gizlilik Politikası sürüm bilgilerini görüntüle.');
    expect(seoSource).toContain('Qualy platform kullanımını düzenleyen Hizmet Şartları, sorumluluklar ve hukuki koşulları incele.');
    expect(seoSource).toContain('Qualy’nin kişisel verileri nasıl topladığını, kullandığını, sakladığını ve koruduğunu incele.');
    expect(seoSource).not.toMatch(/\botomatikleştirin\b/u);
    expect(seoSource).not.toMatch(/\bnitelendirin\b/u);
    expect(seoSource).not.toMatch(/\bdevralın\b/u);
    expect(seoSource).not.toMatch(/\berişin\b/u);
    expect(seoSource).not.toMatch(/\bgörüntüleyin\b/u);
    expect(seoSource).not.toMatch(/\binceleyin\b/u);
  });
});
