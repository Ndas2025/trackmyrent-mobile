import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../design";
import { formatCurrency, type Member } from "../data/members";
import { Badge } from "./ui";

export function MemberRow({ member, onPress }: { member: Member; onPress: () => void }) {
  const tone = member.status === "Paid" ? "paid" : member.status === "Overdue" ? "unpaid" : "pending";
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>{member.name.split(" ").map((part) => part[0]).join("")}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.headline}>
          <Text style={styles.name}>{member.name}</Text>
          <Badge label={member.status} tone={tone} />
        </View>
        {member.category ? <Text style={styles.category}>{member.category}</Text> : null}
        <Text style={styles.meta}>{member.business}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{member.unit}</Text>
          <View style={styles.dot} />
          <Text style={styles.meta}>{formatCurrency(member.monthlyRent)}/month</Text>
        </View>
      </View>
      <ChevronRight size={18} color={colors.ink[300]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[4],
    gap: spacing[3],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.line
  },
  pressed: { backgroundColor: colors.surface.soft },
  avatar: { width: 42, height: 42, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand[100], borderRadius: 21 },
  initial: { ...typography.label, color: colors.brand[700] },
  content: { flex: 1, gap: spacing[1] },
  headline: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[2] },
  name: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: colors.ink[900], flex: 1 },
  category: { ...typography.caption, color: colors.brand[700], fontWeight: "700" },
  meta: { ...typography.caption, color: colors.ink[500] },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.ink[300] }
});
