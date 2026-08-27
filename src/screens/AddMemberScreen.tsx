import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Sparkles, Trash2 } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, TextField } from "../components/ui";
import { SyncStatusCard } from "../components/SyncStatusCard";
import { useFinance } from "../data/FinanceContext";
import { useMembers } from "../data/MembersContext";
import { useOnboarding, type OnboardingCategory } from "../data/OnboardingContext";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AddMember">;
type CustomField = { id: string; label: string; value: string };

type FormState = {
  name: string;
  phone: string;
  planId: string;
  businessName: string;
  unit: string;
  batch: string;
  roomType: string;
  groupName: string;
  monthlyRent: string;
  dueDay: string;
  customFields: CustomField[];
};

function createInitialForm(category: OnboardingCategory): FormState {
  return {
    name: "",
    phone: "",
    planId: "",
    businessName: "",
    unit: "",
    batch: "",
    roomType: "",
    groupName: "",
    monthlyRent: "",
    dueDay: "5",
    customFields: category === "Others" ? [{ id: `${Date.now()}-field`, label: "", value: "" }] : []
  };
}

export function AddMemberScreen({ navigation }: Props) {
  const { addMember, errorMessage, clearError } = useMembers();
  const { plans } = useFinance();
  const { category } = useOnboarding();
  const activeCategory = category ?? "Building rent";
  const planOptions = useMemo(() => plans.filter((plan) => plan.active), [plans]);
  const hasPlanOptions = activeCategory !== "Others" && planOptions.length > 0;

  const [form, setForm] = useState<FormState>(() => createInitialForm(activeCategory));
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSubmitted(false);
    setForm(createInitialForm(activeCategory));
  }, [activeCategory]);

  const set = (key: keyof FormState) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const selectedPlan = useMemo(
    () => planOptions.find((option) => option.id === form.planId) ?? null,
    [form.planId, planOptions]
  );

  const selectPlan = (plan: (typeof planOptions)[number]) => {
    setForm((current) => ({
      ...current,
      planId: plan.id,
      monthlyRent: String(plan.amount)
    }));
  };

  const updateCustomField = (fieldId: string, key: "label" | "value", value: string) => {
    setForm((current) => ({
      ...current,
      customFields: current.customFields.map((field) => (field.id === fieldId ? { ...field, [key]: value } : field))
    }));
  };

  const addCustomField = () => {
    setForm((current) => ({
      ...current,
      customFields: [...current.customFields, { id: `${Date.now()}-${Math.random()}`, label: "", value: "" }]
    }));
  };

  const removeCustomField = (fieldId: string) => {
    setForm((current) => {
      if (current.customFields.length === 1) return current;
      return { ...current, customFields: current.customFields.filter((field) => field.id !== fieldId) };
    });
  };

  const getErrors = (shouldShow: boolean) => ({
    name: shouldShow && !form.name.trim() ? "Full name is required" : undefined,
    phone: shouldShow && !form.phone.trim() ? "Phone number is required" : undefined,
    businessName: activeCategory === "Building rent" && shouldShow && !form.businessName.trim() ? "Business name is required" : undefined,
    unit: activeCategory === "Building rent" && shouldShow && !form.unit.trim() ? "Unit is required" : undefined,
    batch: (activeCategory === "Gym" || activeCategory === "Tution centre") && shouldShow && !form.batch.trim() ? "Batch is required" : undefined,
    roomType: activeCategory === "Hostal/PG" && shouldShow && !form.roomType.trim() ? "Room type is required" : undefined,
    groupName: activeCategory === "Others" && shouldShow && !form.groupName.trim() ? "Group name is required" : undefined,
    monthlyRent: shouldShow && !(Number(form.monthlyRent) > 0) ? "Enter a valid rent amount" : undefined,
    dueDay: shouldShow && !(Number(form.dueDay) >= 1 && Number(form.dueDay) <= 31) ? "Enter a day from 1 to 31" : undefined,
    customFields:
      activeCategory === "Others" &&
      shouldShow &&
      !form.customFields.some((field) => field.label.trim() && field.value.trim())
        ? "Add at least one custom field"
        : undefined
  });

  const errors = getErrors(submitted);

  const save = async () => {
    const nextErrors = getErrors(true);
    setSubmitted(true);
    if (Object.values(nextErrors).some(Boolean)) return;

    const plan = selectedPlan;
    const customFields = form.customFields.filter((field) => field.label.trim() || field.value.trim()).map((field) => ({
      label: field.label.trim(),
      value: field.value.trim()
    }));
    const summary = customFields.map((field) => `${field.label}: ${field.value}`).join(" · ");
    const businessName =
      activeCategory === "Building rent"
        ? form.businessName.trim()
        : activeCategory === "Others"
          ? form.groupName.trim() || "Custom group"
          : plan?.name ?? activeCategory;
    const unit =
      activeCategory === "Building rent"
        ? form.unit.trim()
        : activeCategory === "Gym"
          ? form.batch.trim()
          : activeCategory === "Tution centre"
            ? form.batch.trim()
            : activeCategory === "Hostal/PG"
              ? form.roomType.trim()
              : summary || "Custom fields";

    clearError();
    try {
      setSaving(true);
      const member = await addMember({
        category: activeCategory,
        name: form.name.trim(),
        business: businessName,
        planName: plan?.name ?? undefined,
        phone: form.phone.trim(),
        unit,
        batch: activeCategory === "Gym" || activeCategory === "Tution centre" ? form.batch.trim() : undefined,
        roomType: activeCategory === "Hostal/PG" ? form.roomType.trim() : undefined,
        groupName: activeCategory === "Others" ? form.groupName.trim() : undefined,
        customFields: activeCategory === "Others" ? customFields : undefined,
        monthlyRent: Number(form.monthlyRent),
        dueDay: Number(form.dueDay),
        billingMonth: new Date().toLocaleDateString("en-US", { month: "long" }),
        billingYear: new Date().getFullYear()
      });

      navigation.replace("MemberDetail", { memberId: member.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't save the member.";
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
            <Text style={styles.section}>Member details</Text>
            {errorMessage ? <SyncStatusCard title="Sync problem" message={errorMessage} tone="error" /> : null}
            <TextField label="Full name" value={form.name} onChangeText={set("name")} placeholder="e.g. Priya Sharma" errorText={errors.name} />
            <TextField label="Phone number" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" placeholder="+91 98765 43210" errorText={errors.phone} />
          </Card>

          {activeCategory === "Others" ? (
            <Card style={styles.form}>
              <View style={styles.sectionRow}>
                <View style={styles.sectionCopy}>
                  <Text style={styles.section}>Create group</Text>
                  <Text style={styles.helper}>Add a custom group and any fields your workflow needs.</Text>
                </View>
              </View>

              <TextField label="Group name" value={form.groupName} onChangeText={set("groupName")} placeholder="e.g. Morning batch" errorText={errors.groupName} />

              <View style={styles.subsectionRow}>
                <Text style={styles.subsection}>Custom fields</Text>
                <Button variant="ghost" size="sm" onPress={addCustomField} style={styles.subsectionButton}>
                  Add field
                </Button>
              </View>

              {form.customFields.map((field, index) => (
                <View key={field.id} style={styles.customField}>
                  <View style={styles.customFieldHeader}>
                    <Text style={styles.customFieldIndex}>Field {index + 1}</Text>
                    <Pressable accessibilityRole="button" onPress={() => removeCustomField(field.id)} style={styles.removeButton}>
                      <Trash2 size={14} color={colors.status.unpaid} />
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </Pressable>
                  </View>
                  <TextField label="Field label" value={field.label} onChangeText={(value) => updateCustomField(field.id, "label", value)} placeholder="e.g. Package" />
                  <TextField label="Field value" value={field.value} onChangeText={(value) => updateCustomField(field.id, "value", value)} placeholder="e.g. Weekend" />
                </View>
              ))}
              {errors.customFields ? <Text style={styles.inlineError}>{errors.customFields}</Text> : null}

              <TextField
                label="Monthly rent"
                value={form.monthlyRent}
                onChangeText={set("monthlyRent")}
                keyboardType="numeric"
                placeholder="₹ 0"
                helperText="Enter the monthly amount for this custom group."
                errorText={errors.monthlyRent}
              />
              <TextField
                label="Payment due day"
                value={form.dueDay}
                onChangeText={set("dueDay")}
                keyboardType="number-pad"
                helperText="Day of each month, from 1 to 31"
                errorText={errors.dueDay}
              />
            </Card>
          ) : (
            <Card style={styles.form}>
              <View style={styles.sectionRow}>
                <View style={styles.sectionCopy}>
                  <Text style={styles.section}>
                    {activeCategory === "Building rent" ? "Rental details" : activeCategory === "Gym" ? "Workout details" : activeCategory === "Hostal/PG" ? "Hostel details" : "Class details"}
                  </Text>
                  {hasPlanOptions ? (
                    <Text style={styles.helper}>
                      {activeCategory === "Building rent"
                        ? "Pick a saved plan, then fill the shop details."
                        : activeCategory === "Gym"
                          ? "Pick a saved plan and the training batch."
                          : activeCategory === "Hostal/PG"
                            ? "Pick a saved plan and room type."
                            : "Pick a saved plan and the batch."}
                    </Text>
                  ) : null}
                </View>
              </View>

              {hasPlanOptions ? (
                <View style={styles.planGrid}>
                  {planOptions.map((plan) => {
                    const active = plan.id === form.planId;
                    return (
                      <Pressable
                        key={plan.id}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        onPress={() => selectPlan(plan)}
                        style={({ pressed }) => [styles.planCard, active && styles.planCardActive, pressed && styles.planPressed]}
                      >
                        <View style={styles.planTop}>
                          <View style={[styles.planIcon, active && styles.planIconActive]}>
                            <Sparkles size={16} color={active ? colors.brand[700] : colors.ink[500]} />
                          </View>
                          <View style={styles.planCopy}>
                            <Text style={styles.planTitle}>{plan.name}</Text>
                            <Text style={styles.planHelper}>{plan.billingCycle} billing</Text>
                          </View>
                        </View>
                        <View style={styles.planBottom}>
                          <Text style={styles.planPrice}>₹{plan.amount.toLocaleString("en-IN")}</Text>
                          <Text style={styles.planMeta}>{active ? "Selected" : "Tap to select"}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {activeCategory === "Building rent" ? (
                <>
                  <TextField label="Unit / shop" value={form.unit} onChangeText={set("unit")} placeholder="e.g. Shop 12" errorText={errors.unit} />
                  <TextField label="Business name" value={form.businessName} onChangeText={set("businessName")} placeholder="e.g. Priya Stores" errorText={errors.businessName} />
                </>
              ) : activeCategory === "Gym" ? (
                <TextField label="Batch" value={form.batch} onChangeText={set("batch")} placeholder="Morning / Evening" errorText={errors.batch} />
              ) : activeCategory === "Tution centre" ? (
                <TextField label="Batch" value={form.batch} onChangeText={set("batch")} placeholder="10th / 11th / Entrance" errorText={errors.batch} />
              ) : (
                <TextField label="Room type" value={form.roomType} onChangeText={set("roomType")} placeholder="Single / Double / 3 Sharing" errorText={errors.roomType} />
              )}

              <TextField
                label="Monthly rent"
                value={form.monthlyRent}
                onChangeText={set("monthlyRent")}
                keyboardType="numeric"
                placeholder="₹ 0"
                helperText={selectedPlan ? `Auto-filled from ${selectedPlan.name}. You can edit it.` : "Enter the monthly amount for this member."}
                errorText={errors.monthlyRent}
              />
              <TextField
                label="Payment due day"
                value={form.dueDay}
                onChangeText={set("dueDay")}
                keyboardType="number-pad"
                helperText="Day of each month, from 1 to 31"
                errorText={errors.dueDay}
              />
            </Card>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button fullWidth loading={saving} onPress={save}>
            Save member
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  page: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[4] },
  form: { gap: spacing[4] },
  sectionRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  sectionCopy: { flex: 1, gap: spacing[1] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  helper: { ...typography.caption, color: colors.ink[500] },
  subsectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  subsection: { ...typography.label, color: colors.ink[700] },
  subsectionButton: { minHeight: 36, paddingHorizontal: spacing[3] },
  planGrid: { gap: spacing[2] },
  planCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    padding: spacing[3],
    gap: spacing[3]
  },
  planCardActive: {
    borderColor: colors.brand[500],
    backgroundColor: colors.brand[50]
  },
  planPressed: { opacity: 0.9 },
  planTop: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  planIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.soft,
    borderWidth: 1,
    borderColor: colors.surface.line
  },
  planIconActive: {
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[100]
  },
  planCopy: { flex: 1, gap: spacing[1] },
  planTitle: { ...typography.label, color: colors.ink[900] },
  planHelper: { ...typography.caption, color: colors.ink[500] },
  planBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  planPrice: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  planMeta: { ...typography.caption, color: colors.ink[500] },
  customField: {
    gap: spacing[3],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.surface.soft,
    padding: spacing[3]
  },
  customFieldHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  customFieldIndex: { ...typography.caption, color: colors.ink[500], fontWeight: "700" },
  removeButton: { flexDirection: "row", alignItems: "center", gap: spacing[1] },
  removeButtonText: { ...typography.caption, color: colors.status.unpaid, fontWeight: "700" },
  inlineError: { ...typography.caption, color: colors.status.unpaid },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
