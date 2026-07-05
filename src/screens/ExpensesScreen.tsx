import { ReceiptText } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, SummaryCard, TextField } from "../components/ui";
import { useFinance } from "../data/FinanceContext";
import { formatCurrency } from "../data/members";
import { colors, spacing, typography } from "../design";

export function ExpensesScreen() {
  const { expenses, addExpense } = useFinance(); const [adding, setAdding] = useState(false); const [title, setTitle] = useState(""); const [category, setCategory] = useState(""); const [amount, setAmount] = useState("");
  const save = () => { if (!title.trim() || !category.trim() || Number(amount) <= 0) return; addExpense({ title: title.trim(), category: category.trim(), amount: Number(amount) }); setTitle(""); setCategory(""); setAmount(""); setAdding(false); };
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <SummaryCard label="Total expenses" value={formatCurrency(total)} detail="Recorded across all periods" accent="amber" />
    <Button fullWidth onPress={() => setAdding(!adding)}>{adding ? "Cancel" : "Add expense"}</Button>
    {adding && <Card style={styles.form}><Text style={styles.section}>New expense</Text><TextField label="Description" value={title} onChangeText={setTitle} placeholder="e.g. Lift maintenance" /><TextField label="Category" value={category} onChangeText={setCategory} placeholder="e.g. Maintenance" /><TextField label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="₹ 0" /><Button fullWidth onPress={save}>Save expense</Button></Card>}
    <Text style={styles.section}>Expense history</Text>
    {expenses.map((expense) => <Card key={expense.id} style={styles.row}><View style={styles.icon}><ReceiptText size={20} color={colors.accent.amber} /></View><View style={styles.flex}><Text style={styles.name}>{expense.title}</Text><Text style={styles.muted}>{expense.category} · {expense.date}</Text></View><Text style={styles.amount}>−{formatCurrency(expense.amount)}</Text></Card>)}
  </ScrollView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surface.app }, content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[10] }, form: { gap: spacing[4] }, section: { ...typography.sectionTitle, color: colors.ink[900] }, row: { flexDirection: "row", alignItems: "center", gap: spacing[3] }, icon: { width: 40, height: 40, alignItems: "center", justifyContent: "center", backgroundColor: colors.status.pendingSoft }, flex: { flex: 1 }, name: { ...typography.label, color: colors.ink[900] }, muted: { ...typography.caption, color: colors.ink[500] }, amount: { ...typography.label, color: colors.status.unpaid } });
