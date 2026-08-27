import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Crown, Sparkles } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../components/ui";
import { useOnboarding, type OnboardingSubscription } from "../data/OnboardingContext";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SubscriptionSelect">;

const plans: { id: OnboardingSubscription; title: string; price: string; helper: string; badge?: string }[] = [
  { id: "Free trial 30 days", title: "Free trial 30 days", price: "Free", helper: "All features unlocked for one month", badge: "Default" },
  { id: "Plus", title: "Plus", price: "₹399", helper: "All features unlocked for one month" },
  { id: "Max", title: "Max", price: "₹699", helper: "All features unlocked for three months" },
  { id: "Max+", title: "Max+", price: "₹999", helper: "All features unlocked for six months", badge: "Popular" }
];

export function SubscriptionSelectionScreen({ navigation }: Props) {
  const { subscription, setSubscription, completeOnboarding } = useOnboarding();
  const selected = subscription;

  const finish = async () => {
    await completeOnboarding();
    navigation.replace("MainTabs");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Crown size={24} color={colors.brand[700]} />
          </View>
          <Text style={styles.eyebrow}>Application subscription</Text>
          <Text style={styles.title}>Choose a plan for your app</Text>
          <Text style={styles.description}>Start with the 30 day free trial and upgrade anytime when you are ready.</Text>
        </View>

        <View style={styles.list}>
          {plans.map((plan) => {
            const active = selected === plan.id;
            return (
              <Pressable key={plan.id} accessibilityRole="button" onPress={() => setSubscription(plan.id)} style={({ pressed }) => [styles.planCardWrap, active && styles.planCardWrapActive, pressed && styles.planPressed]}>
                <Card style={[styles.planCard, active && styles.planCardActive]}>
                  <View style={styles.planTop}>
                    <View style={styles.planIcon}>
                      <Sparkles size={18} color={active ? colors.brand[700] : colors.ink[600]} />
                    </View>
                    <View style={styles.planHeading}>
                      <Text style={styles.planTitle}>{plan.title}</Text>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                    </View>
                    {plan.badge ? (
                      <View style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>{plan.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.planHelper}>{plan.helper}</Text>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth onPress={finish}>
          Continue to dashboard
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
  header: { alignItems: "center", gap: spacing[3] },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[100]
  },
  eyebrow: { ...typography.caption, color: colors.brand[700], textTransform: "uppercase" },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "800", color: colors.ink[900], textAlign: "center" },
  description: { ...typography.body, color: colors.ink[600], textAlign: "center", maxWidth: 300 },
  list: { gap: spacing[3] },
  planCardWrap: {
    borderRadius: radii.md
  },
  planCardWrapActive: {
    shadowColor: colors.brand[500],
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  planPressed: { opacity: 0.92 },
  planCard: {
    gap: spacing[3]
  },
  planCardActive: {
    borderColor: colors.brand[500],
    backgroundColor: colors.brand[50]
  },
  planTop: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.soft,
    borderWidth: 1,
    borderColor: colors.surface.line
  },
  planHeading: { flex: 1, gap: spacing[1] },
  planTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  planPrice: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.ink[900] },
  planBadge: {
    minHeight: 28,
    paddingHorizontal: spacing[3],
    borderRadius: 999,
    backgroundColor: colors.brand[100],
    alignItems: "center",
    justifyContent: "center"
  },
  planBadgeText: { ...typography.caption, color: colors.brand[700], fontWeight: "700" },
  planHelper: { ...typography.body, color: colors.ink[600] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
