import React from "react";

interface MovieLogoProps {
  title: string;
  className?: string;
}

/**
 * Generates a stylized logo component from a movie title
 */
export function MovieLogo({ title, className = "" }: MovieLogoProps) {
  if (!title || typeof title !== "string") {
    return (
      <div
        className={`text-base sm:text-4xl font-bold text-white ${className}`}
      >
        Movie
      </div>
    );
  }

  const words = title.split(" ");

  // Responsive base styles
  let titleStyles = "text-white font-bold tracking-wider text-lg sm:text-4xl";
  let containerStyles = "flex flex-col";

  if (words.length === 1) {
    titleStyles += " sm:text-6xl";
  } else if (words.length === 2) {
    containerStyles += " space-y-[2px] sm:space-y-1";
    titleStyles += " sm:text-5xl";
  } else {
    containerStyles += " space-y-[2px] sm:space-y-2";
    titleStyles += " sm:text-4xl";
  }

  return (
    <div className={`${containerStyles} ${className}`}>
      {words.length <= 2 ? (
        words.map((word, index) => (
          <div
            key={index}
            className={`${titleStyles} movie-logo-text ${
              index === 0 ? "text-red-600" : "text-white"
            }`}
            style={{
              textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
              letterSpacing: "0.05em",
              lineHeight: "1.1",
            }}
          >
            {word.toUpperCase()}
          </div>
        ))
      ) : (
        <div
          className={`${titleStyles} movie-logo-text`}
          style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
            letterSpacing: "0.05em",
            lineHeight: "1.1",
          }}
        >
          {title.toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default MovieLogo;
