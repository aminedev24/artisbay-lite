// components/ImageWithLoader.js

import React, { useEffect, useRef, useState } from "react";
import getConfig from "next/config";

const ImageWithLoader = ({
  src,
  alt,
  className,
  imgClassName,
  wrapperClassName,
  useWrapper = true,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const { publicRuntimeConfig } = getConfig() || {};
  const basePath = publicRuntimeConfig?.basePath || "";
  const fullSrc = src.startsWith("/") ? `${basePath}${src}` : src;

  useEffect(() => {
    const imgEl = imgRef.current;
    if (imgEl?.complete && imgEl.naturalWidth) {
      setLoading(false);
    }
  }, [fullSrc]);

  const handleLoad = () => setLoading(false);
  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const finalImgClass = imgClassName || className;
  const imageElement = (
    <img
      ref={imgRef}
      src={fullSrc}
      alt={alt || ""}
      className={finalImgClass}
      onLoad={handleLoad}
      onError={handleError}
      style={{ opacity: loading ? 0 : 1, transition: "opacity 0.5s ease-in" }}
      {...props}
    />
  );

  if (!useWrapper) {
    return (
      <>
        {loading && !error && (
          <div className="image-spinner-container">
            <div className="image-spinner" />
          </div>
        )}
        {error && <div className="text-red-500">Error loading image</div>}
        {imageElement}
      </>
    );
  }

  const wrapperClass = ["image-wrapper", wrapperClassName ?? className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {loading && !error && (
        <div className="image-spinner-container">
          <div className="image-spinner" />
        </div>
      )}
      {error && <div className="text-red-500">Error loading image</div>}
      {imageElement}
    </div>
  );
};

export default ImageWithLoader;
