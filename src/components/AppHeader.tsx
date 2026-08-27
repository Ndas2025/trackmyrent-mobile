import { CircleUserRound, Building2, Crown } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../design";

type AppHeaderProps = {
  onProfilePress: () => void;
  onPremiumPress: () => void;
};

export function AppHeader({ onProfilePress, onPremiumPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandGroup}>
        <View style={styles.logoBox}>
          <Building2 color={colors.brand[600]} size={24} />
        </View>
        <Text style={styles.brandName}>RentTrack</Text>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="Premium" onPress={onPremiumPress} style={styles.premiumButton}>
          <Crown color={colors.brand[700]} size={20} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Profile" onPress={onProfilePress} style={styles.profileButton}>
          <CircleUserRound color={colors.brand[700]} size={22} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.line
  },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: spacing[3], flex: 1, minWidth: 0 },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.brand[50],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.brand[100]
  },
  brandName: { fontSize: 20, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  premiumButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.soft,
    borderWidth: 1,
    borderColor: colors.surface.line
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.soft,
    borderWidth: 1,
    borderColor: colors.surface.line
  }
});
