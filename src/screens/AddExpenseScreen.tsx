import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, useWindowDimensions } from "react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, TextField } from "../components/ui";
import { SyncStatusCard } from "../components/SyncStatusCard";
import { useFinance, type Expense } from "../data/FinanceContext";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;
type ExpenseRecurrence = Expense["recurrence"];

const recurrenceOptions: ExpenseRecurrence[] = ["Monthly", "This month"];

export function AddExpenseScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const { addExpense, errorMessage, clearError } = useFinance();
  const [form, setForm] = useState<{ title: string; category: string; amount: string; recurrence: ExpenseRecurrence }>({
    title: "",
    category: "",
    amount: "",
    recurrence: "This month"
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Omit<typeof form, "recurrence">) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const errors = {
    title: submitted && !form.title.trim() ? "Description is required" : undefined,
    category: submitted && !form.category.trim() ? "Category is required" : undefined,
    amount: submitted && !(Number(form.amount) > 0) ? "Enter a valid amount" : undefined
  };

  const save = async () => {
    setSubmitted(true);
    if (errors.title || errors.category || errors.amount) return;
    clearError();
    try {
      setSaving(true);
      await addExpense({
        title: form.title.trim(),
        category: form.category.trim(),
        amount: Number(form.amount),
        recurrence: form.recurrence
      });
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't save the expense.";
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
            <Text style={styles.section}>New expense</Text>
            {errorMessage ? <SyncStatusCard title="Sync problem" message={errorMessage} tone="error" /> : null}
            <TextField label="Description" value={form.title} onChangeText={set("title")} placeholder="e.g. Lift maintenance" errorText={errors.title} />
            <TextField label="Category" value={form.category} onChangeText={set("category")} placeholder="e.g. Maintenance" errorText={errors.category} />
            <View style={styles.segmentBlock}>
              <Text style={styles.segmentLabel}>Recurrence</Text>
              <View style={[styles.segmentRow, isCompact && styles.segmentRowCompact]}>
                {recurrenceOptions.map((option) => {
                  const active = option === form.recurrence;
                  return (
                    <Button
                      key={option}
                      variant={active ? "secondary" : "ghost"}
                      onPress={() => setForm((current) => ({ ...current, recurrence: option }))}
                      style={[styles.segmentButton, active && styles.segmentButtonActive]}
                    >
                      {option}
                    </Button>
                  );
                })}
              </View>
            </View>
            <TextField label="Amount" value={form.amount} onChangeText={set("amount")} keyboardType="numeric" placeholder="₹ 0" errorText={errors.amount} />
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button fullWidth loading={saving} onPress={save}>
            Save expense
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
  segmentBlock: { gap: spacing[2] },
  segmentLabel: { ...typography.caption, color: colors.ink[500], textTransform: "uppercase" },
  segmentRow: { flexDirection: "row", gap: spacing[2] },
  segmentRowCompact: { flexDirection: "column" },
  segmentButton: { flex: 1, minHeight: 44 },
  segmentButtonActive: { borderColor: colors.brand[100] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
