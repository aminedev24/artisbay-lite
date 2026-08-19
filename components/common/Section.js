import React from 'react';

const TONE_CLASSES = {
  light: 'bg-white',
  navy: 'bg-gradient-to-br from-brand-navy to-brand-navy-dark text-white',
  muted: 'bg-gray-50',
};

const Section = ({ tone = 'light', className = '', children, ...props }) => (
  <section
    className={`shadow-sm px-4 py-16 ${TONE_CLASSES[tone] || TONE_CLASSES.light} ${className}`}
    {...props}
  >
    {children}
  </section>
);

export default Section;
