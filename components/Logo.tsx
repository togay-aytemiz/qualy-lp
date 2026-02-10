import React from 'react';

type LogoVariant = 'full' | 'icon';

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
}

export const Logo = ({ className = "h-7 w-auto", variant = 'full' }: LogoProps) => {
  const src = variant === 'icon' ? '/icon-black.svg' : '/logo-black.svg';

  return (
    <img
      src={src}
      alt="Qualy logo"
      className={`${className} object-contain`}
      loading="eager"
      decoding="async"
    />
  );
};

export default Logo;
