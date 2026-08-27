import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SyncStatusCard } from "../components/SyncStatusCard";
import { Button, Card, TextField } from "../components/ui";
import { useAuth } from "../data/AuthContext";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "DeleteAccount">;

export function DeleteAccountScreen({ navigation }: Props) {
  const { requestAccountDeletion, signOut, user } = useAuth();
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const requiredText = "DELETE";
  const confirmed = confirmText.trim().toUpperCase() === requiredText;

  const submit = async () => {
    if (!confirmed) {
      Alert.alert("Confirmation needed", "Type DELETE to confirm your account deletion request.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);
      await requestAccountDeletion(reason.trim());
      await signOut();
      Alert.alert("Deletion requested", "Your account deletion request has been recorded. You have been signed out.");
      navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We couldn't submit the deletion request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.warningCard}>
            <Text style={styles.eyebrow}>Danger zone</Text>
            <Text style={styles.title}>Request account deletion</Text>
            <Text style={styles.description}>This sends a deletion request for the signed-in account and signs you out. Complete final account removal through your support workflow after the request is received.</Text>
          </Card>

          <Card style={styles.form}>
            <Text style={styles.section}>Signed-in account</Text>
            <Text style={styles.body}>{user?.email ?? "Unknown account"}</Text>

            <TextField
              label="Reason for deletion"
              value={reason}
              onChangeText={setReason}
              placeholder="Optional note about why you are leaving"
              multiline
              style={styles.multilineInput}
            />

            <TextField
              label="Type DELETE to confirm"
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="DELETE"
            />

            {message ? <SyncStatusCard title="Request failed" message={message} tone="error" /> : null}
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button fullWidth variant="danger" loading={submitting} onPress={submit}>
            Submit deletion request
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  page: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[4] },
  warningCard: { gap: spacing[3], backgroundColor: colors.status.unpaidSoft, borderColor: colors.status.unpaid },
  eyebrow: { ...typography.caption, color: colors.status.unpaid, textTransform: "uppercase" },
  title: { ...typography.title, color: colors.ink[900] },
  description: { ...typography.body, color: colors.ink[700] },
  form: { gap: spacing[4] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  body: { ...typography.body, color: colors.ink[700] },
  multilineInput: { minHeight: 96, textAlignVertical: "top", paddingTop: spacing[3] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
