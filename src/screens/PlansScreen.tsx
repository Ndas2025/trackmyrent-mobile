import { Plus, Users } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge, Button, Card, TextField } from "../components/ui";
import { useFinance } from "../data/FinanceContext";
import { formatCurrency } from "../data/members";
import { colors, spacing, typography } from "../design";

export function PlansScreen() {
  const { plans, addPlan } = useFinance(); const [adding, setAdding] = useState(false); const [name, setName] = useState(""); const [amount, setAmount] = useState("");
  const save = () => { if (!name.trim() || Number(amount) <= 0) return; addPlan({ name: name.trim(), amount: Number(amount), billingCycle: "Monthly" }); setName(""); setAmount(""); setAdding(false); };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.intro}><View><Text style={styles.title}>Rental plans</Text><Text style={styles.muted}>Reusable pricing for your units</Text></View><Button size="sm" onPress={() => setAdding(!adding)}>{adding ? "Cancel" : "New plan"}</Button></View>
    {adding && <Card style={styles.form}><Text style={styles.section}>Create plan</Text><TextField label="Plan name" value={name} onChangeText={setName} placeholder="e.g. Standard Shop" /><TextField label="Monthly rent" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="₹ 0" /><Button fullWidth onPress={save}>Save plan</Button></Card>}
    {plans.map((plan) => <Card key={plan.id} style={styles.plan}><View style={styles.row}><View style={styles.planIcon}><Plus size={19} color={colors.brand[700]} /></View><View style={styles.flex}><Text style={styles.planName}>{plan.name}</Text><Text style={styles.muted}>{plan.billingCycle} billing</Text></View><Badge label={plan.active ? "Active" : "Inactive"} tone={plan.active ? "paid" : "neutral"} /></View><View style={styles.divider} /><View style={styles.row}><Text style={styles.amount}>{formatCurrency(plan.amount)}</Text><View style={styles.members}><Users size={16} color={colors.ink[500]} /><Text style={styles.muted}>{plan.members} members</Text></View></View></Card>)}
  </ScrollView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surface.app }, content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[10] }, intro: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, title: { ...typography.title, color: colors.ink[900] }, muted: { ...typography.caption, color: colors.ink[500] }, form: { gap: spacing[4] }, section: { ...typography.sectionTitle, color: colors.ink[900] }, plan: { gap: spacing[4] }, row: { flexDirection: "row", alignItems: "center", gap: spacing[3] }, flex: { flex: 1 }, planIcon: { width: 38, height: 38, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand[100] }, planName: { ...typography.label, color: colors.ink[900] }, divider: { height: 1, backgroundColor: colors.surface.line }, amount: { flex: 1, fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.ink[900] }, members: { flexDirection: "row", gap: spacing[2], alignItems: "center" } });
