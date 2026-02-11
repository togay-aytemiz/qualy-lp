const DEFAULT_SITE_URL = 'https://askqualy.com';
const DEV_SITE_URL = 'http://localhost:3000';

type SiteUrlMode = 'production' | 'development' | 'test';

type SiteUrlOptions = {
  envSiteUrl?: string;
  mode?: SiteUrlMode;
};

export const normalizeBaseUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return trimmed.replace(/\/+$/, '');
};

export const getSiteUrl = (options: SiteUrlOptions = {}) => {
  const envFromVite =
    options.envSiteUrl ??
    ((typeof import.meta !== 'undefined' && (import.meta as ImportMeta).env?.VITE_SITE_URL) || '');

  const envFromNode = options.envSiteUrl ?? process.env.VITE_SITE_URL ?? '';
  const candidate = normalizeBaseUrl(envFromVite || envFromNode);
  if (candidate) return candidate;

  const mode = options.mode ?? (((typeof import.meta !== 'undefined' && (import.meta as ImportMeta).env?.MODE) || process.env.NODE_ENV || 'development') as SiteUrlMode);
  if (mode === 'production') return DEFAULT_SITE_URL;
  return DEV_SITE_URL;
};

export const resolveAbsoluteUrl = (baseUrl: string, path: string) => {
  const normalizedBase = normalizeBaseUrl(baseUrl) || DEFAULT_SITE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

