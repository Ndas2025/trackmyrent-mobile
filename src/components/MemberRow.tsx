import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../design";
import { formatCurrency, type Member } from "../data/members";
import { Badge } from "./ui";

export function MemberRow({ member, onPress }: { member: Member; onPress: () => void }) {
  const tone = member.status === "Paid" ? "paid" : member.status === "Overdue" ? "unpaid" : "pending";
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
    <View style={styles.avatar}><Text style={styles.initial}>{member.name.split(" ").map((part) => part[0]).join("")}</Text></View>
    <View style={styles.content}>
      <Text style={styles.name}>{member.name}</Text>
      <Text style={styles.meta}>{member.unit} · {formatCurrency(member.monthlyRent)}/month</Text>
    </View>
    <View style={styles.trailing}><Badge label={member.status} tone={tone} /><ChevronRight size={18} color={colors.ink[300]} /></View>
  </Pressable>;
}

const styles = StyleSheet.create({
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", padding: spacing[4], gap: spacing[3], backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.surface.line },
  pressed: { backgroundColor: colors.surface.soft },
  avatar: { width: 42, height: 42, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand[100], borderRadius: 21 },
  initial: { ...typography.label, color: colors.brand[700] },
  content: { flex: 1, gap: 2 }, name: { ...typography.body, fontWeight: "700", color: colors.ink[900] }, meta: { ...typography.caption, color: colors.ink[500] },
  trailing: { alignItems: "flex-end", gap: spacing[2] }
});
