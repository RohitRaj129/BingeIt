import React from "react";

interface TvSeriesLogoProps {
  title: string;
  className?: string;
}

/**
 * Generates a stylized logo component from a TV series title
 */
export function TvSeriesLogo({ title, className = "" }: TvSeriesLogoProps) {
  if (!title || typeof title !== "string") {
    return (
      <div
        className={`text-base sm:text-4xl font-bold text-white ${className}`}
      >
        TV Series
      </div>
    );
  }

  return (
    <div className={`text-base sm:text-4xl font-bold text-white ${className}`}>
      {title}
    </div>
  );
}

export default TvSeriesLogo;
