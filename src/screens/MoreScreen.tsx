import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight, CircleDollarSign, LayoutDashboard, WalletCards } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/ui";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

const menuItems = [
  { label: "Dashboard", screen: "Dashboard" as const, icon: LayoutDashboard },
  { label: "Plan", screen: "Plan" as const, icon: WalletCards },
  { label: "Expense", screen: "Expense" as const, icon: CircleDollarSign },
  { label: "Report", screen: "Report" as const, icon: LayoutDashboard }
];

export function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.screen}>
      <Card style={styles.hero}>
        <Text style={styles.eyebrow}>TOOLS</Text>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Open the supporting workflows that keep the rent tracker running smoothly.</Text>
      </Card>

      <View style={styles.list}>
        {menuItems.map(({ label, screen, icon: Icon }, index) => (
          <Pressable
            accessibilityRole="button"
            key={label}
            onPress={() => navigation.navigate("MainTabs", { screen })}
            style={({ pressed }) => [
              styles.row,
              index < menuItems.length - 1 && styles.divider,
              pressed && styles.pressed
            ]}
          >
            <View style={styles.iconWrap}>
              <Icon color={colors.brand[700]} size={21} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.detail}>Open {label.toLowerCase()}</Text>
            </View>
            <ChevronRight color={colors.ink[300]} size={20} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app, padding: spacing[4], gap: spacing[4] },
  hero: { gap: spacing[2] },
  eyebrow: { ...typography.caption, color: colors.brand[700] },
  title: { ...typography.title, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  list: { backgroundColor: colors.white, borderColor: colors.surface.line, borderWidth: 1, borderRadius: radii.md, overflow: "hidden" },
  row: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: spacing[3], paddingHorizontal: spacing[4] },
  divider: { borderBottomColor: colors.surface.line, borderBottomWidth: 1 },
  iconWrap: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: radii.md, backgroundColor: colors.brand[50] },
  rowText: { flex: 1, gap: 2 },
  label: { ...typography.body, color: colors.ink[800], fontWeight: "600" },
  detail: { ...typography.caption, color: colors.ink[500] },
  pressed: { backgroundColor: colors.surface.soft }
});
