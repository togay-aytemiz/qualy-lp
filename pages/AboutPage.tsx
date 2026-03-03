import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

type AboutCopy = {
  badge: string;
  title: string;
  intro: string;
  introSecondary: string;
  introTertiary: string;
  whyTitle: string;
  whyLead: string;
  whyBody: string;
  whyBodySecondary: string;
  whyUnderlineText: string;
  whyTail: string;
  seoTitle: string;
  seoBody: string;
  seoBodySecondary: string;
  seoHighlight: string;
  seoTail: string;
  fitTitle: string;
  fitBody: string;
  fitItems: string[];
  workflowTitle: string;
  workflowBody: string;
  workflowSteps: string[];
  companyTitle: string;
  companyBody: string;
  companyLegalLabel: string;
  companyLegalValue: string;
  companyAddressLabel: string;
  companyAddressValue: string;
  contactTitle: string;
  contactEmailLabel: string;
};

const COPY: Record<'tr' | 'en', AboutCopy> = {
  tr: {
    badge: 'Hakkımızda',
    title: 'Qualy ile AI Destekli Müşteri İletişimini Ölçeklendirin',
    intro:
      'Qualy; WhatsApp, Instagram, Messenger ve Telegram konuşmalarını tek panelde toplayan, servis işletmelerine odaklı bir SaaS platformudur.',
    introSecondary:
      'Amacımız, dağınık mesaj trafiğini net bir operasyon akışına dönüştürmek, yüksek niyetli müşteri taleplerini erkenden görünür kılmak ve ekiplerin satışa dönüşen konuşmalara daha fazla zaman ayırmasını sağlamaktır.',
    introTertiary:
      'Bu sayfa; Qualy ürün yaklaşımını, kimler için geliştirildiğini ve neden müşteri iletişimi süreçlerinde daha yüksek verim sağladığını detaylı biçimde açıklar.',
    whyTitle: 'Neden Qualy?',
    whyLead: 'Müşteri mesaj yönetiminde yalnızca hız yeterli değildir.',
    whyBody:
      'Gerçek büyüme; hangi konuşmanın öncelikli olduğunu doğru tespit etmek, satışa hazır talebi erkenden görmek ve doğru anda doğru yanıtı verebilmekle gelir. Qualy bu süreci uçtan uca otomatikleştirir.',
    whyBodySecondary:
      'Sistem; tekrar eden soruları yanıtlar, müşteri niyetini skorlar ve ekip müdahalesi gereken anları öne çıkarır. Böylece',
    whyUnderlineText: 'WhatsApp otomatik yanıt, Instagram mesaj yönetimi ve potansiyel müşteri sınıflandırması',
    whyTail: 'süreçleri aynı çatı altında daha ölçülebilir hale gelir.',
    seoTitle: 'SEO Odaklı İletişim Altyapısı',
    seoBody:
      'Qualy ile oluşturulan bilgi tabanı ve soru-yanıt akışları, markanızın hizmet dilini tutarlı hale getirerek web sitenizdeki içerik stratejisini de besler. Bu yaklaşım, arama motorlarında doğru niyeti yakalayan içerikler üretmenizi kolaylaştırır.',
    seoBodySecondary:
      'Özellikle hizmet sayfaları, sık sorulan sorular ve teklif süreçlerinde kullanılan net terminoloji; organik görünürlük, kullanıcı güveni ve dönüşüm oranı arasında güçlü bir bağ kurar.',
    seoHighlight: 'SEO uyumlu müşteri iletişimi, yerel arama görünürlüğü ve dönüşüm odaklı metin standardı',
    seoTail: 'yaklaşımıyla daha güçlü bir dijital vitrin oluşturabilirsiniz.',
    fitTitle: 'Kimler için uygun?',
    fitBody:
      'Qualy; hizmet satışı yapan, müşteri konuşmaları üzerinden teklif ve randevu üreten ekipler için tasarlanmıştır.',
    fitItems: [
      'WhatsApp ve Instagram üzerinden yoğun talep alan servis işletmeleri',
      'Randevu, teklif ve ön görüşme trafiğini tek merkezde yönetmek isteyen ekipler',
      'Satışa yakın müşterileri kaçırmadan operasyon maliyetini düşürmek isteyen şirketler',
      'Arama motorlarından gelen trafiği doğru mesaj akışıyla satış fırsatına çevirmek isteyen markalar',
    ],
    workflowTitle: 'Qualy nasıl çalışır?',
    workflowBody:
      'Kurulum süreci kısa, operasyon etkisi yüksektir. Teknik ekip beklemeden, mevcut müşteri iletişimi akışınızı iyileştirebilirsiniz.',
    workflowSteps: [
      'Kanallarınızı bağlayın: Konuşmalar tek gelen kutusunda birleşsin.',
      'Bilgi tabanınızı ekleyin: Sık sorulara tutarlı ve marka dilinize uygun yanıtlar üretin.',
      'Önceliklendirin ve devralın: Satışa yakın müşteri taleplerini üstte görün, gerekli anda ekibiniz konuşmayı devralsın.',
    ],
    companyTitle: 'Şirket Bilgisi',
    companyBody:
      'Qualy hizmeti Türkiye merkezli olarak sunulur ve dijital servis altyapısı düzenli olarak güncellenir. Ürün geliştirme odağımız; sürdürülebilir performans, yasal uyumluluk ve güvenilir müşteri deneyimi ekseninde ilerler.',
    companyLegalLabel: 'Ticari Ünvan',
    companyLegalValue: 'Seray Aytemiz — Sweet Dreams Fotoğrafçılık',
    companyAddressLabel: 'Adres',
    companyAddressValue: 'Çayyolu Mah. 2699 Sk. Oyak 4 Sitesi No: 1 İç Kapı No: 36 Çankaya / Ankara',
    contactTitle: 'İletişim',
    contactEmailLabel: 'E-posta',
  },
  en: {
    badge: 'About',
    title: 'Scale AI-Assisted Customer Communication with Qualy',
    intro:
      'Qualy is a SaaS platform for service businesses that unifies WhatsApp, Instagram, Messenger, and Telegram conversations in one operational inbox.',
    introSecondary:
      'We help teams turn fragmented message traffic into a repeatable growth workflow, prioritize high-intent leads earlier, and spend more time on conversations that actually convert.',
    introTertiary:
      'This page explains our operating philosophy, ideal customer profile, and why Qualy improves service communication outcomes in measurable ways.',
    whyTitle: 'Why Qualy?',
    whyLead: 'Speed alone is not enough in a crowded inbox.',
    whyBody:
      'Sustainable growth depends on identifying high-priority conversations and responding at the right moment. Qualy automates that decision layer.',
    whyBodySecondary:
      'The platform handles repetitive questions, scores customer intent, and surfaces takeover moments for your team. That means',
    whyUnderlineText: 'AI customer communication, lead qualification, and conversion optimization',
    whyTail: 'run on a clearer and more measurable operating model.',
    seoTitle: 'SEO-Aligned Communication Infrastructure',
    seoBody:
      'The same knowledge architecture used for customer conversations can strengthen your website content strategy with clearer terminology and intent-aligned language.',
    seoBodySecondary:
      'That consistency supports organic visibility, trust signals, and conversion-ready journeys from search to conversation.',
    seoHighlight: 'SEO-ready customer communication and conversion-focused messaging standards',
    seoTail: 'can help you build a stronger digital storefront.',
    fitTitle: 'Who is it for?',
    fitBody:
      'Qualy is built for service businesses where messaging channels directly influence appointments, proposals, and sales outcomes.',
    fitItems: [
      'Service teams handling high message volume on WhatsApp and Instagram',
      'Businesses that want one command center for appointment, quote, and pre-sales flows',
      'SaaS-focused teams that want to reduce operation cost without missing sales-ready leads',
      'Brands that want to convert organic traffic into qualified conversations more consistently',
    ],
    workflowTitle: 'How does Qualy work?',
    workflowBody:
      'Setup is fast, but the operational impact is long-term. Teams can improve communication quality without waiting for a technical rollout.',
    workflowSteps: [
      'Connect channels: merge incoming conversations into one inbox.',
      'Load your knowledge base: generate consistent answers aligned with your brand voice.',
      'Prioritize and take over: focus on high-intent customers and step in when human touch is needed.',
    ],
    companyTitle: 'Company Information',
    companyBody:
      'Qualy is operated from Turkey and the service infrastructure is continuously improved for reliability.',
    companyLegalLabel: 'Legal Entity',
    companyLegalValue: 'Seray Aytemiz — Sweet Dreams Fotoğrafçılık',
    companyAddressLabel: 'Address',
    companyAddressValue: 'Çayyolu Mah. 2699 Sk. Oyak 4 Sitesi No: 1 İç Kapı No: 36 Çankaya / Ankara, Turkey',
    contactTitle: 'Contact',
    contactEmailLabel: 'Email',
  },
};

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = language === 'tr' ? COPY.tr : COPY.en;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.badge}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{copy.intro}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{copy.introSecondary}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{copy.introTertiary}</p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">{copy.whyTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            <strong className="font-semibold text-slate-900">{copy.whyLead}</strong> {copy.whyBody}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {copy.whyBodySecondary}{' '}
            <span className="font-semibold underline decoration-slate-400 underline-offset-4">
              {copy.whyUnderlineText}
            </span>{' '}
            {copy.whyTail}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">{copy.seoTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{copy.seoBody}</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            <strong className="font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4">
              {copy.seoHighlight}
            </strong>{' '}
            {copy.seoTail}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{copy.seoBodySecondary}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">{copy.fitTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{copy.fitBody}</p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            {copy.fitItems.map((item) => (
              <li key={item} className="list-disc pl-1 ml-5">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">{copy.workflowTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{copy.workflowBody}</p>
          <ol className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            {copy.workflowSteps.map((step, index) => (
              <li key={step}>
                <strong className="font-semibold text-slate-900">{index + 1}.</strong> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-semibold text-slate-900">{copy.companyTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{copy.companyBody}</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            <strong className="font-semibold text-slate-900">{copy.companyLegalLabel}:</strong>{' '}
            {copy.companyLegalValue}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            <strong className="font-semibold text-slate-900">{copy.companyAddressLabel}:</strong>{' '}
            {copy.companyAddressValue}
          </p>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">{copy.contactTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            <strong className="font-semibold text-slate-900">{copy.contactEmailLabel}:</strong>{' '}
            <a className="font-semibold text-slate-900 underline" href="mailto:askqualy@gmail.com">
              askqualy@gmail.com
            </a>
          </p>
        </section>
      </div>
    </section>
  );
};

export default AboutPage;
