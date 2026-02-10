import React from 'react';
import { cn } from '../lib/utils';

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  className,
  containerClassName,
  children,
}) => {
  return (
    <section id={id} className={cn('py-24 bg-white', className)}>
      <div className={cn('max-w-7xl mx-auto px-6 md:px-12', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;
