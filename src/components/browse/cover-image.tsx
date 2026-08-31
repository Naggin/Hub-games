"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

function needsUnoptimized(src: string) {
  return (
    src.includes("placehold.co") ||
    src.includes("library_600x900") ||
    src.includes("library_hero")
  );
}

export function CoverImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: Omit<ImageProps, "src" | "alt"> & {
  src: string;
  fallbackSrc?: string;
  alt: string;
}) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      unoptimized={needsUnoptimized(current)}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) {
          setCurrent(fallbackSrc);
        }
      }}
    />
  );
}
