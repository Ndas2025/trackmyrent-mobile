import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Building2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../data/AuthContext";
import { colors, radii, spacing, typography } from "../design";
import { useOnboarding } from "../data/OnboardingContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const { ready, completed } = useOnboarding();
  const { loading, session, isBackendConfigured } = useAuth();
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setElapsed(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || !elapsed || loading) return;

    if (isBackendConfigured && !session) {
      navigation.replace("Auth");
      return;
    }

    navigation.replace(completed ? "MainTabs" : "Intro");
  }, [completed, elapsed, isBackendConfigured, loading, navigation, ready, session]);

  return (
    <View style={styles.screen}>
      <View style={styles.brand}>
        <View style={styles.logoBox}>
          <Building2 color={colors.brand[700]} size={42} />
        </View>
        <Text style={styles.name}>TrackmyRent</Text>
        <Text style={styles.tagline}>Paid and unpaid rent, expenses, and plans in one place.</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator color={colors.brand[600]} />
        <Text style={styles.footerText}>{loading ? "Restoring your account" : "Preparing your workspace"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.app,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[8]
  },
  brand: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3]
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[100],
    alignItems: "center",
    justifyContent: "center"
  },
  name: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: colors.ink[900]
  },
  tagline: {
    ...typography.body,
    color: colors.ink[600],
    textAlign: "center",
    maxWidth: 280
  },
  footer: {
    width: "100%",
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  },
  footerText: { ...typography.caption, color: colors.ink[500] }
});
