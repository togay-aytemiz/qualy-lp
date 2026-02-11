import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useReducedMotion } from 'framer-motion';
import SectionWithHeader from './SectionWithHeader';

type Story = {
  text: string;
  author: string;
  role: string;
};

const ReviewCard: React.FC<{ story: Story }> = ({ story }) => (
  <figure className="animate-fade-in rounded-3xl bg-white p-6 opacity-0 shadow-xl shadow-slate-200/50 border border-slate-100/50 mx-auto w-full max-w-[320px]">
    <div className="flex flex-col items-start">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{story.author}</h3>
        <p className="text-xs font-medium text-slate-500">{story.role}</p>
      </div>
      <p className="text-sm text-slate-600 mt-4 leading-relaxed">
        "{story.text}"
      </p>
    </div>
  </figure>
);

const SuccessStories: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const stories = t.successStories.stories;
  const columns: Story[][] = [[], [], []];
  stories.forEach((story, index) => {
    columns[index % 3].push(story);
  });

  const [column1, column2, column3] = columns;

  return (
    <SectionWithHeader
      id="testimonials"
      className="py-20 overflow-hidden"
      containerClassName="max-w-none px-0 md:px-0"
      title={t.successStories.title}
      subtitle={t.successStories.subtitle}
    >

        <div className="relative -mx-4 mt-10 grid h-[32rem] max-h-[120vh] grid-cols-1 items-start gap-4 overflow-hidden px-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl lg:mx-auto">
            
            {/* Column 1 */}
            <div
              className={`${prefersReducedMotion ? '' : 'animate-marquee'} space-y-6 py-4`}
              style={{ "--marquee-duration": "40s" } as React.CSSProperties}
            >
                {[...column1, ...column1].map((story, i) => (
                    <ReviewCard key={`col1-${i}`} story={story} />
                ))}
            </div>

            {/* Column 2 - Hidden on mobile */}
            <div
              className={`${prefersReducedMotion ? '' : 'animate-marquee'} space-y-6 py-4 hidden md:block`}
              style={{ "--marquee-duration": "50s" } as React.CSSProperties}
            >
                {[...column2, ...column2].map((story, i) => (
                    <ReviewCard key={`col2-${i}`} story={story} />
                ))}
            </div>

            {/* Column 3 - Hidden on tablet/mobile */}
            <div
              className={`${prefersReducedMotion ? '' : 'animate-marquee'} space-y-6 py-4 hidden lg:block`}
              style={{ "--marquee-duration": "45s" } as React.CSSProperties}
            >
                {[...column3, ...column3].map((story, i) => (
                    <ReviewCard key={`col3-${i}`} story={story} />
                ))}
            </div>

            {/* Fade Overlays */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
        </div>
    </SectionWithHeader>
  );
};

export default SuccessStories;
