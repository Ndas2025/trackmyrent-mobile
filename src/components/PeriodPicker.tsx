import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Button } from "./ui";
import { colors, radii, spacing, typography } from "../design";

type Props = {
  monthLabel: string;
  yearLabel: string;
  monthOptions: string[];
  yearOptions: number[];
  monthIndex: number;
  year: number;
  onMonthChange: (monthIndex: number) => void;
  onYearChange: (year: number) => void;
};

type PickerMode = "month" | "year";

export function PeriodPicker({ monthLabel, yearLabel, monthOptions, yearOptions, monthIndex, year, onMonthChange, onYearChange }: Props) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const [visible, setVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>("month");
  const [draftMonth, setDraftMonth] = useState(monthIndex);
  const [draftYear, setDraftYear] = useState(year);

  const openPicker = () => {
    setDraftMonth(monthIndex);
    setDraftYear(year);
    setPickerMode("month");
    setVisible(true);
  };

  const applyPicker = () => {
    onMonthChange(draftMonth);
    onYearChange(draftYear);
    setVisible(false);
  };

  const selectedTitle = useMemo(() => `${monthOptions[draftMonth]} ${draftYear}`, [draftMonth, draftYear, monthOptions]);

      return (
    <>
      <Pressable accessibilityRole="button" onPress={openPicker} style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}>
        <View style={styles.triggerCopy}>
          <Text style={styles.triggerLabel}>Month and year</Text>
          <Text style={styles.triggerValue}>
            {monthLabel} {yearLabel}
          </Text>
        </View>
        <ChevronDown color={colors.ink[500]} size={20} />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <View style={styles.card}>
            <Text style={styles.eyebrow}>Select date</Text>
            <Text style={styles.title}>{selectedTitle}</Text>
            <Text style={styles.supporting}>Choose the month and year you want to review.</Text>

            <View style={[styles.inputRow, isCompact && styles.inputRowCompact]}>
              <Pressable accessibilityRole="button" onPress={() => setPickerMode("month")} style={({ pressed }) => [styles.inputField, pickerMode === "month" && styles.inputFieldActive, pressed && styles.inputFieldPressed]}>
                <Text style={[styles.inputLabel, pickerMode === "month" && styles.inputLabelActive]}>Month</Text>
                <Text style={styles.inputValue}>{monthOptions[draftMonth]}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => setPickerMode("year")} style={({ pressed }) => [styles.inputField, pickerMode === "year" && styles.inputFieldActive, pressed && styles.inputFieldPressed]}>
                <Text style={[styles.inputLabel, pickerMode === "year" && styles.inputLabelActive]}>Year</Text>
                <Text style={styles.inputValue}>{draftYear}</Text>
              </Pressable>
            </View>

            {pickerMode === "month" ? (
              <View style={styles.grid}>
                {monthOptions.map((month, index) => {
                  const active = index === draftMonth;
                  return (
                    <Pressable
                      key={month}
                      accessibilityRole="button"
                      onPress={() => setDraftMonth(index)}
                      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.chipPressed]}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{month.slice(0, 3)}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={[styles.yearRow, isCompact && styles.yearRowCompact]}>
                {yearOptions.map((option) => {
                  const active = option === draftYear;
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      onPress={() => setDraftYear(option)}
                      style={({ pressed }) => [styles.yearChip, active && styles.chipActive, pressed && styles.chipPressed]}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <View style={[styles.actions, isCompact && styles.actionsCompact]}>
              <View style={[styles.flex, isCompact && styles.fullWidth]}>
                <Button variant="secondary" fullWidth onPress={() => setVisible(false)}>
                  Cancel
                </Button>
              </View>
              <View style={[styles.flex, isCompact && styles.fullWidth]}>
                <Button fullWidth onPress={applyPicker}>
                  Apply
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[2]
  },
  triggerPressed: { backgroundColor: colors.surface.soft },
  triggerCopy: { flex: 1, minWidth: 0, gap: spacing[1] },
  triggerLabel: { ...typography.caption, color: colors.ink[500] },
  triggerValue: { fontSize: 16, lineHeight: 22, fontWeight: "500", color: colors.ink[900] },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(16, 35, 31, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[4]
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: spacing[4],
    gap: spacing[4]
  },
  eyebrow: { ...typography.caption, color: colors.brand[700], textTransform: "uppercase" },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "500", color: colors.ink[900] },
  supporting: { ...typography.body, color: colors.ink[600] },
  inputRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  inputRowCompact: {
    flexDirection: "column"
  },
  inputField: {
    flex: 1,
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surface.line,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    justifyContent: "center",
    gap: spacing[1]
  },
  inputFieldActive: {
    borderColor: colors.brand[600],
    borderWidth: 2
  },
  inputFieldPressed: { backgroundColor: colors.surface.soft },
  inputLabel: { ...typography.caption, color: colors.ink[500] },
  inputLabelActive: { color: colors.brand[700] },
  inputValue: { fontSize: 16, lineHeight: 22, fontWeight: "500", color: colors.ink[900] },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2] },
  yearRow: { flexDirection: "row", gap: spacing[2] },
  yearRowCompact: { flexWrap: "wrap" },
  chip: {
    width: "31.5%",
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  yearChip: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  chipActive: { backgroundColor: colors.brand[100], borderColor: colors.brand[500] },
  chipPressed: { opacity: 0.86 },
  chipText: { ...typography.label, color: colors.ink[600] },
  chipTextActive: { color: colors.ink[900], fontWeight: "800" },
  actions: { flexDirection: "row", gap: spacing[2] },
  actionsCompact: { flexDirection: "column" },
  flex: { flex: 1 },
  fullWidth: { flexBasis: "100%" }
});
