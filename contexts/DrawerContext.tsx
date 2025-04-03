"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DrawerContextType = {
  openDrawerId: string | null;
  openDrawer: (id: string) => void;
  closeDrawer: (id: string) => void;
  isDrawerOpen: (id: string) => boolean;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  const openDrawer = (id: string) => {
    setOpenDrawerId(id);
  };

  const closeDrawer = (id: string) => {
    if (openDrawerId === id) {
      setOpenDrawerId(null);
    }
  };

  const isDrawerOpen = (id: string) => {
    return openDrawerId === id;
  };

  return (
    <DrawerContext.Provider
      value={{ openDrawerId, openDrawer, closeDrawer, isDrawerOpen }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
}
