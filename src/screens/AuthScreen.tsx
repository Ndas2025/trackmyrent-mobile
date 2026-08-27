import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Building2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, TextField } from "../components/ui";
import { useAuth } from "../data/AuthContext";
import { useOnboarding } from "../data/OnboardingContext";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;
type AuthMode = "sign-in" | "sign-up";

export function AuthScreen({ navigation }: Props) {
  const { signIn, signUp, isBackendConfigured } = useAuth();
  const { completed } = useOnboarding();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";
  const emailValid = /\S+@\S+\.\S+/.test(email.trim());
  const passwordValid = password.length >= 8;
  const confirmValid = !isSignUp || confirmPassword === password;
  const canSubmit = emailValid && passwordValid && confirmValid;

  const errors = useMemo(() => ({
    email: submitted && !emailValid ? "Enter a valid email address" : undefined,
    password: submitted && !passwordValid ? "Password must be at least 8 characters" : undefined,
    confirmPassword: submitted && !confirmValid ? "Passwords do not match" : undefined
  }), [confirmValid, emailValid, isSignUp, passwordValid, submitted]);

  const routeAfterAuth = () => {
    navigation.replace(completed ? "MainTabs" : "Intro");
  };

  const submit = async () => {
    setSubmitted(true);
    setMessage(null);
    if (!canSubmit) return;

    try {
      setLoading(true);
      if (isSignUp) {
        const result = await signUp(email.trim().toLowerCase(), password);
        if (result.needsEmailConfirmation) {
          setMessage("Check your email to confirm the account, then sign in.");
          setMode("sign-in");
          setConfirmPassword("");
          return;
        }
      } else {
        await signIn(email.trim().toLowerCase(), password);
      }

      routeAfterAuth();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We couldn't complete that action.");
    } finally {
      setLoading(false);
    }
  };

  if (!isBackendConfigured) {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <Card style={styles.hero}>
            <View style={styles.iconWrap}>
              <Building2 size={28} color={colors.brand[700]} />
            </View>
            <Text style={styles.title}>Backend setup is still pending</Text>
            <Text style={styles.description}>This build does not have Supabase credentials yet, so sign-in is unavailable. You can still continue in local preview mode.</Text>
          </Card>

          <Button fullWidth onPress={routeAfterAuth}>
            Continue in preview mode
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.hero}>
            <View style={styles.iconWrap}>
              <Building2 size={28} color={colors.brand[700]} />
            </View>
            <Text style={styles.eyebrow}>TrackmyRent account</Text>
            <Text style={styles.title}>{isSignUp ? "Create your account" : "Sign in to continue"}</Text>
            <Text style={styles.description}>Use your email and password to keep your rent data synced and protected.</Text>
          </Card>

          <Card style={styles.form}>
            <Text style={styles.section}>{isSignUp ? "Create account" : "Sign in"}</Text>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              errorText={errors.email}
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              errorText={errors.password}
            />
            {isSignUp ? (
              <TextField
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                secureTextEntry
                errorText={errors.confirmPassword}
              />
            ) : null}

            {message ? <Text style={styles.message}>{message}</Text> : null}
          </Card>

        </ScrollView>

        <View style={styles.footer}>
          <Button fullWidth loading={loading} onPress={submit}>
            {isSignUp ? "Create account" : "Sign in"}
          </Button>
          <Button variant="ghost" fullWidth onPress={() => {
            setMode(isSignUp ? "sign-in" : "sign-up");
            setSubmitted(false);
            setMessage(null);
          }}>
            {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  page: { flex: 1 },
  centered: { flex: 1, padding: spacing[4], justifyContent: "center", gap: spacing[4] },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    paddingBottom: spacing[6],
    gap: spacing[4]
  },
  hero: { alignItems: "center", gap: spacing[3], paddingVertical: spacing[6] },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[100],
    alignItems: "center",
    justifyContent: "center"
  },
  eyebrow: { ...typography.caption, color: colors.brand[700], textTransform: "uppercase" },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "800", color: colors.ink[900], textAlign: "center" },
  description: { ...typography.body, color: colors.ink[600], textAlign: "center", maxWidth: 320 },
  form: { gap: spacing[4] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  message: { ...typography.caption, color: colors.brand[700] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app,
    gap: spacing[2]
  }
});
