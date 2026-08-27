import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Smartphone } from "lucide-react-native";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, TextField } from "../components/ui";
import { useOnboarding } from "../data/OnboardingContext";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AccountSetup">;

export function AccountSetupScreen({ navigation }: Props) {
  const { phoneNumber, setPhoneNumber } = useOnboarding();
  const [phone, setPhone] = useState(phoneNumber ?? "");
  const [submitted, setSubmitted] = useState(false);

  const normalized = useMemo(() => phone.replace(/\D/g, "").slice(0, 10), [phone]);
  const isValid = normalized.length === 10;
  const errorText = submitted && !isValid ? "Enter a valid 10-digit mobile number" : undefined;

  const continueToCategory = () => {
    setSubmitted(true);
    if (!isValid) return;
    setPhoneNumber(normalized);
    navigation.replace("CategorySelect");
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.hero}>
            <View style={styles.iconWrap}>
              <Smartphone size={28} color={colors.brand[700]} />
            </View>
            <Text style={styles.eyebrow}>Create account</Text>
            <Text style={styles.title}>Add your mobile number</Text>
            <Text style={styles.description}>We’ll use this number to set up your account before we continue to category selection.</Text>
          </Card>

          <Card style={styles.form}>
            <Text style={styles.section}>Mobile number</Text>
            <TextField
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="Enter 10 digit mobile number"
              helperText="For now, we only check that the number has 10 digits."
              errorText={errorText}
            />
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button fullWidth onPress={continueToCategory}>
            Continue
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  page: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    paddingBottom: spacing[6],
    gap: spacing[5]
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
  description: { ...typography.body, color: colors.ink[600], textAlign: "center", maxWidth: 300 },
  form: { gap: spacing[4] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
