import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Card } from "./ui";
import { colors, radii, spacing, typography } from "../design";
import type { Member } from "../data/members";

type Props = {
  members: Member[];
  selectedIds: string[];
  onToggle: (memberId: string) => void;
  title?: string;
  helperText?: string;
  style?: ViewStyle;
};

export function PlanMemberPicker({ members, selectedIds, onToggle, title = "Assign members", helperText = "Optional. Tap members to include them on this plan.", style }: Props) {
  return (
    <Card style={style}>
      <Text style={styles.section}>{title}</Text>
      <Text style={styles.helper}>{helperText}</Text>
      <View style={styles.chips}>
        {members.map((member) => {
          const selected = selectedIds.includes(member.id);
          return (
            <Pressable
              key={member.id}
              accessibilityRole="button"
              accessibilityLabel={`Assign ${member.name}`}
              onPress={() => onToggle(member.id)}
              style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.chipPressed]}
            >
              <View style={[styles.dot, selected && styles.dotSelected]}>
                {selected ? <Check size={13} color={colors.brand[700]} strokeWidth={3} /> : <Text style={[styles.dotLabel, selected && styles.dotLabelSelected]}>{member.name.slice(0, 1)}</Text>}
              </View>
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]} numberOfLines={1}>
                {member.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.count}>{selectedIds.length} selected</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  helper: { ...typography.caption, color: colors.ink[500], marginTop: spacing[1] },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2], marginTop: spacing[3] },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3]
  },
  chipSelected: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[100]
  },
  chipPressed: { opacity: 0.82 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface.app,
    alignItems: "center",
    justifyContent: "center"
  },
  dotSelected: { backgroundColor: colors.brand[100] },
  dotLabel: { ...typography.caption, color: colors.ink[500], fontWeight: "700" },
  dotLabelSelected: { color: colors.brand[700] },
  chipLabel: { ...typography.caption, color: colors.ink[700], fontWeight: "700", maxWidth: 120 },
  chipLabelSelected: { color: colors.brand[700] },
  count: { ...typography.caption, color: colors.ink[500], marginTop: spacing[3] }
});
