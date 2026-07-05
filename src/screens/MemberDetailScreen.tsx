import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, MapPin, Phone, Store } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge, Button, Card } from "../components/ui";
import { useMembers } from "../data/MembersContext";
import { formatCurrency } from "../data/members";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "MemberDetail">;
export function MemberDetailScreen({ route }: Props) {
  const { members } = useMembers(); const member = members.find((item) => item.id === route.params.memberId);
  if (!member) return <View style={styles.center}><Text style={styles.muted}>Member not found.</Text></View>;
  const tone = member.status === "Paid" ? "paid" : member.status === "Overdue" ? "unpaid" : "pending";
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Card style={styles.profile}><View style={styles.avatar}><Text style={styles.initial}>{member.name.split(" ").map((p) => p[0]).join("")}</Text></View><View style={styles.profileText}><Text style={styles.name}>{member.name}</Text><Text style={styles.business}>{member.business}</Text><Badge label={member.status} tone={tone} /></View></Card>
    <View style={styles.amounts}><Card style={styles.amountCard}><Text style={styles.label}>MONTHLY RENT</Text><Text style={styles.amount}>{formatCurrency(member.monthlyRent)}</Text></Card><Card style={styles.amountCard}><Text style={styles.label}>BALANCE DUE</Text><Text style={[styles.amount, member.balance > 0 && styles.due]}>{formatCurrency(member.balance)}</Text></Card></View>
    {member.balance > 0 && <Button fullWidth>Record payment</Button>}
    <Card style={styles.details}><Text style={styles.section}>Rental details</Text><Detail icon={Store} label="Business" value={member.business} /><Detail icon={MapPin} label="Unit" value={member.unit} /><Detail icon={Phone} label="Phone" value={member.phone} /><Detail icon={CalendarDays} label="Payment due" value={`${member.dueDay}${member.dueDay === 1 ? "st" : "th"} of every month`} /></Card>
    <View><Text style={styles.section}>Recent payments</Text><Card style={styles.payment}><View><Text style={styles.paymentTitle}>June 2026 rent</Text><Text style={styles.muted}>Received 05 Jun 2026</Text></View><Text style={styles.paidAmount}>{formatCurrency(member.monthlyRent)}</Text></Card></View>
    <Text style={styles.joined}>Member since {member.joinedOn}</Text>
  </ScrollView>;
}
function Detail({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: string }) { return <View style={styles.detailRow}><Icon size={19} color={colors.ink[500]} /><View><Text style={styles.label}>{label.toUpperCase()}</Text><Text style={styles.detailValue}>{value}</Text></View></View>; }
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surface.app }, content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[10] }, center: { flex: 1, alignItems: "center", justifyContent: "center" }, profile: { flexDirection: "row", alignItems: "center", gap: spacing[4] }, avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.brand[100], alignItems: "center", justifyContent: "center" }, initial: { fontSize: 20, fontWeight: "800", color: colors.brand[700] }, profileText: { flex: 1, gap: spacing[1] }, name: { ...typography.sectionTitle, color: colors.ink[900] }, business: { ...typography.body, color: colors.ink[600] }, amounts: { flexDirection: "row", gap: spacing[3] }, amountCard: { flex: 1, minWidth: 0, gap: spacing[1] }, label: { ...typography.caption, color: colors.ink[500] }, amount: { fontSize: 21, lineHeight: 28, fontWeight: "800", color: colors.ink[900] }, due: { color: colors.status.unpaid }, details: { gap: spacing[4] }, section: { ...typography.sectionTitle, color: colors.ink[900], marginBottom: spacing[3] }, detailRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] }, detailValue: { ...typography.body, color: colors.ink[800] }, payment: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, paymentTitle: { ...typography.label, color: colors.ink[800] }, muted: { ...typography.caption, color: colors.ink[500] }, paidAmount: { ...typography.label, color: colors.status.paid }, joined: { ...typography.caption, color: colors.ink[500], textAlign: "center" } });
