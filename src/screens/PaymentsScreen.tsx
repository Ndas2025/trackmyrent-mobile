import { CheckCircle2, Clock3, Plus, WalletCards } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Badge, Button, Card, SummaryCard } from "../components/ui";
import { PeriodPicker } from "../components/PeriodPicker";
import { SyncStatusCard } from "../components/SyncStatusCard";
import { useFinance } from "../data/FinanceContext";
import { useMembers } from "../data/MembersContext";
import { formatCurrency } from "../data/members";
import { colors, radii, spacing, typography } from "../design";
import { isDateInMonthYear, monthNames } from "../utils/date";

const paymentMethods = ["UPI", "Bank", "Cash"] as const;

export function PaymentsScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const { members, markPaid, status: memberStatus, errorMessage: memberError, clearError: clearMemberError } = useMembers();
  const { payments, addPayment, status: financeStatus, errorMessage: financeError, clearError: clearFinanceError } = useFinance();
  const now = new Date();
  const [recording, setRecording] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMethod, setSelectedMethod] = useState<(typeof paymentMethods)[number]>("UPI");
  const [recordingPaymentId, setRecordingPaymentId] = useState<string | null>(null);
  const outstanding = members.filter((m) => m.balance > 0);
  const periodPayments = useMemo(
    () => payments.filter((payment) => isDateInMonthYear(payment.date, selectedMonth, selectedYear)),
    [payments, selectedMonth, selectedYear]
  );
  const collected = periodPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = outstanding.reduce((s, m) => s + m.balance, 0);
  const record = async (memberId: string, amount: number) => {
    clearFinanceError();
    clearMemberError();
    try {
      setRecordingPaymentId(memberId);
      await addPayment({ memberId, amount, method: selectedMethod });
      await markPaid(memberId);
      setRecording(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't record the payment.";
      Alert.alert("Payment failed", message);
    } finally {
      setRecordingPaymentId(null);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card style={styles.hero}>
        <View style={[styles.heroTop, isCompact && styles.heroTopCompact]}>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>PAYMENT LOG</Text>
            <Text style={styles.title}>Payments</Text>
            <Text style={styles.subtitle}>Record a payment quickly, then review the latest receipts and pending balances.</Text>
          </View>
          <WalletCards size={24} color={colors.brand[600]} />
        </View>
        <View style={[styles.grid, isCompact && styles.stackRow]}>
          <SummaryCard label="Collected" value={formatCurrency(collected)} detail={`${monthNames[selectedMonth]} ${selectedYear}`} />
          <SummaryCard label="Pending" value={formatCurrency(pending)} detail={`${outstanding.length} members`} accent="amber" />
        </View>
      </Card>
      {financeStatus === "loading" || memberStatus === "loading" ? <SyncStatusCard title="Loading data" message="We are syncing the latest payment and member records." /> : null}
      {financeError ? <SyncStatusCard title="Finance sync problem" message={financeError} tone="error" /> : null}
      {memberError ? <SyncStatusCard title="Member sync problem" message={memberError} tone="error" /> : null}

      <PeriodPicker
        monthLabel={monthNames[selectedMonth]}
        yearLabel={`${selectedYear}`}
        monthOptions={[...monthNames]}
        yearOptions={[2025, 2026, 2027]}
        monthIndex={selectedMonth}
        year={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      <Button fullWidth onPress={() => setRecording(!recording)}>
        {recording ? "Close payment panel" : "Record payment"}
      </Button>

      {recording && (
        <Card style={styles.form}>
          <View style={[styles.sectionHead, isCompact && styles.sectionHeadCompact]}>
            <View>
              <Text style={styles.section}>Select a member</Text>
              <Text style={styles.muted}>Mark the rent as paid and store the receipt instantly.</Text>
            </View>
            <Clock3 size={18} color={colors.ink[300]} />
          </View>
          <View style={styles.methodRow}>
            {paymentMethods.map((method) => {
              const active = selectedMethod === method;
              return (
                <Button
                  key={method}
                  variant={active ? "secondary" : "ghost"}
                  onPress={() => setSelectedMethod(method)}
                  style={[styles.methodButton, active && styles.methodButtonActive]}
                >
                  {method}
                </Button>
              );
            })}
          </View>
          {outstanding.map((member) => (
            <Pressable key={member.id} onPress={() => record(member.id, member.balance)} style={styles.choice} disabled={Boolean(recordingPaymentId)}>
              <View style={styles.flex}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.muted}>{member.unit}</Text>
              </View>
              <View style={[styles.trailing, isCompact && styles.trailingCompact]}>
                <Text style={styles.amount}>{recordingPaymentId === member.id ? "Saving..." : formatCurrency(member.balance)}</Text>
                <Plus size={18} color={colors.brand[700]} />
              </View>
            </Pressable>
          ))}
          {outstanding.length === 0 ? <Text style={styles.muted}>Everyone is marked paid for now.</Text> : null}
        </Card>
      )}

      <Text style={styles.section}>Recent payments</Text>
      <View style={styles.list}>
        {periodPayments.map((payment) => {
          const member = members.find((m) => m.id === payment.memberId);
          return (
            <Card key={payment.id} style={[styles.payment, isCompact && styles.paymentCompact]}>
              <CheckCircle2 size={22} color={colors.status.paid} />
              <View style={styles.flex}>
                <Text style={styles.name}>{member?.name ?? "Member"}</Text>
                <Text style={styles.muted}>{payment.date} · {payment.method}</Text>
              </View>
              <View style={[styles.trailing, isCompact && styles.trailingCompact]}>
                <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
                <Badge label="Paid" tone="paid" />
              </View>
            </Card>
          );
        })}
        {periodPayments.length === 0 ? <Text style={styles.muted}>No payments recorded for this period yet.</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  hero: { gap: spacing[4] },
  heroTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  heroTopCompact: { alignItems: "stretch" },
  heroText: { flex: 1, gap: spacing[2] },
  eyebrow: { ...typography.caption, color: colors.brand[700] },
  title: { ...typography.title, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  grid: { flexDirection: "row", gap: spacing[3], flexWrap: "wrap" },
  stackRow: { flexDirection: "column" },
  form: { gap: spacing[2] },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing[3] },
  sectionHeadCompact: { alignItems: "stretch" },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  methodRow: { flexDirection: "row", gap: spacing[2], flexWrap: "wrap", paddingTop: spacing[2] },
  methodButton: { flex: 1, minHeight: 40 },
  methodButtonActive: { borderColor: colors.brand[100] },
  choice: { flexDirection: "row", alignItems: "center", gap: spacing[3], minHeight: 58, borderBottomWidth: 1, borderBottomColor: colors.surface.line },
  flex: { flex: 1 },
  name: { ...typography.label, color: colors.ink[900] },
  muted: { ...typography.caption, color: colors.ink[500] },
  amount: { ...typography.label, color: colors.ink[900] },
  payment: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  paymentCompact: { alignItems: "flex-start" },
  trailing: { alignItems: "flex-end", gap: spacing[1] },
  trailingCompact: { marginLeft: "auto" },
  list: { gap: spacing[3] },
  heroChip: { borderRadius: radii.pill }
});
