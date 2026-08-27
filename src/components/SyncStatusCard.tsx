import { StyleSheet, Text } from "react-native";
import { colors, spacing, typography } from "../design";
import { Card } from "./ui";

type SyncStatusCardProps = {
  title: string;
  message: string;
  tone?: "warning" | "error";
};

export function SyncStatusCard({ title, message, tone = "warning" }: SyncStatusCardProps) {
  return (
    <Card style={[styles.card, tone === "error" ? styles.errorCard : styles.warningCard]}>
      <Text style={[styles.title, tone === "error" ? styles.errorTitle : styles.warningTitle]}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing[2] },
  warningCard: { backgroundColor: colors.status.pendingSoft, borderColor: colors.status.pending },
  errorCard: { backgroundColor: colors.status.unpaidSoft, borderColor: colors.status.unpaid },
  title: { ...typography.label },
  warningTitle: { color: colors.ink[900] },
  errorTitle: { color: colors.status.unpaid },
  message: { ...typography.body, color: colors.ink[700] }
});
