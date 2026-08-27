import { CheckCircle2, Clock3, Plus, WalletCards } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge, Button, Card, SummaryCard } from "../components/ui";
import { useFinance } from "../data/FinanceContext";
import { useMembers } from "../data/MembersContext";
import { formatCurrency } from "../data/members";
import { colors, radii, spacing, typography } from "../design";

export function PaymentsScreen() {
  const { members, markPaid } = useMembers();
  const { payments, addPayment } = useFinance();
  const [recording, setRecording] = useState(false);
  const outstanding = members.filter((m) => m.balance > 0);
  const collected = payments.filter((p) => p.date.includes("Jul 2026")).reduce((s, p) => s + p.amount, 0);
  const pending = outstanding.reduce((s, m) => s + m.balance, 0);
  const record = (memberId: string, amount: number) => {
    addPayment({ memberId, amount, method: "UPI" });
    markPaid(memberId);
    setRecording(false);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>PAYMENT LOG</Text>
            <Text style={styles.title}>Payments</Text>
            <Text style={styles.subtitle}>Record a payment quickly, then review the latest receipts and pending balances.</Text>
          </View>
          <WalletCards size={24} color={colors.brand[600]} />
        </View>
        <View style={styles.grid}>
          <SummaryCard label="Collected" value={formatCurrency(collected)} detail="This month" />
          <SummaryCard label="Pending" value={formatCurrency(pending)} detail={`${outstanding.length} members`} accent="amber" />
        </View>
      </Card>

      <Button fullWidth onPress={() => setRecording(!recording)}>
        {recording ? "Close payment panel" : "Record payment"}
      </Button>

      {recording && (
        <Card style={styles.form}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.section}>Select a member</Text>
              <Text style={styles.muted}>Mark the rent as paid and store the receipt instantly.</Text>
            </View>
            <Clock3 size={18} color={colors.ink[300]} />
          </View>
          {outstanding.map((member) => (
            <Pressable key={member.id} onPress={() => record(member.id, member.balance)} style={styles.choice}>
              <View style={styles.flex}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.muted}>{member.unit}</Text>
              </View>
              <View style={styles.trailing}>
                <Text style={styles.amount}>{formatCurrency(member.balance)}</Text>
                <Plus size={18} color={colors.brand[700]} />
              </View>
            </Pressable>
          ))}
        </Card>
      )}

      <Text style={styles.section}>Recent payments</Text>
      <View style={styles.list}>
        {payments.map((payment) => {
          const member = members.find((m) => m.id === payment.memberId);
          return (
            <Card key={payment.id} style={styles.payment}>
              <CheckCircle2 size={22} color={colors.status.paid} />
              <View style={styles.flex}>
                <Text style={styles.name}>{member?.name ?? "Member"}</Text>
                <Text style={styles.muted}>{payment.date} · {payment.method}</Text>
              </View>
              <View style={styles.trailing}>
                <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
                <Badge label="Paid" tone="paid" />
              </View>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  hero: { gap: spacing[4] },
  heroTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  heroText: { flex: 1, gap: spacing[2] },
  eyebrow: { ...typography.caption, color: colors.brand[700] },
  title: { ...typography.title, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  grid: { flexDirection: "row", gap: spacing[3], flexWrap: "wrap" },
  form: { gap: spacing[2] },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing[3] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  choice: { flexDirection: "row", alignItems: "center", gap: spacing[3], minHeight: 58, borderBottomWidth: 1, borderBottomColor: colors.surface.line },
  flex: { flex: 1 },
  name: { ...typography.label, color: colors.ink[900] },
  muted: { ...typography.caption, color: colors.ink[500] },
  amount: { ...typography.label, color: colors.ink[900] },
  payment: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  trailing: { alignItems: "flex-end", gap: spacing[1] },
  list: { gap: spacing[3] },
  heroChip: { borderRadius: radii.pill }
});
