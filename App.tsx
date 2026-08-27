import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { colors } from "./src/design";
import { AuthProvider } from "./src/data/AuthContext";
import { MembersProvider } from "./src/data/MembersContext";
import { FinanceProvider } from "./src/data/FinanceContext";
import { OnboardingProvider } from "./src/data/OnboardingContext";

const theme = {
  dark: false,
  colors: {
    primary: colors.brand[600],
    background: colors.surface.app,
    card: colors.surface.card,
    text: colors.ink[900],
    border: colors.surface.line,
    notification: colors.status.unpaid
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" as const },
    medium: { fontFamily: "System", fontWeight: "500" as const },
    bold: { fontFamily: "System", fontWeight: "700" as const },
    heavy: { fontFamily: "System", fontWeight: "800" as const }
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OnboardingProvider>
          <MembersProvider>
            <FinanceProvider>
              <NavigationContainer theme={theme}>
                <AppNavigator />
                <StatusBar style="dark" />
              </NavigationContainer>
            </FinanceProvider>
          </MembersProvider>
        </OnboardingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
