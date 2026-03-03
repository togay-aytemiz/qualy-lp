import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const readFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('channel availability copy', () => {
  it('treats WhatsApp, Instagram, Messenger, and Telegram as active across user-facing resources', () => {
    const llmFaqPage = readFile('pages/LlmFaqDirectoryPage.tsx');
    const faqMarkdown = readFile('public/faqs.md');
    const llmsTxt = readFile('public/llms.txt');
    const llmsFullTxt = readFile('public/llms-full.txt');
    const pricing = readFile('components/Pricing.tsx');
    const homeTr = readFile('index.html');
    const homeEn = readFile('en/index.html');
    const seo = readFile('lib/seo.ts');
    const metadata = readFile('metadata.json');
    const webmanifest = readFile('public/site.webmanifest');

    expect(llmFaqPage).toContain('WhatsApp, Instagram, Messenger, and Telegram');
    expect(faqMarkdown).toContain('WhatsApp, Instagram, Messenger, and Telegram');
    expect(llmsTxt).toContain('WhatsApp, Instagram, Messenger, and Telegram');
    expect(llmsFullTxt).toContain('WhatsApp, Instagram, Messenger, and Telegram');
    expect(pricing).toContain('Shared inbox for WhatsApp, Instagram, Messenger, and Telegram');
    expect(pricing).toContain('WhatsApp, Instagram, Messenger, Telegram tek gelen kutusu');
    expect(homeEn).toContain('WhatsApp, Instagram, Messenger, and Telegram');
    expect(homeTr).toContain('WhatsApp, Instagram, Messenger ve Telegram');
    expect(seo).toContain("AI-First Inbox for WhatsApp, Instagram, Messenger, and Telegram");
    expect(seo).toContain("WhatsApp, Instagram, Messenger ve Telegram için AI Gelen Kutusu");
    expect(metadata).toContain('WhatsApp, Instagram, Messenger, and Telegram');
    expect(webmanifest).toContain('WhatsApp, Instagram, Messenger, and Telegram');

    const outdatedPhrases = [
      'Messenger support is coming soon',
      'Messenger support is currently being prepared',
      'Messenger bir sonraki adımda gelecek',
      'as it becomes available',
      'aktif olduğunda Messenger',
      'currently support WhatsApp, Instagram, and Telegram',
      'Şu anda WhatsApp, Instagram ve Telegram',
    ];

    for (const phrase of outdatedPhrases) {
      expect(llmFaqPage).not.toContain(phrase);
      expect(faqMarkdown).not.toContain(phrase);
      expect(llmsFullTxt).not.toContain(phrase);
      expect(homeTr).not.toContain(phrase);
      expect(homeEn).not.toContain(phrase);
    }
  });
});
