import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        rollupOptions: {
          input: {
            home: path.resolve(__dirname, 'index.html'),
            homeEn: path.resolve(__dirname, 'en/index.html'),
            pricing: path.resolve(__dirname, 'pricing/index.html'),
            pricingEn: path.resolve(__dirname, 'en/pricing/index.html'),
            about: path.resolve(__dirname, 'about/index.html'),
            aboutEn: path.resolve(__dirname, 'en/about/index.html'),
            dataDeletion: path.resolve(__dirname, 'data-deletion/index.html'),
            dataDeletionEn: path.resolve(__dirname, 'en/data-deletion/index.html'),
            faqDirectory: path.resolve(__dirname, 'faqs-directory/index.html'),
            legal: path.resolve(__dirname, 'legal/index.html'),
            legalEn: path.resolve(__dirname, 'en/legal/index.html'),
            terms: path.resolve(__dirname, 'terms/index.html'),
            termsEn: path.resolve(__dirname, 'en/terms/index.html'),
            privacy: path.resolve(__dirname, 'privacy/index.html'),
            privacyEn: path.resolve(__dirname, 'en/privacy/index.html'),
            kvkk: path.resolve(__dirname, 'kvkk/index.html'),
            kvkkEn: path.resolve(__dirname, 'en/kvkk/index.html'),
            preInformation: path.resolve(__dirname, 'pre-information/index.html'),
            preInformationEn: path.resolve(__dirname, 'en/pre-information/index.html'),
            distanceSalesAgreement: path.resolve(__dirname, 'distance-sales-agreement/index.html'),
            distanceSalesAgreementEn: path.resolve(__dirname, 'en/distance-sales-agreement/index.html'),
            cancellationRefund: path.resolve(__dirname, 'cancellation-refund/index.html'),
            cancellationRefundEn: path.resolve(__dirname, 'en/cancellation-refund/index.html'),
            subscriptionTrial: path.resolve(__dirname, 'subscription-trial/index.html'),
            subscriptionTrialEn: path.resolve(__dirname, 'en/subscription-trial/index.html'),
            notFound: path.resolve(__dirname, '404.html'),
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
