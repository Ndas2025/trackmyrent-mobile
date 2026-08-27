import { Sparkles } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/ui";
import { colors, radii, spacing, typography } from "../design";

const subscriptionPlans = [
  { id: "trial", name: "Test RentalBuddy", price: "Free", duration: "30 days trail version", features: "All features unlocked for one month" },
  { id: "m1", name: "Plus", price: "₹399", duration: "1 month", features: "All features unlocked for one month" },
  { id: "m3", name: "Max", price: "₹699", duration: "3 months", features: "All features unlocked for one month" },
  { id: "m6", name: "Max +", price: "₹999", duration: "6 months", features: "All features unlocked for one month" }
] as const;

export function PremiumScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} style={[styles.planCard, plan.id === "trial" && styles.currentPlanCard]}>
              <View style={styles.planRow}>
                <View style={styles.planIcon}>
                  <Sparkles size={18} color={colors.brand[700]} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planCopy}>{plan.duration}</Text>
                </View>
                {plan.id === "trial" ? <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View> : null}
              </View>
              <View style={styles.divider} />
              <Text style={styles.planAmount}>{plan.price}</Text>
              <Text style={styles.muted}>{plan.features}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  planName: { ...typography.label, color: colors.ink[900] },
  planCopy: { ...typography.caption, color: colors.ink[500] },
  planAmount: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.ink[900] },
  muted: { ...typography.caption, color: colors.ink[500] },
  list: { gap: spacing[3] },
  planCard: { gap: spacing[3] },
  currentPlanCard: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[600],
    shadowOpacity: 0.08
  },
  planRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  currentBadge: {
    minHeight: 28,
    paddingHorizontal: spacing[3],
    borderRadius: 999,
    backgroundColor: colors.brand[100],
    alignItems: "center",
    justifyContent: "center"
  },
  currentBadgeText: { ...typography.caption, color: colors.brand[700], fontWeight: "700" },
  planIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[100]
  },
  flex: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.surface.line }
});
