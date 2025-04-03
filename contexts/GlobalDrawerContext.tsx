"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Movie } from "@/typings";

type GlobalDrawerContextType = {
  activeMovie: Movie | null;
  isDrawerOpen: boolean;
  openDrawer: (movie: Movie) => void;
  closeDrawer: () => void;
};

const GlobalDrawerContext = createContext<GlobalDrawerContextType | undefined>(
  undefined
);

export function GlobalDrawerProvider({ children }: { children: ReactNode }) {
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const isDrawerOpen = activeMovie !== null;

  const openDrawer = (movie: Movie) => {
    console.log("Opening global drawer for:", movie.title);
    setActiveMovie(movie);
  };

  const closeDrawer = () => {
    console.log("Closing global drawer");
    setActiveMovie(null);
  };

  return (
    <GlobalDrawerContext.Provider
      value={{ activeMovie, isDrawerOpen, openDrawer, closeDrawer }}
    >
      {children}
      {/* Render the drawer at the app level, outside of any carousel */}
      {activeMovie && (
        <div id="global-drawer-container">
          {/* MovieDetailsDrawer will be imported and used in the layout */}
        </div>
      )}
    </GlobalDrawerContext.Provider>
  );
}

export function useGlobalDrawer() {
  const context = useContext(GlobalDrawerContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalDrawer must be used within a GlobalDrawerProvider"
    );
  }
  return context;
}
