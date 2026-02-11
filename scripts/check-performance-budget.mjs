import { promises as fs } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST_ASSETS_DIR = path.join(ROOT, 'dist', 'assets');

export const DEFAULT_BUDGETS = {
  maxJsGzipKb: 140,
  maxCssGzipKb: 30,
};

const toKb = (bytes) => bytes / 1024;

export const evaluateBudget = (metrics, budgets = DEFAULT_BUDGETS) => {
  const errors = [];

  if (metrics.js.gzipKb > budgets.maxJsGzipKb) {
    errors.push(`JS gzip budget exceeded: ${metrics.js.gzipKb.toFixed(2)}KB > ${budgets.maxJsGzipKb}KB`);
  }
  if (metrics.css.gzipKb > budgets.maxCssGzipKb) {
    errors.push(`CSS gzip budget exceeded: ${metrics.css.gzipKb.toFixed(2)}KB > ${budgets.maxCssGzipKb}KB`);
  }

  return {
    pass: errors.length === 0,
    errors,
  };
};

export const collectPerformanceMetrics = async (assetsDir = DIST_ASSETS_DIR) => {
  const entries = await fs.readdir(assetsDir);
  const jsFiles = entries.filter((name) => name.endsWith('.js'));
  const cssFiles = entries.filter((name) => name.endsWith('.css'));

  if (jsFiles.length === 0) {
    throw new Error(`No JS bundles found in ${assetsDir}`);
  }
  if (cssFiles.length === 0) {
    throw new Error(`No CSS bundles found in ${assetsDir}`);
  }

  const measureLargest = async (files) => {
    let largestRaw = 0;
    let largestGzip = 0;
    let largestName = '';

    for (const file of files) {
      const fullPath = path.join(assetsDir, file);
      const content = await fs.readFile(fullPath);
      const raw = content.byteLength;
      const gzip = gzipSync(content).byteLength;
      if (raw > largestRaw) {
        largestRaw = raw;
        largestGzip = gzip;
        largestName = file;
      }
    }

    return {
      file: largestName,
      rawKb: Number(toKb(largestRaw).toFixed(2)),
      gzipKb: Number(toKb(largestGzip).toFixed(2)),
    };
  };

  return {
    js: await measureLargest(jsFiles),
    css: await measureLargest(cssFiles),
  };
};

export const main = async () => {
  const metrics = await collectPerformanceMetrics();
  const result = evaluateBudget(metrics);

  console.log(`Largest JS: ${metrics.js.file} (${metrics.js.rawKb}KB raw / ${metrics.js.gzipKb}KB gzip)`);
  console.log(`Largest CSS: ${metrics.css.file} (${metrics.css.rawKb}KB raw / ${metrics.css.gzipKb}KB gzip)`);

  if (!result.pass) {
    for (const error of result.errors) {
      console.error(error);
    }
    process.exit(1);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

