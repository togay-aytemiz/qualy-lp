const DEFAULT_MAX_ATTEMPTS = 40;
const DEFAULT_RETRY_DELAY_MS = 75;

const normalizeSectionId = (value: string) => value.trim().replace(/^#/, '');

export const focusHomeSectionById = (sectionId: string): boolean => {
  if (typeof document === 'undefined') return false;

  const normalizedId = normalizeSectionId(sectionId);
  if (!normalizedId) return false;

  const target = document.getElementById(normalizedId);
  if (!(target instanceof HTMLElement)) return false;

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const hadTabIndex = target.hasAttribute('tabindex');
  if (!hadTabIndex) {
    target.setAttribute('tabindex', '-1');
  }

  target.focus({ preventScroll: true });

  if (!hadTabIndex) {
    const cleanup = () => target.removeAttribute('tabindex');
    target.addEventListener('blur', cleanup, { once: true });
  }

  return true;
};

export const focusHomeSectionByHashWithRetry = (
  hash: string,
  options: { maxAttempts?: number; retryDelayMs?: number } = {},
): (() => void) => {
  const sectionId = normalizeSectionId(hash);
  if (!sectionId || typeof window === 'undefined') return () => {};

  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

  let timeoutId: number | undefined;
  let attempts = 0;
  let stopped = false;

  const tryFocus = () => {
    if (stopped) return;

    const focused = focusHomeSectionById(sectionId);
    if (focused) return;

    attempts += 1;
    if (attempts >= maxAttempts) return;

    timeoutId = window.setTimeout(tryFocus, retryDelayMs);
  };

  tryFocus();

  return () => {
    stopped = true;
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  };
};
