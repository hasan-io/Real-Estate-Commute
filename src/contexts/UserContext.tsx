import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "user" | "broker" | "owner" | null;
export type LifestylePreference = "quiet" | "family" | "cafe" | "fitness" | "nightlife" | null;

interface UserPreferences {
  role: UserRole;
  lifestylePreference: LifestylePreference;
  monthlyBudget: number;
  officeLocation: string;
}

interface UserContextType {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  hasCompletedOnboarding: boolean;
  compareList: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const defaultPreferences: UserPreferences = {
  role: null,
  lifestylePreference: null,
  monthlyBudget: 20000,
  officeLocation: "",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem("truenest_preferences");
    return stored ? JSON.parse(stored) : defaultPreferences;
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const stored = localStorage.getItem("truenest_compare");
    return stored ? JSON.parse(stored) : [];
  });

  const hasCompletedOnboarding = preferences.role !== null;

  const setPreferences = (prefs: UserPreferences) => {
    setPreferencesState(prefs);
    localStorage.setItem("truenest_preferences", JSON.stringify(prefs));
  };

  const addToCompare = (id: string) => {
    setCompareList((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem("truenest_compare", JSON.stringify(next));
      return next;
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem("truenest_compare", JSON.stringify(next));
      return next;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.setItem("truenest_compare", JSON.stringify([]));
  };

  return (
    <UserContext.Provider
      value={{
        preferences,
        setPreferences,
        hasCompletedOnboarding,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
