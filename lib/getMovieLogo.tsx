import React from "react";

interface MovieLogoProps {
  title: string;
  className?: string;
}

/**
 * Generates a stylized logo component from a movie title
 */
export function MovieLogo({ title, className = "" }: MovieLogoProps) {
  // Ensure title is defined and a string
  if (!title || typeof title !== "string") {
    return (
      <div className={`text-4xl font-bold text-white ${className}`}>Movie</div>
    );
  }

  // Split the title into words to style them differently if needed
  const words = title.split(" ");

  // Apply different styles based on title length
  let titleStyles = "text-white font-bold tracking-wider";
  let containerStyles = "flex flex-col";

  if (words.length === 1) {
    // Single word title
    titleStyles += " text-6xl";
  } else if (words.length === 2) {
    // Two word title - stack them
    containerStyles += " space-y-1";
    titleStyles += " text-5xl";
  } else {
    // Multi-word title
    containerStyles += " space-y-2";
    titleStyles += " text-4xl";
  }

  return (
    <div className={`${containerStyles} ${className}`}>
      {words.length <= 2 ? (
        // For 1-2 words, display each word on its own line with custom styling
        words.map((word, index) => (
          <div
            key={index}
            className={`${titleStyles} movie-logo-text ${
              index === 0 ? "text-red-600" : "text-white"
            }`}
            style={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
              letterSpacing: "0.05em",
              lineHeight: "0.9",
            }}
          >
            {word.toUpperCase()}
          </div>
        ))
      ) : (
        // For multi-word titles, group them more compactly
        <div
          className={`${titleStyles} movie-logo-text`}
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
            letterSpacing: "0.05em",
            lineHeight: "1",
          }}
        >
          {title.toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default MovieLogo;
