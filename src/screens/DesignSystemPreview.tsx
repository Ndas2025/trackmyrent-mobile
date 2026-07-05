import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge, Button, Card, SummaryCard, TextField } from "../components/ui";
import { colors, spacing, typography } from "../design";

const statusItems = [
  { label: "Paid", tone: "paid" as const },
  { label: "Unpaid", tone: "unpaid" as const },
  { label: "Frozen", tone: "frozen" as const },
  { label: "Pending", tone: "pending" as const }
];

export function DesignSystemPreview() {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TrackmyRent</Text>
        <Text style={styles.title}>Payment control for local businesses</Text>
        <Text style={styles.subtitle}>
          A compact mobile foundation for rent, fees, dues, expenses, and reminders.
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard label="Collected" value="₹84,500" detail="This month" accent="brand" />
        <SummaryCard label="Pending" value="₹18,200" detail="12 members" accent="amber" />
        <SummaryCard label="Paid" value="126" detail="Active records" accent="blue" />
        <SummaryCard label="Unpaid" value="18" detail="Needs follow-up" accent="red" />
      </View>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Member snapshot</Text>
            <Text style={styles.sectionMeta}>Ahmed Khan - Premium Membership</Text>
          </View>
          <Badge label="Unpaid" tone="unpaid" />
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.metricLabel}>Due amount</Text>
            <Text style={styles.metricValue}>₹1,500</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>Due date</Text>
            <Text style={styles.metricValue}>05 Jul</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button fullWidth>Mark paid</Button>
          <Button fullWidth variant="secondary">
            WhatsApp
          </Button>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Add member form</Text>
        <TextField label="Full name" placeholder="Enter member name" value="Rahul Menon" />
        <TextField label="Phone number" placeholder="Enter mobile number" keyboardType="phone-pad" />
        <TextField label="Plan" placeholder="Select plan" helperText="Batch appears after plan selection." />
        <Button fullWidth>Add member</Button>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Payment statuses</Text>
        <View style={styles.badgeRow}>
          {statusItems.map((item) => (
            <Badge key={item.label} label={item.label} tone={item.tone} />
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Button states</Text>
        <View style={styles.buttonGrid}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface.app
  },
  content: {
    gap: spacing[4],
    padding: spacing[4],
    paddingBottom: spacing[8]
  },
  header: {
    gap: spacing[2],
    paddingTop: spacing[6]
  },
  eyebrow: {
    ...typography.label,
    color: colors.brand[700]
  },
  title: {
    ...typography.title,
    color: colors.ink[900]
  },
  subtitle: {
    ...typography.body,
    color: colors.ink[600]
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3]
  },
  section: {
    gap: spacing[4]
  },
  sectionHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between"
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.ink[900]
  },
  sectionMeta: {
    ...typography.caption,
    color: colors.ink[500],
    marginTop: spacing[1]
  },
  row: {
    backgroundColor: colors.surface.soft,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing[4]
  },
  metricLabel: {
    ...typography.caption,
    color: colors.ink[500]
  },
  metricValue: {
    color: colors.ink[900],
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
    marginTop: spacing[1]
  },
  actions: {
    gap: spacing[3]
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2]
  },
  buttonGrid: {
    gap: spacing[3]
  }
});
