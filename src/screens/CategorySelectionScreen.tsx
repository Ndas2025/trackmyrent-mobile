import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Building2, Dumbbell, GraduationCap, Home, MoreHorizontal } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../components/ui";
import { useOnboarding, type OnboardingCategory } from "../data/OnboardingContext";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "CategorySelect">;

const categories: { id: OnboardingCategory; label: string; icon: typeof Dumbbell; helper: string }[] = [
  { id: "Gym", label: "Gym", icon: Dumbbell, helper: "Fitness and training" },
  { id: "Tution centre", label: "Tution centre", icon: GraduationCap, helper: "Coaching and classes" },
  { id: "Building rent", label: "Building rent", icon: Building2, helper: "Multiple shops or units" },
  { id: "Hostal/PG", label: "Hostal/PG", icon: Home, helper: "Hostels and paying guest" },
  { id: "Others", label: "Others", icon: MoreHorizontal, helper: "Any other business type" }
];

export function CategorySelectionScreen({ navigation }: Props) {
  const { category, setCategory } = useOnboarding();
  const selected = category ?? null;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Business setup</Text>
          <Text style={styles.title}>Choose your category</Text>
          <Text style={styles.description}>Pick one category so we can shape the app experience around your business.</Text>
        </View>

        <View style={styles.grid}>
          {categories.map((item) => {
            const Icon = item.icon;
            const active = selected === item.id;
            return (
              <Pressable key={item.id} accessibilityRole="button" onPress={() => setCategory(item.id)} style={({ pressed }) => [styles.choice, active && styles.choiceActive, pressed && styles.choicePressed]}>
                <View style={styles.choiceTop}>
                  <View style={[styles.choiceIcon, active && styles.choiceIconActive]}>
                    <Icon size={20} color={active ? colors.brand[700] : colors.ink[600]} />
                  </View>
                  <View style={styles.choiceBadge}>
                    <Text style={[styles.choiceBadgeText, active && styles.choiceBadgeTextActive]}>{active ? "Selected" : "Tap to select"}</Text>
                  </View>
                </View>
                <Text style={styles.choiceTitle}>{item.label}</Text>
                <Text style={styles.choiceHelper}>{item.helper}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth disabled={!selected} onPress={() => navigation.replace("SubscriptionSelect")}>
          Next
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    paddingBottom: spacing[6],
    gap: spacing[5]
  },
  header: { gap: spacing[2] },
  eyebrow: { ...typography.caption, color: colors.brand[700], textTransform: "uppercase" },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "800", color: colors.ink[900] },
  description: { ...typography.body, color: colors.ink[600] },
  grid: { gap: spacing[3] },
  choice: {
    padding: spacing[4],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    gap: spacing[2]
  },
  choiceActive: {
    borderColor: colors.brand[500],
    backgroundColor: colors.brand[50]
  },
  choicePressed: { opacity: 0.9 },
  choiceTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3] },
  choiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.soft,
    borderWidth: 1,
    borderColor: colors.surface.line
  },
  choiceIconActive: {
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[100]
  },
  choiceBadge: {
    minHeight: 28,
    paddingHorizontal: spacing[3],
    borderRadius: 999,
    backgroundColor: colors.surface.soft,
    alignItems: "center",
    justifyContent: "center"
  },
  choiceBadgeText: { ...typography.caption, color: colors.ink[500] },
  choiceBadgeTextActive: { color: colors.brand[700], fontWeight: "700" },
  choiceTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  choiceHelper: { ...typography.body, color: colors.ink[600] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
