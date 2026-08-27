import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "./ui";
import { colors, radii, spacing, typography } from "../design";
import type { PlanBillingCycle } from "../data/FinanceContext";

export const billingCycleOptions: PlanBillingCycle[] = ["1 Month", "3 Months", "6 Months", "1 Year"];

type Props = {
  value: PlanBillingCycle;
  onChange: (value: PlanBillingCycle) => void;
  title?: string;
  helperText?: string;
};

export function BillingCyclePicker({ value, onChange, title = "Billing cycle", helperText = "Choose a subscription period for this plan." }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.section}>{title}</Text>
      <Text style={styles.helper}>{helperText}</Text>
      <View style={styles.grid}>
        {billingCycleOptions.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={option}
              accessibilityState={{ selected }}
              onPress={() => onChange(option)}
              style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.optionPressed]}
            >
              <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected ? <Check size={14} color={colors.brand[700]} strokeWidth={3} /> : null}
              </View>
              <Text style={[styles.label, selected && styles.labelSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing[2] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  helper: { ...typography.caption, color: colors.ink[500] },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2] },
  option: {
    width: "48%",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.surface.line,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3]
  },
  optionSelected: {
    borderColor: colors.brand[100],
    backgroundColor: colors.brand[50]
  },
  optionPressed: { opacity: 0.88 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.ink[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  checkboxSelected: {
    borderColor: colors.brand[500],
    backgroundColor: colors.brand[100]
  },
  label: { ...typography.label, color: colors.ink[700] },
  labelSelected: { color: colors.brand[700] }
});
