"use client";
import React, { ComponentType, useEffect, useState } from "react";
import { Star } from "lucide-react";

const iconMap: Record<string, () => Promise<{ default: ComponentType<any> }>> =
  {
    Action: () => import("lucide-react").then((mod) => ({ default: mod.Zap })),
    Adventure: () =>
      import("lucide-react").then((mod) => ({ default: mod.Compass })),
    Animation: () =>
      import("lucide-react").then((mod) => ({ default: mod.Film })),
    Comedy: () =>
      import("lucide-react").then((mod) => ({ default: mod.Laugh })),
    Crime: () =>
      import("lucide-react").then((mod) => ({ default: mod.Shield })),
    Documentary: () =>
      import("lucide-react").then((mod) => ({ default: mod.BookOpen })),
    Drama: () =>
      import("lucide-react").then((mod) => ({ default: mod.Theater })),
    Family: () =>
      import("lucide-react").then((mod) => ({ default: mod.Users })),
    Fantasy: () =>
      import("lucide-react").then((mod) => ({ default: mod.Moon })),
    History: () =>
      import("lucide-react").then((mod) => ({ default: mod.Archive })),
    Horror: () =>
      import("lucide-react").then((mod) => ({ default: mod.Ghost })),
    Music: () => import("lucide-react").then((mod) => ({ default: mod.Music })),
    Mystery: () =>
      import("lucide-react").then((mod) => ({ default: mod.HelpCircle })),
    Romance: () =>
      import("lucide-react").then((mod) => ({ default: mod.Heart })),
    "Science Fiction": () =>
      import("lucide-react").then((mod) => ({ default: mod.Cpu })),
    "TV Movie": () =>
      import("lucide-react").then((mod) => ({ default: mod.Monitor })),
    Thriller: () =>
      import("lucide-react").then((mod) => ({ default: mod.Eye })),
    War: () => import("lucide-react").then((mod) => ({ default: mod.Swords })),
    Western: () =>
      import("lucide-react").then((mod) => ({ default: mod.Sunset })),
  };

export function getGenreIconComponent(genreName: string): ComponentType<any> {
  const LazyIcon = iconMap[genreName];
  const [Icon, setIcon] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    LazyIcon()
      .then((mod) => setIcon(() => mod.default))
      .catch(() => setIcon(() => Star));
  }, [genreName]);

  return Icon || (() => null);
}
