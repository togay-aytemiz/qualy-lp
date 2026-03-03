import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('meta channel trust copy', () => {
  it('describes official Meta authorization flow and no password sharing in EN and TR copy', () => {
    const source = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(source).toContain('step1_desc: "Connect WhatsApp, Instagram, Messenger, and Telegram in a few clicks. Meta channels run through official Meta authorization flows, so you never share channel passwords with Qualy."');
    expect(source).toContain('step1_desc: "WhatsApp, Instagram, Messenger ve Telegram kanallarını birkaç adımda bağla. Meta kanalları resmi Meta yetkilendirme akışıyla bağlanır; kanal şifrelerini Qualy ile paylaşmazsın."');
    expect(source).toContain('answer: "Qualy brings your WhatsApp, Instagram, Messenger, and Telegram messages into one inbox.');
    expect(source).toContain('answer: "Qualy, WhatsApp, Instagram, Messenger ve Telegram\'dan gelen müşteri mesajlarını tek bir panelde topluyor.');
    expect(source).toContain('question: "Do I need to share WhatsApp, Instagram, or Messenger passwords to connect channels?"');
    expect(source).toContain('question: "WhatsApp, Instagram veya Messenger bağlamak için şifre paylaşmam gerekir mi?"');
    expect(source).not.toContain('Messenger is next');
    expect(source).not.toContain('bir sonraki adımda gelecek');
  });
});
