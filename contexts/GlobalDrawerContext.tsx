"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Movie, TvSeries } from "@/typings";

type DrawerItem =
  | { type: "movie"; item: Movie }
  | { type: "tv"; item: TvSeries };

type GlobalDrawerContextType = {
  activeItem: DrawerItem | null;
  isDrawerOpen: boolean;
  openDrawer: (item: DrawerItem) => void;
  closeDrawer: () => void;
};

const GlobalDrawerContext = createContext<GlobalDrawerContextType | undefined>(
  undefined
);

export function GlobalDrawerProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<DrawerItem | null>(null);
  const isDrawerOpen = activeItem !== null;

  const openDrawer = (item: DrawerItem) => {
    console.log("Opening global drawer for:", item);
    setActiveItem(item);
  };

  const closeDrawer = () => {
    console.log("Closing global drawer");
    setActiveItem(null);
  };

  return (
    <GlobalDrawerContext.Provider
      value={{ activeItem, isDrawerOpen, openDrawer, closeDrawer }}
    >
      {children}
      {/* Global drawer logic is handled separately */}
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
