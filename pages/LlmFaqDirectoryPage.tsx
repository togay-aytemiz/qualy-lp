import React from 'react';
import { ArrowRight } from 'lucide-react';

const faqs = [
  {
    id: 'what-is-qualy',
    question: 'What exactly does Qualy do?',
    answer:
      'Qualy brings your WhatsApp, Instagram, and Telegram messages into one inbox. It automatically replies to customers using the information you provide, figures out what each customer needs from the conversation, and gives you a priority score from 1 to 10. You only deal with the customers who actually need your attention — Qualy handles the rest.',
  },
  {
    id: 'getting-started',
    question: 'Do I need technical skills to start using Qualy?',
    answer:
      'No coding required. Connect your channels (WhatsApp, Instagram, or Telegram), upload a few documents about your services and pricing, add ready-made answers for common questions, and you can go live in minutes. Qualy uses what you upload to give your customers consistent, accurate replies.',
  },
  {
    id: 'supported-channels',
    question: 'Which messaging apps does Qualy work with?',
    answer:
      'We currently support WhatsApp, Instagram, and Telegram — you can manage all three from a single screen. Messenger support is coming soon. Connecting a channel takes just a few minutes, and messages from every channel appear in the same inbox.',
  },
  {
    id: 'lead-scoring',
    question: 'How does Qualy score and prioritize customers?',
    answer:
      'Every time a customer sends a message, Qualy reads the conversation and figures out how serious they are. It does this by looking at your uploaded service info alongside the customer\'s messages. For example, if a customer mentions a specific date, service type, and budget, their score goes up. If they only ask "how much?", the score stays low. The score runs from 0 to 10 and updates with every message. When you open your dashboard, the most serious customers always appear first.',
  },
  {
    id: 'security',
    question: 'Is my customer data and conversations secure?',
    answer:
      'Yes. Every business\'s data is completely separated — no other user can see your conversations. Connections are encrypted and data is stored on secure cloud infrastructure. You can also pause AI replies at any time and take control yourself. You can review our legal documents on our Privacy Policy and Terms of Service pages.',
  },
  {
    id: 'human-handover',
    question: 'Can I jump in and take over while AI is replying?',
    answer:
      'Yes, with one click. When you hit the takeover button, Qualy\'s automatic replies stop and the conversation is yours. The full message history stays intact — your customer won\'t notice any interruption. When you\'re done, you can hand the conversation back to AI flow.',
  },
];

const LlmFaqDirectoryPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Qualy LLM Resources</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">LLM-Optimized FAQs</h1>
          <p className="mt-4 text-sm text-slate-300">
            Browse answer-first questions or open the raw export at{' '}
            <a className="underline decoration-slate-600 underline-offset-4" href="/faqs.md">
              /faqs.md
            </a>
            .
          </p>
        </header>

        <section className="space-y-4" aria-label="FAQ Directory">
          {faqs.map((faq, index) => (
            <a
              key={faq.id}
              href={`#${faq.id}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-slate-700 px-5 py-4 transition-colors hover:border-slate-400"
            >
              <span className="text-base font-medium text-slate-100 sm:text-lg">
                {index + 1}. {faq.question}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
            </a>
          ))}
        </section>

        <section className="space-y-8 border-t border-slate-800 pt-10" aria-label="FAQ Answers">
          {faqs.map((faq, index) => (
            <article key={faq.id} id={faq.id} className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-semibold text-white">
                {index + 1}. {faq.question}
              </h2>
              <p className="text-sm leading-7 text-slate-300">{faq.answer}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default LlmFaqDirectoryPage;
