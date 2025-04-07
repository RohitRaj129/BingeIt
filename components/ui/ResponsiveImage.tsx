"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ResponsiveImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackSrc?: string;
  showLoadingPlaceholder?: boolean;
}

export default function ResponsiveImage({
  src,
  alt,
  fallbackSrc = "/not_found.png",
  showLoadingPlaceholder = true,
  className = "",
  ...props
}: ResponsiveImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageSrc = error ? fallbackSrc : src;

  return (
    <>
      {showLoadingPlaceholder && isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg z-0" />
      )}

      <Image
        src={imageSrc}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={() => {
          console.error(`Image failed to load: "${src}"`);
          setError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
        unoptimized={error}
        {...props}
      />
    </>
  );
}
