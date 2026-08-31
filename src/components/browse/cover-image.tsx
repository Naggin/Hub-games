"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

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

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) {
          setCurrent(fallbackSrc);
        }
      }}
    />
  );
}
