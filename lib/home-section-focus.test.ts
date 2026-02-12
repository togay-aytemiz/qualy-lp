// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { focusHomeSectionByHashWithRetry, focusHomeSectionById } from './home-section-focus';

const attachElementSpies = (element: HTMLElement) => {
  const scrollIntoView = vi.fn();
  const focus = vi.fn();

  Object.defineProperty(element, 'scrollIntoView', {
    value: scrollIntoView,
    configurable: true,
  });

  Object.defineProperty(element, 'focus', {
    value: focus,
    configurable: true,
  });

  return { scrollIntoView, focus };
};

describe('focusHomeSectionById', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('scrolls and focuses the matching section when present', () => {
    document.body.innerHTML = '<section id="features"></section>';
    const target = document.getElementById('features') as HTMLElement;
    const spies = attachElementSpies(target);

    const focused = focusHomeSectionById('features');

    expect(focused).toBe(true);
    expect(spies.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(spies.focus).toHaveBeenCalledWith({ preventScroll: true });
  });
});

describe('focusHomeSectionByHashWithRetry', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('retries until the hashed section exists', () => {
    vi.useFakeTimers();

    const stopRetrying = focusHomeSectionByHashWithRetry('#how-it-works', {
      maxAttempts: 3,
      retryDelayMs: 25,
    });

    const delayedTarget = document.createElement('section');
    delayedTarget.id = 'how-it-works';
    const spies = attachElementSpies(delayedTarget);
    document.body.appendChild(delayedTarget);

    vi.advanceTimersByTime(25);

    expect(spies.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(spies.focus).toHaveBeenCalledWith({ preventScroll: true });

    stopRetrying();
    vi.useRealTimers();
  });
});
