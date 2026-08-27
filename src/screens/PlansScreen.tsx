import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronRight, Plus, Users } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { Badge, Button, Card } from "../components/ui";
import { useFinance } from "../data/FinanceContext";
import { formatCurrency } from "../data/members";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

export function PlansScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { plans } = useFinance();
  const hasPlans = plans.length > 0;

  return (
    <View style={styles.screen}>
      <AppHeader onPremiumPress={() => navigation.navigate("Premium")} onProfilePress={() => navigation.navigate("Profile")} />
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, !hasPlans && styles.emptyContent]}>
        {hasPlans ? (
          <View style={styles.toolbar}>
            <Text style={styles.title}>Plans</Text>
            <Button size="sm" onPress={() => navigation.navigate("AddPlan")}>
              Add new plan
            </Button>
          </View>
        ) : null}

        {hasPlans ? (
          <View style={styles.list}>
            {plans.map((plan) => (
              <Pressable key={plan.id} accessibilityRole="button" onPress={() => navigation.navigate("PlanDetail", { planId: plan.id })} style={({ pressed }) => [pressed && styles.planPressed]}>
                <Card style={styles.plan}>
                  <View style={styles.row}>
                    <View style={styles.planIcon}>
                      <Plus size={19} color={colors.brand[700]} />
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.muted}>{plan.billingCycle} billing</Text>
                    </View>
                    <Badge label={plan.active ? "Active" : "Inactive"} tone={plan.active ? "paid" : "neutral"} />
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Text style={styles.amount}>{formatCurrency(plan.amount)}</Text>
                    <View style={styles.members}>
                      <Users size={16} color={colors.ink[500]} />
                      <Text style={styles.muted}>{plan.members} members</Text>
                    </View>
                    <View style={styles.arrow}>
                      <ChevronRight size={18} color={colors.ink[500]} />
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        ) : (
          <Card style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Plus size={22} color={colors.brand[700]} />
            </View>
            <Text style={styles.emptyTitle}>Create plans</Text>
            <Text style={styles.emptyBody}>
              Add your first plan to organize rent amounts, reuse billing setups, and assign members faster.
            </Text>
            <Button size="sm" onPress={() => navigation.navigate("AddPlan")} style={styles.emptyButton}>
              Add new plan
            </Button>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  emptyContent: { flexGrow: 1, justifyContent: "center" },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3] },
  title: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  list: { gap: spacing[3] },
  planPressed: { opacity: 0.85 },
  plan: { gap: spacing[4] },
  emptyState: {
    alignItems: "flex-start",
    gap: spacing[3],
    paddingVertical: spacing[6],
    minHeight: 280,
    justifyContent: "center"
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand[100]
  },
  emptyTitle: { fontSize: 24, lineHeight: 30, fontWeight: "800", color: colors.ink[900] },
  emptyBody: { ...typography.body, color: colors.ink[600], maxWidth: 320 },
  emptyButton: { marginTop: spacing[1] },
  row: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  flex: { flex: 1 },
  planIcon: { width: 38, height: 38, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand[100], borderRadius: radii.md },
  planName: { ...typography.label, color: colors.ink[900] },
  divider: { height: 1, backgroundColor: colors.surface.line },
  amount: { flex: 1, fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.ink[900] },
  members: { flexDirection: "row", gap: spacing[2], alignItems: "center" },
  muted: { ...typography.caption, color: colors.ink[500] },
  arrow: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.surface.line, backgroundColor: colors.white }
});
