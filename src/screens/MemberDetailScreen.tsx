import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, MapPin, Phone, Sparkles, Store } from "lucide-react-native";
import { Alert, Linking, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Badge, Button, Card } from "../components/ui";
import { useFinance } from "../data/FinanceContext";
import { useMembers } from "../data/MembersContext";
import { formatCurrency } from "../data/members";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "MemberDetail">;

function formatWhatsappPhone(phone: string) {
  const digitsOnly = phone.replace(/\D/g, "");
  if (!digitsOnly) return "";
  if (digitsOnly.length === 10) return `91${digitsOnly}`;
  return digitsOnly;
}

function formatDueDay(day: number) {
  if (day === 1 || day === 21 || day === 31) return `${day}st`;
  if (day === 2 || day === 22) return `${day}nd`;
  if (day === 3 || day === 23) return `${day}rd`;
  return `${day}th`;
}

export function MemberDetailScreen({ route }: Props) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const { members, markPaid, markUnpaid } = useMembers();
  const { payments } = useFinance();
  const member = members.find((item) => item.id === route.params.memberId);

  if (!member) return <View style={styles.center}><Text style={styles.muted}>Member not found.</Text></View>;

  const isPaid = member.balance <= 0 || member.status === "Paid";
  const tone = isPaid ? "paid" : "unpaid";
  const recentPayments = payments.filter((payment) => payment.memberId === member.id).slice(0, 3);
  const dueLabel = `${formatDueDay(member.dueDay)} of every month`;

  const sendReminder = async () => {
    const phone = formatWhatsappPhone(member.phone);
    if (!phone) {
      Alert.alert("Phone missing", "Add a valid phone number before sending a reminder.");
      return;
    }

    const amountDue = member.balance > 0 ? member.balance : member.monthlyRent;
    const message = `Hi ${member.name}, this is a reminder that your payment of ${formatCurrency(amountDue)} is due on ${dueLabel}. Please complete it when possible. Thank you.`;
    const encodedMessage = encodeURIComponent(message);
    const appUrl = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;
    const webUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    try {
      const canOpenWhatsapp = await Linking.canOpenURL(appUrl);
      await Linking.openURL(canOpenWhatsapp ? appUrl : webUrl);
    } catch {
      Alert.alert("WhatsApp unavailable", "We couldn't open WhatsApp on this device.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Card style={styles.profile}>
          <View style={styles.avatar}><Text style={styles.initial}>{member.name.split(" ").map((p) => p[0]).join("")}</Text></View>
          <View style={styles.profileText}>
            <Text style={styles.name}>{member.name}</Text>
            {member.category ? <Text style={styles.category}>{member.category}</Text> : null}
            <Badge label={isPaid ? "Paid" : "Unpaid"} tone={tone} />
          </View>
        </Card>

        <View style={[styles.amounts, isCompact && styles.stackRow]}>
          <Card style={styles.amountCard}>
            <Text style={styles.label}>MONTHLY RENT</Text>
            <Text style={styles.amount}>{formatCurrency(member.monthlyRent)}</Text>
          </Card>
          <Card style={styles.amountCard}>
            <Text style={styles.label}>BALANCE DUE</Text>
            <Text style={[styles.amount, member.balance > 0 && styles.due]}>{formatCurrency(member.balance)}</Text>
          </Card>
        </View>

        <Card style={styles.details}>
          <Text style={styles.section}>Rental details</Text>
          {member.planName ? <Detail icon={Sparkles} label="Plan" value={member.planName} /> : null}
          {member.category ? <Detail icon={Store} label="Category" value={member.category} /> : null}
          <Detail icon={Store} label="Business" value={member.business} />
          <Detail icon={MapPin} label="Unit" value={member.unit} />
          {member.batch ? <Detail icon={MapPin} label="Batch" value={member.batch} /> : null}
          {member.roomType ? <Detail icon={MapPin} label="Room type" value={member.roomType} /> : null}
          {member.groupName ? <Detail icon={Sparkles} label="Group" value={member.groupName} /> : null}
          {member.customFields?.length ? <Detail icon={Sparkles} label="Custom fields" value={member.customFields.map((field) => `${field.label}: ${field.value}`).join(" · ")} /> : null}
          <Detail icon={Phone} label="Phone" value={member.phone} />
          <Detail icon={CalendarDays} label="Payment due" value={dueLabel} />
        </Card>

        <View>
          <Text style={styles.section}>Recent payments</Text>
          <View style={styles.paymentList}>
            {recentPayments.length ? (
              recentPayments.map((payment) => (
                <Card key={payment.id} style={[styles.payment, isCompact && styles.paymentCompact]}>
                  <View>
                    <Text style={styles.paymentTitle}>{payment.date}</Text>
                    <Text style={styles.muted}>{payment.method}</Text>
                  </View>
                  <Text style={styles.paidAmount}>{formatCurrency(payment.amount)}</Text>
                </Card>
              ))
            ) : (
              <Card style={styles.paymentEmpty}>
                <Text style={styles.muted}>No recorded payments yet.</Text>
              </Card>
            )}
          </View>
        </View>

        <Text style={styles.joined}>Member since {member.joinedOn}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={[styles.footerRow, isCompact && styles.footerRowCompact]}>
          <View style={styles.footerPrimary}>
            {isPaid ? (
              <Button fullWidth onPress={() => markUnpaid(member.id)}>
                Mark unpaid
              </Button>
            ) : (
              <Button fullWidth onPress={() => markPaid(member.id)}>
                Mark paid
              </Button>
            )}
          </View>
          <View style={styles.footerSecondary}>
            <Button fullWidth variant="secondary" onPress={sendReminder}>
              Send reminder
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Icon size={19} color={colors.ink[500]} />
      <View style={styles.detailCopy}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[4] },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  profile: { flexDirection: "row", alignItems: "center", gap: spacing[4] },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.brand[100], alignItems: "center", justifyContent: "center" },
  initial: { fontSize: 20, fontWeight: "800", color: colors.brand[700] },
  profileText: { flex: 1, gap: spacing[1] },
  name: { ...typography.sectionTitle, color: colors.ink[900] },
  category: { ...typography.caption, color: colors.ink[500], textTransform: "capitalize" },
  amounts: { flexDirection: "row", gap: spacing[3] },
  stackRow: { flexDirection: "column" },
  amountCard: { flex: 1, minWidth: 0, gap: spacing[1] },
  label: { ...typography.caption, color: colors.ink[500] },
  amount: { fontSize: 21, lineHeight: 28, fontWeight: "800", color: colors.ink[900] },
  due: { color: colors.status.unpaid },
  details: { gap: spacing[4] },
  section: { ...typography.sectionTitle, color: colors.ink[900], marginBottom: spacing[3] },
  detailRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  detailCopy: { flex: 1 },
  detailValue: { ...typography.body, color: colors.ink[800] },
  paymentList: { gap: spacing[3] },
  payment: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  paymentCompact: { alignItems: "flex-start", gap: spacing[2] },
  paymentEmpty: { alignItems: "center", justifyContent: "center", minHeight: 72 },
  paymentTitle: { ...typography.label, color: colors.ink[800] },
  muted: { ...typography.caption, color: colors.ink[500] },
  paidAmount: { ...typography.label, color: colors.status.paid },
  joined: { ...typography.caption, color: colors.ink[500], textAlign: "center" },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  },
  footerRow: { flexDirection: "row", gap: spacing[2] },
  footerRowCompact: { flexDirection: "column" },
  footerPrimary: { flex: 1 },
  footerSecondary: { flex: 1 }
});
