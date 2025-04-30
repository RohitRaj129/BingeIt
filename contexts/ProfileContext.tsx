"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Profile = {
  name: string;
  type: string;
  avatar_color?: string;
};

type ProfileContextType = {
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile) => void;
  clearProfile: () => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [selectedProfile, setSelectedProfileState] = useState<Profile | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("selectedProfile");
    if (stored) {
      setSelectedProfileState(JSON.parse(stored));
    }
  }, []);

  const setSelectedProfile = (profile: Profile) => {
    setSelectedProfileState(profile);
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
  };

  const clearProfile = () => {
    setSelectedProfileState(null);
    localStorage.removeItem("selectedProfile");
  };

  return (
    <ProfileContext.Provider
      value={{ selectedProfile, setSelectedProfile, clearProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return context;
}
