import React from 'react';
import Section from './Section';
import SectionHeader from './SectionHeader';

interface SectionWithHeaderProps {
  id?: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  children: React.ReactNode;
}

const SectionWithHeader: React.FC<SectionWithHeaderProps> = ({
  id,
  title,
  subtitle,
  className,
  containerClassName,
  headerClassName,
  children,
}) => {
  return (
    <Section id={id} className={className} containerClassName={containerClassName}>
      <SectionHeader title={title} subtitle={subtitle} className={headerClassName} />
      {children}
    </Section>
  );
};

export default SectionWithHeader;
