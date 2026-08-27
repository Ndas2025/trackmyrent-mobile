import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronRight, ReceiptText } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { PeriodPicker } from "../components/PeriodPicker";
import { Badge, Button, Card } from "../components/ui";
import { useFinance, type Expense } from "../data/FinanceContext";
import { formatCurrency } from "../data/members";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";
import { isDateInMonthYear, monthNames } from "../utils/date";

export function ExpensesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { expenses } = useFinance();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => isDateInMonthYear(expense.date, selectedMonth, selectedYear));
  }, [expenses, selectedMonth, selectedYear]);

  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <View style={styles.screen}>
      <AppHeader onPremiumPress={() => navigation.navigate("Premium")} onProfilePress={() => navigation.navigate("Profile")} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.pageHero}>
          <Text style={styles.pageTitle}>Expense</Text>
          <Button onPress={() => navigation.navigate("AddExpense")} style={styles.addButton}>
            Add expense
          </Button>
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

        <Card style={styles.summary}>
          <View style={styles.marker} />
          <Text style={styles.summaryLabel}>Total expenses</Text>
          <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
          <Text style={styles.summaryDetail}>{monthNames[selectedMonth]} {selectedYear}</Text>
        </Card>

        <Text style={styles.section}>Month's expense</Text>
        <View style={styles.list}>
          {filteredExpenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onPress={() => navigation.navigate("ExpenseDetail", { expenseId: expense.id })}
            />
          ))}
          {filteredExpenses.length === 0 ? <Text style={styles.summaryDetail}>No expenses recorded for this period yet.</Text> : null}
        </View>
      </ScrollView>

    </View>
  );
}

function ExpenseRow({ expense, onPress }: { expense: Expense; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${expense.title}`} onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.rowIcon}>
        <ReceiptText size={20} color={colors.accent.amber} />
      </View>
      <View style={styles.rowCopy}>
        <View style={styles.rowTop}>
          <Text numberOfLines={1} style={styles.rowTitle}>
            {expense.title}
          </Text>
          <Badge label={expense.recurrence} tone={expense.recurrence === "Monthly" ? "paid" : "neutral"} />
        </View>
        <Text style={styles.rowSubtitle}>
          {expense.category} · {expense.date}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowAmount}>−{formatCurrency(expense.amount)}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`View ${expense.title} details`} onPress={onPress} style={styles.arrow}>
          <ChevronRight size={18} color={colors.ink[500]} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[4] },
  pageHero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3]
  },
  pageTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.ink[900] },
  addButton: {
    minHeight: 48,
    borderRadius: radii.md,
    paddingHorizontal: spacing[4]
  },
  summary: { gap: spacing[1] },
  marker: { width: 28, height: 4, borderRadius: 999, backgroundColor: colors.accent.amber },
  summaryLabel: { ...typography.caption, color: colors.ink[500], textTransform: "uppercase" },
  summaryValue: { fontSize: 24, lineHeight: 30, fontWeight: "800", color: colors.ink[900] },
  summaryDetail: { ...typography.caption, color: colors.ink[600] },
  section: { ...typography.sectionTitle, color: colors.ink[900] },
  list: { gap: spacing[3] },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.surface.line,
    borderRadius: radii.md,
    ...{
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 1
    }
  },
  rowPressed: { backgroundColor: colors.surface.soft },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.status.pendingSoft
  },
  rowCopy: { flex: 1, minWidth: 0, gap: spacing[1] },
  rowTop: { flexDirection: "row", alignItems: "center", gap: spacing[2], flexWrap: "wrap" },
  rowTitle: { ...typography.label, color: colors.ink[900], flexShrink: 1 },
  rowSubtitle: { ...typography.caption, color: colors.ink[500] },
  rowRight: { alignItems: "flex-end", gap: spacing[2] },
  rowAmount: { ...typography.label, color: colors.status.unpaid },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surface.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  }
});
