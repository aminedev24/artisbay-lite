import React, { useState, useEffect } from 'react';

const ImageOptimizer = ({
  src,
  alt,
  width,
  height,
  placeholder,
  className,
  style,
  onLoad,
  onError,
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = React.useRef();

  useEffect(() => {
    if (!imageRef.current || isInView) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '200px' // Start loading when 200px away from viewport
    });

    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    if (onError) onError(e);
  };

  return (
    <div 
      ref={imageRef}
      style={{
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        overflow: 'hidden',
        backgroundColor: placeholder ? 'transparent' : '',
        ...style
      }}
      className={className}
    >
      {/* Placeholder (blur or color) */}
      {placeholder && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("${placeholder}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease-out'
          }}
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in'
          }}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageOptimizer;