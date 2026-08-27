import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BillingCyclePicker } from "../components/BillingCyclePicker";
import { Badge, Button, Card, TextField } from "../components/ui";
import { PlanMemberPicker } from "../components/PlanMemberPicker";
import { SyncStatusCard } from "../components/SyncStatusCard";
import { useFinance } from "../data/FinanceContext";
import { useMembers } from "../data/MembersContext";
import { formatCurrency } from "../data/members";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PlanDetail">;

export function PlanDetailScreen({ route, navigation }: Props) {
  const { plans, updatePlan, deletePlan, errorMessage, clearError } = useFinance();
  const { members } = useMembers();
  const plan = plans.find((item) => item.id === route.params.planId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: plan?.name ?? "",
    amount: plan ? `${plan.amount}` : "",
    cycle: plan?.billingCycle ?? "1 Month",
    assignedMemberIds: plan?.assignedMemberIds ?? []
  });

  useEffect(() => {
    if (!plan) return;
    setForm({
      name: plan.name,
      amount: `${plan.amount}`,
      cycle: plan.billingCycle,
      assignedMemberIds: plan.assignedMemberIds
    });
  }, [plan]);

  const selectedNames = useMemo(() => members.filter((member) => form.assignedMemberIds.includes(member.id)).map((member) => member.name), [form.assignedMemberIds, members]);
  const dirty = useMemo(() => {
    if (!plan) return false;
    const currentIds = [...form.assignedMemberIds].sort().join("|");
    const originalIds = [...plan.assignedMemberIds].sort().join("|");
    return (
      form.name.trim() !== plan.name ||
      Number(form.amount) !== plan.amount ||
      form.cycle !== plan.billingCycle ||
      currentIds !== originalIds
    );
  }, [form.amount, form.assignedMemberIds, form.cycle, form.name, plan]);

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Plan not found.</Text>
      </View>
    );
  }

  const set = (key: keyof Omit<typeof form, "assignedMemberIds">) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const toggleMember = (memberId: string) =>
    setForm((current) => ({
      ...current,
      assignedMemberIds: current.assignedMemberIds.includes(memberId)
        ? current.assignedMemberIds.filter((currentId) => currentId !== memberId)
        : [...current.assignedMemberIds, memberId]
    }));

  const errors = {
    name: !form.name.trim() ? "Plan name is required" : undefined,
    amount: !(Number(form.amount) > 0) ? "Enter a valid rent amount" : undefined
  };
  const canSave = dirty && !errors.name && !errors.amount;

  const save = async () => {
    if (errors.name || errors.amount) return;
    clearError();
    try {
      setSaving(true);
      await updatePlan(plan.id, {
        name: form.name.trim(),
        amount: Number(form.amount),
        billingCycle: form.cycle,
        assignedMemberIds: form.assignedMemberIds
      });
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't update the plan.";
      Alert.alert("Save failed", message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => setConfirmVisible(true);
  const deleteNow = async () => {
    clearError();
    try {
      setDeleting(true);
      await deletePlan(plan.id);
      setConfirmVisible(false);
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't delete the plan.";
      Alert.alert("Delete failed", message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.summary}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>{plan.name.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.summaryCopy}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryTitleWrap}>
                  <Text style={styles.title}>{plan.name}</Text>
                  <Badge label={plan.active ? "Active" : "Inactive"} tone={plan.active ? "paid" : "neutral"} />
                </View>
                <Text style={styles.amount}>{formatCurrency(plan.amount)}</Text>
              </View>
              <Text style={styles.subtitle}>{plan.billingCycle} billing</Text>
              <Text style={styles.count}>{plan.members} members assigned</Text>
            </View>
          </Card>

          <Card style={styles.form}>
            <Text style={styles.section}>Plan details</Text>
            {errorMessage ? <SyncStatusCard title="Sync problem" message={errorMessage} tone="error" /> : null}
            <TextField label="Plan name" value={form.name} onChangeText={set("name")} placeholder="e.g. Standard Shop" errorText={errors.name} />
            <TextField label="Monthly rent" value={form.amount} onChangeText={set("amount")} keyboardType="numeric" placeholder="₹ 0" errorText={errors.amount} />
          </Card>

          <BillingCyclePicker value={form.cycle} onChange={(value) => setForm((current) => ({ ...current, cycle: value }))} />

          <PlanMemberPicker members={members} selectedIds={form.assignedMemberIds} onToggle={toggleMember} title="Assign members" helperText="Tap members to add or remove them from this plan." />

          {selectedNames.length ? (
            <Card style={styles.summaryNote}>
              <Text style={styles.noteLabel}>Selected members</Text>
              <Text style={styles.noteValue}>{selectedNames.join(", ")}</Text>
            </Card>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerDelete}>
              <Button fullWidth variant="danger" onPress={confirmDelete}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </View>
            <View style={styles.footerSave}>
              <Button fullWidth loading={saving} disabled={!canSave || deleting} onPress={save}>
                Save changes
              </Button>
            </View>
          </View>
        </View>
      </View>

      <Modal transparent visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setConfirmVisible(false)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Do you really want to delete this plan?</Text>
            <Text style={styles.modalText}>This will remove the plan from your pricing list.</Text>
            <View style={styles.modalActions}>
              <View style={styles.modalSecondary}>
                <Button variant="secondary" fullWidth onPress={() => setConfirmVisible(false)}>
                  Cancel
                </Button>
              </View>
              <View style={styles.modalPrimary}>
                <Button variant="danger" fullWidth loading={deleting} onPress={deleteNow}>
                  Delete
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  page: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 132 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { ...typography.body, color: colors.ink[500] },
  summary: { flexDirection: "row", gap: spacing[3], alignItems: "flex-start" },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brand[50],
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing[1]
  },
  iconText: { fontSize: 18, fontWeight: "800", color: colors.brand[700] },
  summaryCopy: { flex: 1, gap: spacing[1] },
  summaryTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  summaryTitleWrap: { flex: 1, gap: spacing[1] },
  title: { ...typography.sectionTitle, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  count: { ...typography.caption, color: colors.ink[500] },
  amount: { fontSize: 24, lineHeight: 30, fontWeight: "800", color: colors.ink[900], textAlign: "right" },
  form: { gap: spacing[4] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  summaryNote: { gap: spacing[1], backgroundColor: colors.brand[50], borderColor: colors.brand[100] },
  noteLabel: { ...typography.caption, color: colors.brand[700] },
  noteValue: { ...typography.body, color: colors.brand[700] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  },
  footerRow: { flexDirection: "row", gap: spacing[2] },
  footerDelete: { flex: 1 },
  footerSave: { flex: 1 },
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
    gap: spacing[3]
  },
  modalTitle: { ...typography.sectionTitle, color: colors.ink[900] },
  modalText: { ...typography.body, color: colors.ink[600] },
  modalActions: { flexDirection: "row", gap: spacing[2] },
  modalSecondary: { flex: 1 },
  modalPrimary: { flex: 1 }
});
