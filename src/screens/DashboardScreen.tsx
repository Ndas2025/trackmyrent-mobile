import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Users } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MemberRow } from "../components/MemberRow";
import { Button, Card, SummaryCard } from "../components/ui";
import { useMembers } from "../data/MembersContext";
import { formatCurrency } from "../data/members";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

export function DashboardScreen() {
  const { members } = useMembers();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const collected = members.filter((m) => m.status === "Paid").reduce((sum, m) => sum + m.monthlyRent, 0);
  const outstanding = members.reduce((sum, m) => sum + m.balance, 0);
  const attention = members.filter((m) => m.status !== "Paid");
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.intro}><View><Text style={styles.eyebrow}>JULY COLLECTION</Text><Text style={styles.title}>Good morning</Text></View><Button size="sm" onPress={() => navigation.navigate("AddMember")}>Add member</Button></View>
    <View style={styles.grid}><SummaryCard label="Collected" value={formatCurrency(collected)} detail={`${members.filter((m) => m.status === "Paid").length} members paid`} /><SummaryCard label="Outstanding" value={formatCurrency(outstanding)} detail={`${attention.length} need attention`} accent="red" /></View>
    <Card style={styles.progressCard}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>Collection progress</Text><Text style={styles.percent}>{Math.round((collected / (collected + outstanding)) * 100)}%</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${(collected / (collected + outstanding)) * 100}%` }]} /></View><Text style={styles.muted}>{formatCurrency(collected)} of {formatCurrency(collected + outstanding)} received</Text></Card>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Needs attention</Text><Pressable onPress={() => navigation.navigate("MainTabs", undefined)}><Text style={styles.link}>{attention.length} members</Text></Pressable></View>
    <View style={styles.list}>{attention.map((member) => <MemberRow key={member.id} member={member} onPress={() => navigation.navigate("MemberDetail", { memberId: member.id })} />)}</View>
    <Card style={styles.empty}><Users size={22} color={colors.brand[600]} /><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{members.length} active members</Text><Text style={styles.muted}>All rental profiles in one place</Text></View></Card>
  </ScrollView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surface.app }, content: { padding: spacing[4], gap: spacing[5], paddingBottom: spacing[8] }, intro: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3] }, eyebrow: { ...typography.caption, color: colors.brand[700] }, title: { ...typography.title, color: colors.ink[900] }, grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] }, progressCard: { gap: spacing[3] }, sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, sectionTitle: { ...typography.sectionTitle, color: colors.ink[900] }, percent: { ...typography.label, color: colors.brand[700] }, track: { height: 8, backgroundColor: colors.surface.soft, borderRadius: 4, overflow: "hidden" }, fill: { height: 8, backgroundColor: colors.brand[600] }, muted: { ...typography.caption, color: colors.ink[500] }, link: { ...typography.label, color: colors.brand[700] }, list: { borderWidth: 1, borderColor: colors.surface.line, overflow: "hidden" }, empty: { flexDirection: "row", alignItems: "center", gap: spacing[3] }, cardTitle: { ...typography.label, color: colors.ink[800] } });
