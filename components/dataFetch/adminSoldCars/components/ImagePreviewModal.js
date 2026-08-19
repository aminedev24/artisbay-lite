import React, { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { API_BASE, PLACEHOLDER_IMAGE } from "../constants";
import { normalizeImagePath } from "../utils";

const resolveImageSource = (image) => {
  if (!image) return "";

  const isString = typeof image === "string";
  const normalizedPath = isString
    ? normalizeImagePath(image)
    : image?.preview || image?.url || "";

  if (!normalizedPath) return "";

  const usesAbsolutePath =
    normalizedPath.startsWith("http") ||
    normalizedPath.startsWith("data:") ||
    normalizedPath.startsWith("blob:");

  return isString && !usesAbsolutePath
    ? `${API_BASE}/${normalizedPath}`
    : normalizedPath;
};

const ImagePreviewModal = ({ selection, onClose }) => {
  const images = selection?.images ?? [];

  const slides = useMemo(
    () =>
      images.map((img, idx) => ({
        key: `${idx}-${
          typeof img === "string" ? img : img?.name || img?.preview || "local"
        }`,
        src: resolveImageSource(img) || PLACEHOLDER_IMAGE,
      })),
    [images],
  );

  const slideCount = slides.length;
  const initialIndex = Math.min(
    Math.max(selection?.index ?? 0, 0),
    Math.max(slideCount - 1, 0),
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const swiperRef = useRef(null);

  useEffect(() => {
    setActiveIndex(initialIndex);
    if (swiperRef.current) {
      swiperRef.current.slideTo(initialIndex, 0);
    }
  }, [initialIndex, slideCount]);

  if (!selection || !slideCount) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm transition"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-white/95 p-6 shadow-2xl ring-1 ring-black/5">
        <button
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-lg text-white transition hover:bg-black"
          onClick={onClose}
          aria-label="Close preview"
        >
          &times;
        </button>

        <div className="mt-6 flex flex-col gap-2 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Image {activeIndex + 1} / {slideCount}
          </span>
          <span className="text-xs font-normal uppercase tracking-[0.3em] text-slate-400">
            Use arrows or swipe
          </span>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          initialSlide={initialIndex}
          onSwiper={(swiperInstance) => {
            swiperRef.current = swiperInstance;
          }}
          onSlideChange={(swiperInstance) => {
            const current =
              swiperInstance.realIndex ?? swiperInstance.activeIndex ?? 0;
            setActiveIndex(current);
          }}
          className="mt-8"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.key}>
              <div className="flex h-full min-h-[40vh] w-full items-center justify-center">
                <img
                  src={slide.src}
                  alt={`Car ${idx + 1}`}
                  className="max-h-[70vh] w-full rounded-2xl border border-black/10 object-contain shadow-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
