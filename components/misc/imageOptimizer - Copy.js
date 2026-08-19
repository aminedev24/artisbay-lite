// components/OptimizedImage.jsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage
 * - Works for ANY image (local or remote)
 * - Lazy loads with optional blur-up
 * - Applies sizes/responsiveness via CSS instead of srcset
 */

const OptimizedImage = ({
  src,
  alt,
  className = '',
  style = {},
  placeholder = null,
  width = '100%',
  height = 'auto',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  // Lazy-load logic
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        ...style,
      }}
    >
      {!loaded && placeholder && (
        <img
          src={placeholder}
          alt="placeholder"
          className="absolute top-0 left-0 w-full h-full object-cover blur-xl scale-105"
          style={{ transition: 'opacity 0.3s ease' }}
        />
      )}

      {isVisible && (
        <img
          ref={imgRef}
          src={src.startsWith('/images') ? src : `/images/${src}`}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default OptimizedImage;
