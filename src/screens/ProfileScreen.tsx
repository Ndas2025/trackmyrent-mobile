import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../components/ui";
import { useAuth } from "../data/AuthContext";
import { useOnboarding } from "../data/OnboardingContext";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signOut, isBackendConfigured } = useAuth();
  const { phoneNumber, category, subscription } = useOnboarding();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace("Auth");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out right now.";
      Alert.alert("Sign out failed", message);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.eyebrow}>PROFILE</Text>
        <Text style={styles.title}>{user?.email ?? "Business owner"}</Text>
        <Text style={styles.subtitle}>{isBackendConfigured ? "Your account is connected to cloud storage." : "Backend is not configured in this build, so the app is using local preview mode."}</Text>
      </Card>
      <Card>
        <Text style={styles.section}>Account</Text>
        <Text style={styles.body}>Email: {user?.email ?? "Not signed in"}</Text>
        <Text style={styles.body}>Phone: {phoneNumber ?? "Not added yet"}</Text>
      </Card>
      <Card>
        <Text style={styles.section}>Business setup</Text>
        <Text style={styles.body}>Category: {category ?? "Not selected yet"}</Text>
        <Text style={styles.body}>Plan: {subscription}</Text>
      </Card>
      {isBackendConfigured ? (
        <>
          <Button fullWidth onPress={handleSignOut}>
            Sign out
          </Button>
          <Button fullWidth variant="danger" onPress={() => navigation.navigate("DeleteAccount")}>
            Delete account
          </Button>
        </>
      ) : null}
      {!isBackendConfigured ? (
        <Card>
          <Text style={styles.section}>Account deletion</Text>
          <Text style={styles.body}>Account deletion requests are only available when the backend is configured and you are signed in.</Text>
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  eyebrow: { ...typography.caption, color: colors.brand[700] },
  title: { ...typography.title, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  section: { ...typography.sectionTitle, color: colors.ink[900], marginBottom: spacing[2] },
  body: { ...typography.body, color: colors.ink[600] }
});
