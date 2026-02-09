import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Box, Building2, Quote } from 'lucide-react';
import SectionHeader from './SectionHeader';

const ReviewCard: React.FC<{ story: any }> = ({ story }) => (
  <figure className="animate-fade-in rounded-3xl bg-white p-6 opacity-0 shadow-xl shadow-slate-200/50 border border-slate-100/50 mx-auto w-full max-w-[320px]">
    <div className="flex flex-col items-start">
      <div className="flex gap-3 items-center">
        <img 
          alt={story.author} 
          loading="lazy" 
          width="100" 
          height="100" 
          className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-50" 
          src={story.img} 
        />
        <div>
          <h3 className="text-sm font-bold text-slate-900">{story.author}</h3>
          <p className="text-xs font-medium text-slate-500">{story.role}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-4 leading-relaxed">
        "{story.text}"
      </p>
    </div>
  </figure>
);

const SuccessStories: React.FC = () => {
  const { t } = useLanguage();

  // Define base stories with their specific visual assets
  const stories = [
    {
      ...t.successStories.story1,
      bg: "bg-slate-900",
      textCol: "text-white",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      ...t.successStories.story2,
      bg: "bg-blue-100",
      textCol: "text-blue-700",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      ...t.successStories.story3,
      bg: "bg-white border border-slate-200",
      textCol: "text-slate-900",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
    },
    // Adding duplicated/varied stories to fill the columns for visual density
    {
      ...t.successStories.story1,
      author: "Sarah Jenkins",
      role: "Director at TechFlow",
      text: "We used to lose leads because we couldn't respond fast enough. Qualy fixed that overnight. Our conversion rate tripled in the first week.",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      ...t.successStories.story2,
      author: "David Chen",
      role: "Founder, GrowthLabs",
      text: "The lead scoring is frighteningly accurate. It knows exactly who is ready to buy and who is just browsing. It saves my sales team hours every day.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
       ...t.successStories.story3,
       author: "Elena Rodriguez",
       role: "VP of Sales, BuildIt",
       text: "I was skeptical about an AI handling our clients, but the knowledge base integration is seamless. It sounds exactly like our best support agent.",
       img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ];

  // Divide stories into columns
  const column1 = [stories[0], stories[3], stories[1]];
  const column2 = [stories[1], stories[4], stories[2]];
  const column3 = [stories[2], stories[5], stories[0]];

  return (
    <section className="py-20 bg-white border-b border-slate-100 overflow-hidden">
        
        <SectionHeader 
          title={t.successStories.title}
          subtitle={t.successStories.subtitle}
        />

        <div className="relative -mx-4 mt-10 grid h-[32rem] max-h-[120vh] grid-cols-1 items-start gap-4 overflow-hidden px-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl lg:mx-auto">
            
            {/* Column 1 */}
            <div className="animate-marquee space-y-6 py-4" style={{ "--marquee-duration": "40s" } as React.CSSProperties}>
                {[...column1, ...column1].map((story, i) => (
                    <ReviewCard key={`col1-${i}`} story={story} />
                ))}
            </div>

            {/* Column 2 - Hidden on mobile */}
            <div className="animate-marquee space-y-6 py-4 hidden md:block" style={{ "--marquee-duration": "50s" } as React.CSSProperties}>
                {[...column2, ...column2].map((story, i) => (
                    <ReviewCard key={`col2-${i}`} story={story} />
                ))}
            </div>

            {/* Column 3 - Hidden on tablet/mobile */}
            <div className="animate-marquee space-y-6 py-4 hidden lg:block" style={{ "--marquee-duration": "45s" } as React.CSSProperties}>
                {[...column3, ...column3].map((story, i) => (
                    <ReviewCard key={`col3-${i}`} story={story} />
                ))}
            </div>

            {/* Fade Overlays */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
        </div>
    </section>
  );
};

export default SuccessStories;