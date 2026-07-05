import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight, CircleDollarSign, Palette, Settings, WalletCards } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

const menuItems = [
  { label: "Plans", route: "Plans" as const, icon: WalletCards },
  { label: "Expenses", route: "Expenses" as const, icon: CircleDollarSign },
  { label: "Settings", route: "Settings" as const, icon: Settings },
  { label: "Design system", route: "DesignSystem" as const, icon: Palette }
];

export function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Manage</Text>
      <View style={styles.list}>
        {menuItems.map(({ label, route, icon: Icon }, index) => (
          <Pressable
            accessibilityRole="button"
            key={route}
            onPress={() => navigation.navigate(route)}
            style={({ pressed }) => [
              styles.row,
              index < menuItems.length - 1 && styles.divider,
              pressed && styles.pressed
            ]}
          >
            <Icon color={colors.brand[700]} size={21} />
            <Text style={styles.label}>{label}</Text>
            <ChevronRight color={colors.ink[300]} size={20} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app, padding: spacing[4] },
  heading: { ...typography.label, color: colors.ink[500], marginBottom: spacing[3] },
  list: { backgroundColor: colors.white, borderColor: colors.surface.line, borderWidth: 1 },
  row: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: spacing[3], paddingHorizontal: spacing[4] },
  divider: { borderBottomColor: colors.surface.line, borderBottomWidth: 1 },
  label: { ...typography.body, color: colors.ink[800], flex: 1, fontWeight: "600" },
  pressed: { backgroundColor: colors.surface.soft }
});
