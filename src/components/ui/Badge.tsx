import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../../design";

type BadgeTone = "paid" | "unpaid" | "frozen" | "pending" | "neutral";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={[styles.label, styles[`${tone}Label`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1]
  },
  label: {
    ...typography.caption
  },
  paid: {
    backgroundColor: colors.status.paidSoft
  },
  unpaid: {
    backgroundColor: colors.status.unpaidSoft
  },
  frozen: {
    backgroundColor: colors.status.frozenSoft
  },
  pending: {
    backgroundColor: colors.status.pendingSoft
  },
  neutral: {
    backgroundColor: colors.status.neutralSoft
  },
  paidLabel: {
    color: colors.status.paid
  },
  unpaidLabel: {
    color: colors.status.unpaid
  },
  frozenLabel: {
    color: colors.status.frozen
  },
  pendingLabel: {
    color: colors.status.pending
  },
  neutralLabel: {
    color: colors.status.neutral
  }
});
