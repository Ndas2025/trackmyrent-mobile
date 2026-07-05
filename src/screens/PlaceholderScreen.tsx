import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../design";

type PlaceholderScreenProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PlaceholderScreen({ title, description, icon: Icon }: PlaceholderScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.iconWrap}>
        <Icon color={colors.brand[700]} size={28} strokeWidth={2} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.app,
    padding: spacing[6]
  },
  iconWrap: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    backgroundColor: colors.brand[100],
    marginBottom: spacing[4]
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink[900],
    marginBottom: spacing[2]
  },
  description: {
    ...typography.body,
    color: colors.ink[600],
    maxWidth: 320,
    textAlign: "center"
  }
});
