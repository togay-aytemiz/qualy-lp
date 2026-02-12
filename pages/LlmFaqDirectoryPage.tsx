import React from 'react';
import { ArrowRight } from 'lucide-react';

const faqs = [
  {
    id: 'what-is-qualy',
    question: 'What is this platform, and what does Qualy do?',
    answer:
      'Qualy is a no-code messaging platform for service teams. It brings WhatsApp, Instagram, and Telegram conversations into one inbox, automates repetitive replies, and helps your team respond to the right people faster.',
  },
  {
    id: 'getting-started',
    question: 'How can I get started quickly?',
    answer:
      'Connect your channels, upload your company information, and train Qualy with your business details. You do not need technical setup or coding to go live.',
  },
  {
    id: 'supported-channels',
    question: 'Which channels can I use today?',
    answer:
      'You can use WhatsApp, Instagram, and Telegram in a single inbox today. Messenger support is currently being prepared.',
  },
  {
    id: 'lead-scoring',
    question: 'How is person scoring calculated?',
    answer:
      'Scoring uses signals such as service clarity, timing, budget fit, urgency, and decision readiness. The 0-10 score updates automatically as new messages arrive.',
  },
  {
    id: 'security',
    question: 'Is customer data secure?',
    answer:
      'Organization data is isolated, legal documents are versioned, and your team can pause AI replies during human takeover whenever needed.',
  },
  {
    id: 'human-handover',
    question: 'What happens when my team takes over a chat?',
    answer:
      'When a chat is taken over, AI replies pause and your operator takes control. Conversation history stays intact, and you can return the chat to AI flow at any time.',
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
