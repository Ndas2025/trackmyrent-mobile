import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../design";
import { Card } from "./Card";

type SummaryCardProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: "brand" | "blue" | "amber" | "red";
};

export function SummaryCard({ label, value, detail, accent = "brand" }: SummaryCardProps) {
  return (
    <Card style={styles.card}>
      <View style={[styles.marker, styles[accent]]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 142,
    gap: spacing[2]
  },
  marker: {
    width: 28,
    height: 4,
    borderRadius: 999
  },
  brand: {
    backgroundColor: colors.brand[600]
  },
  blue: {
    backgroundColor: colors.accent.blue
  },
  amber: {
    backgroundColor: colors.accent.amber
  },
  red: {
    backgroundColor: colors.status.unpaid
  },
  label: {
    ...typography.caption,
    color: colors.ink[500],
    textTransform: "uppercase"
  },
  value: {
    color: colors.ink[900],
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30
  },
  detail: {
    ...typography.caption,
    color: colors.ink[600]
  }
});
