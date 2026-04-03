import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const readJson = <T extends JsonValue>(relativePath: string) =>
  JSON.parse(readFileSync(path.join(process.cwd(), relativePath), 'utf8')) as T;

const getShape = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) {
    return value.length === 0 ? [] : [getShape(value[0] as JsonValue)];
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, getShape((value as Record<string, JsonValue>)[key])])
    );
  }

  return typeof value;
};

describe('pricing locale messages', () => {
  it('keeps tr and en pricing message files structurally aligned', () => {
    const tr = readJson<JsonValue>('messages/tr.json');
    const en = readJson<JsonValue>('messages/en.json');

    expect(getShape(tr)).toEqual(getShape(en));
  });

  it('uses subscription and allowance language for the three self-serve plans', () => {
    const tr = JSON.stringify(readJson<JsonValue>('messages/tr.json'));
    const en = JSON.stringify(readJson<JsonValue>('messages/en.json'));

    expect(tr).toContain('Temel Aylık Yazılım Aboneliği');
    expect(tr).toContain('Gelişmiş Aylık Yazılım Aboneliği');
    expect(tr).toContain('Profesyonel Aylık Yazılım Aboneliği');
    expect(en).toContain('Starter Monthly Software Subscription');
    expect(en).toContain('Growth Monthly Software Subscription');
    expect(en).toContain('Professional Monthly Software Subscription');

    const forbiddenTerms = ['1000 KREDİ / AY', '2000 KREDİ / AY', '4000 KREDİ / AY', 'credits / month'];

    for (const forbiddenTerm of forbiddenTerms) {
      expect(tr).not.toContain(forbiddenTerm);
      expect(en).not.toContain(forbiddenTerm);
    }
  });

  it('keeps three pricing notes per locale including a VAT-included line', () => {
    const tr = readJson<{ pricingPage: { notes: string[] } }>('messages/tr.json');
    const en = readJson<{ pricingPage: { notes: string[] } }>('messages/en.json');

    expect(tr.pricingPage.notes).toHaveLength(3);
    expect(en.pricingPage.notes).toHaveLength(3);
    expect(tr.pricingPage.notes[0]).toBe('Paket ücretine yazılım aboneliği ve aylık kullanım hakkı dahildir.');
    expect(en.pricingPage.notes[0]).toBe('The plan fee includes software subscription and a monthly usage allowance.');
    expect(tr.pricingPage.notes[1]).toBe('Fiyatlara KDV dahildir.');
    expect(en.pricingPage.notes[1]).toBe('Listed prices include VAT.');
  });
});
