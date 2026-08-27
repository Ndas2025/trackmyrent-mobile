import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Button, DropdownField } from "./ui";
import { colors, spacing, typography } from "../design";

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

type PickerMode = "month" | "year" | null;

export function PeriodPicker({ monthLabel, yearLabel, monthOptions, yearOptions, monthIndex, year, onMonthChange, onYearChange }: Props) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [draftMonth, setDraftMonth] = useState(monthIndex);
  const [draftYear, setDraftYear] = useState(year);

  const openPicker = (mode: Exclude<PickerMode, null>) => {
    setDraftMonth(monthIndex);
    setDraftYear(year);
    setPickerMode(mode);
  };

  const applyPicker = () => {
    if (pickerMode === "month") {
      onMonthChange(draftMonth);
    }
    if (pickerMode === "year") {
      onYearChange(draftYear);
    }
    setPickerMode(null);
  };

  const selectedTitle = useMemo(() => (pickerMode === "month" ? monthOptions[draftMonth] : `${draftYear}`), [draftMonth, draftYear, monthOptions, pickerMode]);

  return (
    <>
      <View style={[styles.row, isCompact && styles.rowCompact]}>
        <DropdownField label="Month" value={monthLabel} onPress={() => openPicker("month")} />
        <DropdownField label="Year" value={yearLabel} onPress={() => openPicker("year")} />
      </View>

      <Modal transparent visible={pickerMode !== null} animationType="fade" onRequestClose={() => setPickerMode(null)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setPickerMode(null)} />
          <View style={styles.card}>
            <Text style={styles.eyebrow}>{pickerMode === "month" ? "Select month" : "Select year"}</Text>
            <Text style={styles.title}>{selectedTitle}</Text>

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
                <Button variant="secondary" fullWidth onPress={() => setPickerMode(null)}>
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
  row: {
    flexDirection: "row",
    gap: spacing[3],
  },
  rowCompact: {
    flexDirection: "column"
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(16, 35, 31, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[4]
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing[4],
    gap: spacing[4]
  },
  eyebrow: { ...typography.caption, color: colors.brand[700], textTransform: "uppercase" },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.ink[900] },
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
