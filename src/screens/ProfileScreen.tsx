import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/ui";
import { colors, spacing, typography } from "../design";

export function ProfileScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.eyebrow}>PROFILE</Text>
        <Text style={styles.title}>Business owner</Text>
        <Text style={styles.subtitle}>This is where the account and business details will live.</Text>
      </Card>
      <Card>
        <Text style={styles.section}>Contact</Text>
        <Text style={styles.body}>Add owner name, phone, and support contact details here.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  eyebrow: { ...typography.caption, color: colors.brand[700] },
  title: { ...typography.title, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  section: { ...typography.sectionTitle, color: colors.ink[900], marginBottom: spacing[2] },
  body: { ...typography.body, color: colors.ink[600] }
});
