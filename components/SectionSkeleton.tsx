import React from 'react';

type SectionSkeletonProps = {
  className?: string;
};

const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ className = '' }) => {
  return (
    <section className={`py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-10 w-64 mx-auto rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-5 w-96 max-w-full mx-auto rounded mt-5 bg-slate-100 animate-pulse" />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default SectionSkeleton;

