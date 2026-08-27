import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { BillingCyclePicker } from "../components/BillingCyclePicker";
import { Button, Card, TextField } from "../components/ui";
import { PlanMemberPicker } from "../components/PlanMemberPicker";
import { SyncStatusCard } from "../components/SyncStatusCard";
import { useFinance, type PlanBillingCycle } from "../data/FinanceContext";
import { useMembers } from "../data/MembersContext";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AddPlan">;

export function AddPlanScreen({ navigation }: Props) {
  const { addPlan, errorMessage, clearError } = useFinance();
  const { members } = useMembers();
  const [form, setForm] = useState<{ name: string; amount: string; cycle: PlanBillingCycle; assignedMemberIds: string[] }>({
    name: "",
    amount: "",
    cycle: "1 Month",
    assignedMemberIds: []
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedMembers = useMemo(() => members.filter((member) => form.assignedMemberIds.includes(member.id)), [form.assignedMemberIds, members]);

  const set = (key: keyof Omit<typeof form, "assignedMemberIds">) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const toggleMember = (memberId: string) =>
    setForm((current) => ({
      ...current,
      assignedMemberIds: current.assignedMemberIds.includes(memberId)
        ? current.assignedMemberIds.filter((currentId) => currentId !== memberId)
        : [...current.assignedMemberIds, memberId]
    }));

  const errors = {
    name: submitted && !form.name.trim() ? "Plan name is required" : undefined,
    amount: submitted && !(Number(form.amount) > 0) ? "Enter a valid rent amount" : undefined
  };

  const save = async () => {
    setSubmitted(true);
    if (errors.name || errors.amount) return;
    clearError();
    try {
      setSaving(true);
      const created = await addPlan({
        name: form.name.trim(),
        amount: Number(form.amount),
        billingCycle: form.cycle,
        assignedMemberIds: form.assignedMemberIds
      });
      navigation.replace("PlanDetail", { planId: created.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't save the plan.";
      Alert.alert("Save failed", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.form}>
            <Text style={styles.section}>Plan details</Text>
            {errorMessage ? <SyncStatusCard title="Sync problem" message={errorMessage} tone="error" /> : null}
            <TextField
              label="Plan name"
              value={form.name}
              onChangeText={set("name")}
              placeholder="Enter plan name"
              errorText={errors.name}
            />
            <TextField
              label="Monthly rent"
              value={form.amount}
              onChangeText={set("amount")}
              keyboardType="numeric"
              placeholder="₹ 0"
              errorText={errors.amount}
            />
          </Card>

          <BillingCyclePicker value={form.cycle} onChange={(value) => setForm((current) => ({ ...current, cycle: value }))} />

          <PlanMemberPicker
            members={members}
            selectedIds={form.assignedMemberIds}
            onToggle={toggleMember}
            title="Assign members"
            helperText="Optional. Tap members you want on this billing plan."
          />

          {selectedMembers.length ? (
            <Card style={styles.summary}>
              <Text style={styles.summaryLabel}>Selected members</Text>
              <Text style={styles.summaryValue}>{selectedMembers.map((member) => member.name).join(", ")}</Text>
            </Card>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Button fullWidth loading={saving} onPress={save}>
            Save plan
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  page: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 132 },
  form: { gap: spacing[4] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  summary: { gap: spacing[1], backgroundColor: colors.brand[50], borderColor: colors.brand[100] },
  summaryLabel: { ...typography.caption, color: colors.brand[700] },
  summaryValue: { ...typography.body, color: colors.brand[700] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
