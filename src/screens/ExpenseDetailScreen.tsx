import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, Repeat2 } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../components/ui";
import { useFinance } from "../data/FinanceContext";
import { formatCurrency } from "../data/members";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ExpenseDetail">;

export function ExpenseDetailScreen({ route, navigation }: Props) {
  const { expenses, deleteExpense } = useFinance();
  const expense = expenses.find((item) => item.id === route.params.expenseId);
  const [confirmVisible, setConfirmVisible] = useState(false);

  if (!expense) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Expense not found.</Text>
      </View>
    );
  }

  const confirmDelete = () => setConfirmVisible(true);
  const deleteNow = () => {
    deleteExpense(expense.id);
    setConfirmVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Card style={styles.summary}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>₹</Text>
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.title}>{expense.title}</Text>
            <Text style={styles.subtitle}>
              {expense.category} · {expense.date}
            </Text>
            <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
          </View>
        </Card>

        <Card style={styles.details}>
          <Detail icon={Repeat2} label="Recurrence" value={expense.recurrence} />
          <Detail icon={CalendarDays} label="Recorded on" value={expense.date} />
        </Card>

        <Text style={styles.note}>Monthly expenses repeat every cycle. One-time expenses stay attached to this month only.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="danger" fullWidth onPress={confirmDelete}>
          Delete expense
        </Button>
      </View>

      <Modal transparent visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setConfirmVisible(false)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Do you really want to delete this expense?</Text>
            <View style={styles.modalActions}>
              <View style={styles.modalSecondary}>
                <Button variant="secondary" fullWidth onPress={() => setConfirmVisible(false)}>
                  Cancel
                </Button>
              </View>
              <View style={styles.modalPrimary}>
                <Button variant="danger" fullWidth onPress={deleteNow}>
                  Delete
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Repeat2; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Icon size={18} color={colors.ink[500]} />
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[4] },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { ...typography.body, color: colors.ink[500] },
  summary: { flexDirection: "row", gap: spacing[3], alignItems: "center" },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brand[50],
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: spacing[1]
  },
  iconText: { fontSize: 26, lineHeight: 30, fontWeight: "800", color: colors.brand[700] },
  summaryCopy: { flex: 1, gap: spacing[1] },
  title: { ...typography.sectionTitle, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  amount: { fontSize: 24, lineHeight: 30, fontWeight: "800", color: colors.status.unpaid },
  details: { gap: spacing[4] },
  detailRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  detailCopy: { flex: 1 },
  detailLabel: { ...typography.caption, color: colors.ink[500], textTransform: "uppercase" },
  detailValue: { ...typography.body, color: colors.ink[900] },
  note: { ...typography.caption, color: colors.ink[500], textAlign: "center" },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(16, 35, 31, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[4]
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    gap: spacing[4]
  },
  modalTitle: { ...typography.sectionTitle, color: colors.ink[900] },
  modalActions: { flexDirection: "row", gap: spacing[2] },
  modalSecondary: { flex: 1 },
  modalPrimary: { flex: 1 }
});
