import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type OnboardingCategory = "Gym" | "Tution centre" | "Building rent" | "Hostal/PG" | "Others";
export type OnboardingSubscription = "Free trial 30 days" | "Plus" | "Max" | "Max+";

type OnboardingValue = {
  ready: boolean;
  completed: boolean;
  phoneNumber: string | null;
  category: OnboardingCategory | null;
  subscription: OnboardingSubscription;
  setPhoneNumber: (phoneNumber: string) => void;
  setCategory: (category: OnboardingCategory) => void;
  setSubscription: (subscription: OnboardingSubscription) => void;
  completeOnboarding: () => Promise<void>;
};

type StoredOnboarding = {
  completed: boolean;
  phoneNumber: string | null;
  category: OnboardingCategory | null;
  subscription: OnboardingSubscription;
};

const STORAGE_KEY = "trackmyrent.onboarding";
const demoModeFlag = (process.env as { EXPO_PUBLIC_DEMO_MODE?: string }).EXPO_PUBLIC_DEMO_MODE;
const isDemoMode = demoModeFlag === "1" || demoModeFlag === "true";
const defaultState: StoredOnboarding = {
  completed: false,
  phoneNumber: null,
  category: null,
  subscription: "Free trial 30 days"
};

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [category, setCategory] = useState<OnboardingCategory | null>(null);
  const [subscription, setSubscription] = useState<OnboardingSubscription>(defaultState.subscription);

  useEffect(() => {
    if (isDemoMode) {
      AsyncStorage.removeItem(STORAGE_KEY).catch(console.warn).finally(() => setReady(true));
      return;
    }

    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const parsed = JSON.parse(value) as Partial<StoredOnboarding>;
        setCompleted(Boolean(parsed.completed));
        setPhoneNumber(parsed.phoneNumber ?? null);
        setCategory(parsed.category ?? null);
        setSubscription(parsed.subscription ?? defaultState.subscription);
      })
      .catch(console.warn)
      .finally(() => setReady(true));
  }, []);

  const completeOnboarding = async () => {
    const next: StoredOnboarding = {
      completed: true,
      phoneNumber,
      category,
      subscription
    };
    setCompleted(true);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      ready,
      completed,
      phoneNumber,
      category,
      subscription,
      setPhoneNumber,
      setCategory,
      setSubscription,
      completeOnboarding
    }),
    [category, completed, phoneNumber, ready, subscription]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const value = useContext(OnboardingContext);
  if (!value) {
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  }
  return value;
}
