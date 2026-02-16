import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const readPublicFile = (fileName: string) =>
  readFileSync(path.join(process.cwd(), 'public', fileName), 'utf8');

describe('llm resource files', () => {
  it('publishes llms discovery files for models', () => {
    const llmsTxt = readPublicFile('llms.txt');
    const llmsFullTxt = readPublicFile('llms-full.txt');

    expect(llmsTxt).toContain('# Qualy');
    expect(llmsTxt).toContain('/faqs-directory');
    expect(llmsFullTxt).toContain('## FAQs');
    expect(llmsFullTxt).toContain('How can I get started quickly?');
  });

  it('publishes markdown faq export for llms', () => {
    const faqsMarkdown = readPublicFile('faqs.md');

    expect(faqsMarkdown).toContain('# Qualy FAQs');
    expect(faqsMarkdown).toContain('## What exactly does Qualy do?');
  });
});
