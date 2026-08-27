import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CalendarRange, ChevronRight, Users, WalletCards } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { PeriodPicker } from "../components/PeriodPicker";
import { SyncStatusCard } from "../components/SyncStatusCard";
import { Badge, Button, Card } from "../components/ui";
import { useMembers } from "../data/MembersContext";
import { formatCurrency, type Member } from "../data/members";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const memberFilters = ["All", "Paid", "Unpaid"] as const;

export function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { members, markPaid, status, errorMessage } = useMembers();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedFilter, setSelectedFilter] = useState<(typeof memberFilters)[number]>("All");

  const periodMembers = useMemo(
    () => members.filter((member) => member.billingMonth === monthNames[selectedMonth] && member.billingYear === selectedYear),
    [members, selectedMonth, selectedYear]
  );
  const paidMembers = periodMembers.filter((member) => member.status === "Paid");
  const unpaidMembers = periodMembers.filter((member) => member.status !== "Paid");
  const collected = paidMembers.reduce((sum, member) => sum + member.monthlyRent, 0);
  const totalTarget = periodMembers.reduce((sum, member) => sum + member.monthlyRent, 0);
  const visibleMembers = selectedFilter === "All" ? periodMembers : selectedFilter === "Paid" ? paidMembers : unpaidMembers;

  return (
    <View style={styles.screen}>
      <AppHeader onPremiumPress={() => navigation.navigate("Premium")} onProfilePress={() => navigation.navigate("Profile")} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={[styles.pageHero, isCompact && styles.pageHeroCompact]}>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <Button size="sm" onPress={() => navigation.navigate("AddMember")}>
            Add member
          </Button>
        </View>

        <View style={styles.periodPickerWrap}>
          <PeriodPicker
            monthLabel={monthNames[selectedMonth]}
            yearLabel={`${selectedYear}`}
            monthOptions={monthNames}
            yearOptions={[2025, 2026, 2027]}
            monthIndex={selectedMonth}
            year={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </View>

        <View style={[styles.metricsRow, isCompact && styles.stackRow]}>
          <MetricCard icon={Users} label="All members" value={`${periodMembers.length}`} />
          <MetricCard icon={CalendarRange} label="Total collected" value={formatCurrency(collected)} detail={`of ${formatCurrency(totalTarget)}`} />
        </View>
        {status === "loading" ? <View style={styles.statusWrap}><SyncStatusCard title="Loading members" message="We are refreshing the current billing period." /></View> : null}
        {errorMessage ? <View style={styles.statusWrap}><SyncStatusCard title="Member sync problem" message={errorMessage} tone="error" /></View> : null}

        <Card style={styles.quickActions}>
          <Text style={styles.quickActionsLabel}>Quick actions</Text>
          <View style={[styles.quickActionsRow, isCompact && styles.stackRow]}>
            <Button fullWidth variant="secondary" onPress={() => navigation.navigate("Members")} style={styles.quickButton}>
              View members
            </Button>
            <Button fullWidth variant="secondary" onPress={() => navigation.navigate("Payments")} style={styles.quickButton}>
              Open payments
            </Button>
          </View>
        </Card>

        <Card padded={false} style={styles.rosterCard}>
          <View style={styles.rosterHeader}>
            <Text style={styles.rosterTitle}>{periodMembers.length} Members</Text>
          </View>

          <View style={[styles.tabRow, isCompact && styles.tabRowCompact]}>
            {memberFilters.map((filter) => {
              const count = filter === "All" ? periodMembers.length : filter === "Paid" ? paidMembers.length : unpaidMembers.length;
              const active = filter === selectedFilter;
              return (
                <Pressable
                  key={filter}
                  accessibilityRole="button"
                  onPress={() => setSelectedFilter(filter)}
                  style={({ pressed }) => [styles.filterTab, active && styles.filterTabActive, pressed && styles.filterTabPressed]}
                >
                  <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                    {filter} ({count})
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.table}>
            {visibleMembers.map((member) => (
              <RosterRow
                key={member.id}
                member={member}
                onOpen={() => navigation.navigate("MemberDetail", { memberId: member.id })}
                onMarkPaid={() => markPaid(member.id)}
              />
            ))}
            {visibleMembers.length === 0 && <Text style={styles.empty}>No members in this view.</Text>}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: typeof Users;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <Card style={styles.metricCard}>
      <View style={styles.metricTop}>
        <View style={styles.metricIcon}>
          <Icon color={colors.ink[600]} size={20} />
        </View>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      {detail ? <Text style={styles.metricDetail}>{detail}</Text> : null}
    </Card>
  );
}

function RosterRow({
  member,
  onOpen,
  onMarkPaid,
}: {
  member: Member;
  onOpen: () => void;
  onMarkPaid: () => void;
}) {
  const isPaid = member.status === "Paid";
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.row, pressed && styles.rowPressed, isPaid ? null : null]}>
      <View style={styles.rowLeft}>
        <View style={[styles.avatar, isPaid ? styles.avatarPaid : styles.avatarUnpaid]}>
          <Text style={[styles.avatarText, !isPaid && styles.avatarTextUnpaid]}>{member.name.split(" ").map((part) => part[0]).join("")}</Text>
        </View>
        <View style={styles.memberCopy}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.memberName}>
            {member.name}
          </Text>
          <Text style={styles.amount}>{formatCurrency(member.monthlyRent)}</Text>
          <View style={styles.statusRow}>
            <Badge label={isPaid ? "Paid" : "Unpaid"} tone={isPaid ? "paid" : "unpaid"} />
          </View>
        </View>
      </View>

      <View style={styles.rowRight}>
        <View style={[styles.rowActions, styles.rowActionsCompact]}>
          {!isPaid ? (
            <Button size="sm" variant="secondary" onPress={onMarkPaid}>
              Mark paid
            </Button>
          ) : null}
          <Pressable onPress={onOpen} style={styles.arrowButton}>
            <ChevronRight color={colors.ink[500]} size={20} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  scroll: { flex: 1 },
  content: { paddingBottom: 128 },
  pageHero: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3]
  },
  pageHeroCompact: {
    alignItems: "stretch"
  },
  pageTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  periodPickerWrap: { paddingHorizontal: spacing[4], paddingTop: spacing[6] },
  filtersRow: { flexDirection: "row", gap: spacing[3], paddingHorizontal: spacing[4], paddingTop: spacing[3] },
  metricsRow: { flexDirection: "row", gap: spacing[3], paddingHorizontal: spacing[4], paddingTop: spacing[4] },
  stackRow: { flexDirection: "column" },
  metricCard: { flex: 1, gap: spacing[2], minHeight: 136 },
  statusWrap: { marginHorizontal: spacing[4], marginTop: spacing[4] },
  quickActions: { gap: spacing[3], marginHorizontal: spacing[4], marginTop: spacing[4] },
  quickActionsLabel: { ...typography.caption, color: colors.ink[500], textTransform: "uppercase" },
  quickActionsRow: { flexDirection: "row", gap: spacing[3] },
  quickButton: { flex: 1 },
  metricTop: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
  metricIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.soft
  },
  metricLabel: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: colors.ink[700] },
  metricValue: { fontSize: 26, lineHeight: 32, fontWeight: "800", color: colors.ink[900] },
  metricDetail: { fontSize: 13, lineHeight: 18, color: colors.ink[600] },
  rosterCard: { marginHorizontal: spacing[4], padding: 0, overflow: "hidden", marginTop: spacing[4], marginBottom: spacing[4] },
  rosterHeader: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  rosterTitle: { fontSize: 14, lineHeight: 20, fontWeight: "800", color: colors.ink[900] },
  tabRow: {
    flexDirection: "row",
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4]
  },
  tabRowCompact: {
    flexWrap: "wrap"
  },
  filterTab: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.surface.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  filterTabActive: {
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[500],
    shadowColor: colors.brand[500],
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  filterTabPressed: { opacity: 0.86 },
  filterTabText: { ...typography.label, color: colors.ink[500], fontSize: 14, lineHeight: 18 },
  filterTabTextActive: { color: colors.ink[900], fontWeight: "800" },
  table: {
    borderTopWidth: 1,
    borderTopColor: colors.surface.line
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.line
  },
  rowPressed: { backgroundColor: colors.surface.soft },
  rowLeft: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: spacing[3], minWidth: 0 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarPaid: { backgroundColor: colors.brand[100] },
  avatarUnpaid: { backgroundColor: colors.status.unpaidSoft },
  avatarText: { fontSize: 18, lineHeight: 22, fontWeight: "800", color: colors.brand[700] },
  avatarTextUnpaid: { color: colors.status.unpaid },
  memberCopy: { flex: 1, minWidth: 0, gap: spacing[1], paddingTop: 1 },
  memberTopLine: { flexDirection: "row", alignItems: "flex-start", gap: spacing[2] },
  memberName: { fontSize: 14, lineHeight: 20, fontWeight: "800", color: colors.ink[900], flexShrink: 1 },
  amount: { fontSize: 16, lineHeight: 22, fontWeight: "700", color: colors.ink[700] },
  statusRow: { flexDirection: "row", alignItems: "center", gap: spacing[2], flexWrap: "wrap" },
  rowRight: { alignItems: "flex-end", paddingTop: 1 },
  rowActions: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
  rowActionsCompact: { flexWrap: "wrap", justifyContent: "flex-end" },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surface.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  empty: { ...typography.body, color: colors.ink[500], textAlign: "center", padding: spacing[6] }
});
