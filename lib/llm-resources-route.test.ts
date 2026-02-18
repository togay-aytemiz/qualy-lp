import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('llm resources route', () => {
  it('renders dedicated faqs directory route', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain("const isLlmFaqDirectoryRoute = normalizedPath === '/faqs-directory'");
    expect(appSource).toContain("<LlmFaqDirectoryPage />");
  });
});
