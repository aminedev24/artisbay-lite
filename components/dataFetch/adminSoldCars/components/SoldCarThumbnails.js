import React from "react";
import { API_BASE, PLACEHOLDER_IMAGE } from "../constants";
import { normalizeImagePath } from "../utils";

const SoldCarThumbnails = ({ images = [], onSelectImage }) => {
  const displayList = images.length ? images.slice(0, 3) : [PLACEHOLDER_IMAGE];

  return (
    <div className="flex gap-2">
      {displayList.map((img, index) => {
        const isPlaceholder = img === PLACEHOLDER_IMAGE;
        const normalizedPath = normalizeImagePath(img);
        const usesAbsolutePath =
          normalizedPath.startsWith("http") ||
          normalizedPath.startsWith("data:") ||
          normalizedPath.startsWith("blob:");
        const src =
          isPlaceholder || usesAbsolutePath
            ? normalizedPath || PLACEHOLDER_IMAGE
            : `${API_BASE}/${normalizedPath}`;

        return (
          <img
            key={`${img}-${index}`}
            src={src}
            className={`h-12 w-12 rounded object-cover shadow ${
              isPlaceholder ? "opacity-60" : "cursor-pointer hover:scale-105"
            }`}
            onClick={() =>
              !isPlaceholder && onSelectImage?.({ images, index })
            }
            alt="car thumb"
          />
        );
      })}
      {images.length > 3 && (
        <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-200 text-xs font-semibold text-slate-600">
          +{images.length - 3}
        </div>
      )}
    </div>
  );
};

export default SoldCarThumbnails;
