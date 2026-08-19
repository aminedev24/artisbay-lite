import React from 'react';
import Link from 'next/link';

const VARIANT_CLASSES = {
  primary: 'bg-brand-navy text-white shadow-lg shadow-brand-navy/20 hover:bg-brand-navy-dark hover:-translate-y-0.5',
  accent: 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange-hover hover:-translate-y-0.5',
  outline: 'border-2 border-brand-navy text-brand-navy bg-transparent hover:bg-brand-navy hover:text-white hover:-translate-y-0.5',
};

const Button = ({ variant = 'primary', href, className = '', children, ...props }) => {
  const classes = `inline-block px-8 py-3 rounded-full font-semibold text-center transition-all duration-300 ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
