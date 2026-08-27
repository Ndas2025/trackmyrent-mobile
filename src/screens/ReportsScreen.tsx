import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BarChart3, TrendingUp } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { PeriodPicker } from "../components/PeriodPicker";
import { Card, SummaryCard } from "../components/ui";
import { useFinance } from "../data/FinanceContext";
import { useMembers } from "../data/MembersContext";
import { formatCurrency } from "../data/members";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";
import { getRecentPeriods, isDateInMonthYear, monthNames } from "../utils/date";

export function ReportsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { members } = useMembers();
  const { payments, expenses } = useFinance();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const periodPayments = useMemo(
    () => payments.filter((payment) => isDateInMonthYear(payment.date, selectedMonth, selectedYear)),
    [payments, selectedMonth, selectedYear]
  );
  const periodExpenses = useMemo(
    () => expenses.filter((expense) => isDateInMonthYear(expense.date, selectedMonth, selectedYear)),
    [expenses, selectedMonth, selectedYear]
  );
  const periodMembers = useMemo(
    () => members.filter((member) => member.billingMonth === monthNames[selectedMonth] && member.billingYear === selectedYear),
    [members, selectedMonth, selectedYear]
  );
  const income = periodPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const costs = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidCount = periodMembers.filter((member) => member.status === "Paid").length;
  const rate = periodMembers.length ? Math.round((paidCount / periodMembers.length) * 100) : 0;
  const categories = periodExpenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
    return acc;
  }, {});
  const trend = useMemo(() => {
    const periods = getRecentPeriods(selectedMonth, selectedYear, 5);
    const totals = periods.map((period) =>
      payments
        .filter((payment) => isDateInMonthYear(payment.date, period.monthIndex, period.year))
        .reduce((sum, payment) => sum + payment.amount, 0)
    );
    const peak = Math.max(...totals, 1);
    return periods.map((period, index) => ({
      label: period.shortLabel,
      value: Math.max(12, Math.round((totals[index] / peak) * 100)),
      total: totals[index]
    }));
  }, [payments, selectedMonth, selectedYear]);

  return (
    <View style={styles.screen}>
      <AppHeader onPremiumPress={() => navigation.navigate("Premium")} onProfilePress={() => navigation.navigate("Profile")} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.pageHero}>
          <Text style={styles.pageTitle}>Report</Text>
        </View>

        <PeriodPicker
          monthLabel={monthNames[selectedMonth]}
          yearLabel={`${selectedYear}`}
          monthOptions={[...monthNames]}
          yearOptions={[2025, 2026, 2027]}
          monthIndex={selectedMonth}
          year={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        <View style={styles.grid}>
          <SummaryCard label="Income" value={formatCurrency(income)} detail="All recorded" />
          <SummaryCard label="Net balance" value={formatCurrency(income - costs)} detail={`After ${formatCurrency(costs)} expenses`} accent="blue" />
        </View>

        <Card style={styles.chart}>
          <View style={styles.head}>
            <View>
              <Text style={styles.section}>Collection trend</Text>
              <Text style={styles.muted}>Last five months</Text>
            </View>
            <TrendingUp color={colors.status.paid} size={22} />
          </View>
          <View style={styles.bars}>
            {trend.map((month) => (
              <View key={`${month.label}-${month.total}`} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: `${month.value}%` }]} />
                </View>
                <Text style={styles.barLabel}>{month.label}</Text>
                <Text style={styles.barValue}>{formatCurrency(month.total)}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.metric}>
          <BarChart3 color={colors.brand[600]} size={24} />
          <View style={styles.flex}>
            <Text style={styles.section}>Collection rate</Text>
            <Text style={styles.muted}>
              {paidCount} of {periodMembers.length} members paid
            </Text>
          </View>
          <Text style={styles.rate}>{rate}%</Text>
        </Card>

        <Card style={styles.breakdown}>
          <Text style={styles.section}>Status breakdown</Text>
          <ReportRow label="Paid" value={periodMembers.filter((m) => m.status === "Paid").length} color={colors.status.paid} />
          <ReportRow label="Pending" value={periodMembers.filter((m) => m.status === "Pending").length} color={colors.status.pending} />
          <ReportRow label="Overdue" value={periodMembers.filter((m) => m.status === "Overdue").length} color={colors.status.unpaid} />
        </Card>

        <Card style={styles.breakdown}>
          <Text style={styles.section}>Expense categories</Text>
          {Object.entries(categories).map(([label, value]) => (
            <ReportRow key={label} label={label} value={value} color={colors.accent.blue} currency />
          ))}
          {Object.keys(categories).length === 0 ? <Text style={styles.muted}>No expenses recorded for this period yet.</Text> : null}
        </Card>
      </ScrollView>
    </View>
  );
}

function ReportRow({ label, value, color, currency = false }: { label: string; value: number; color: string; currency?: boolean }) {
  return (
    <View style={styles.reportRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{currency ? formatCurrency(value) : value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  pageHero: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3] },
  pageTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  filtersRow: { flexDirection: "row", gap: spacing[3] },
  grid: { flexDirection: "row", gap: spacing[3], flexWrap: "wrap" },
  chart: { gap: spacing[5] },
  head: { flexDirection: "row", justifyContent: "space-between" },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  bars: { height: 150, flexDirection: "row", gap: spacing[3], alignItems: "flex-end" },
  barColumn: { flex: 1, height: "100%", alignItems: "center", gap: spacing[2] },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end", backgroundColor: colors.surface.soft, borderRadius: radii.md, overflow: "hidden" },
  bar: { width: "100%", backgroundColor: colors.brand[600] },
  barLabel: { ...typography.caption, color: colors.ink[500] },
  barValue: { ...typography.caption, color: colors.ink[600], textAlign: "center" },
  metric: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  flex: { flex: 1 },
  rate: { fontSize: 24, fontWeight: "800", color: colors.brand[700] },
  breakdown: { gap: spacing[4] },
  reportRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowLabel: { ...typography.body, flex: 1, color: colors.ink[700] },
  rowValue: { ...typography.label, color: colors.ink[900] },
  muted: { ...typography.caption, color: colors.ink[500] }
});
