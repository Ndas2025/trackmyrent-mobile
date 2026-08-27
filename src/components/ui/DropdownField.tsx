import { ChevronDown } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../../design";

type DropdownFieldProps = {
  label: string;
  value: string;
  onPress: () => void;
};

export function DropdownField({ label, value, onPress }: DropdownFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.field, pressed && styles.pressed]}>
        <Text style={styles.value}>{value}</Text>
        <ChevronDown color={colors.ink[500]} size={18} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing[2] },
  label: { ...typography.caption, color: colors.ink[600], textTransform: "none" },
  field: {
    minHeight: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  pressed: { backgroundColor: colors.surface.soft },
  value: { fontSize: 15, lineHeight: 20, fontWeight: "400", color: colors.ink[900] }
});
