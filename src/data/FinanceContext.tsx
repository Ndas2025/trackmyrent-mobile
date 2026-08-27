import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { backendRepository } from "../backend/repository";
import { useOnboarding } from "./OnboardingContext";

export type PlanBillingCycle = "1 Month" | "3 Months" | "6 Months" | "1 Year";

export type Plan = {
  id: string;
  name: string;
  amount: number;
  billingCycle: PlanBillingCycle;
  members: number;
  active: boolean;
  assignedMemberIds: string[];
};
export type Payment = { id: string; memberId: string; amount: number; date: string; method: "Cash" | "UPI" | "Bank" };
export type Expense = { id: string; title: string; category: string; amount: number; date: string; recurrence: "Monthly" | "This month" };

const initialPlans: Plan[] = [
  { id: "p1", name: "Standard Shop", amount: 18500, billingCycle: "1 Month", members: 2, active: true, assignedMemberIds: ["m1", "m5"] },
  { id: "p2", name: "Premium Corner", amount: 27500, billingCycle: "1 Month", members: 1, active: true, assignedMemberIds: ["m4"] },
  { id: "p3", name: "Storage Unit", amount: 12000, billingCycle: "3 Months", members: 0, active: false, assignedMemberIds: [] }
];
const initialPayments: Payment[] = [
  { id: "pay1", memberId: "m1", amount: 18500, date: "05 Jul 2026", method: "UPI" },
  { id: "pay2", memberId: "m4", amount: 15000, date: "03 Jul 2026", method: "Bank" },
  { id: "pay3", memberId: "m1", amount: 18500, date: "05 Jun 2026", method: "Cash" }
];
const initialExpenses: Expense[] = [
  { id: "e1", title: "Common area electricity", category: "Utilities", amount: 4200, date: "02 Jul 2026", recurrence: "Monthly" },
  { id: "e2", title: "Plumbing repair", category: "Maintenance", amount: 2800, date: "28 Jun 2026", recurrence: "This month" },
  { id: "e3", title: "Property tax installment", category: "Tax", amount: 12500, date: "15 Jun 2026", recurrence: "This month" }
];

type PlanInput = Omit<Plan, "id" | "members" | "active">;
type PlanUpdate = Partial<Omit<Plan, "id" | "members">> & { assignedMemberIds?: string[] };
type FinanceValue = {
  plans: Plan[];
  payments: Payment[];
  expenses: Expense[];
  addPlan: (plan: PlanInput) => Plan;
  updatePlan: (planId: string, updates: PlanUpdate) => void;
  deletePlan: (planId: string) => void;
  addPayment: (payment: Omit<Payment, "id" | "date">) => void;
  addExpense: (expense: Omit<Expense, "id" | "date">) => void;
  deleteExpense: (expenseId: string) => void;
};
const FinanceContext = createContext<FinanceValue | null>(null);
export function FinanceProvider({ children }: { children: ReactNode }) {
  const { ready, category } = useOnboarding();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    if (!ready) return;

    let active = true;
    if (category !== "Others") {
      setPlans([]);
      setPayments([]);
      setExpenses([]);
      return () => {
        active = false;
      };
    }

    backendRepository
      .loadAll()
      .then((data) => {
        if (!active) return;
        if (!data) {
          setPlans(initialPlans);
          setPayments(initialPayments);
          setExpenses(initialExpenses);
          return;
        }
        setPlans(data.plans.length ? data.plans : initialPlans);
        setPayments(data.payments.length ? data.payments : initialPayments);
        setExpenses(data.expenses.length ? data.expenses : initialExpenses);
      })
      .catch(console.warn);

    return () => {
      active = false;
    };
  }, [category, ready]);

  const today = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const value = useMemo(() => ({ plans, payments, expenses,
    addPlan: (plan: PlanInput) => {
      const created = { ...plan, id: `p${Date.now()}`, members: plan.assignedMemberIds?.length ?? 0, active: true, assignedMemberIds: plan.assignedMemberIds ?? [] } satisfies Plan;
      setPlans((items) => [created, ...items]);
      backendRepository.savePlan(created).catch(console.warn);
      return created;
    },
    updatePlan: (planId: string, updates: PlanUpdate) => {
      setPlans((items) => items.map((plan) => {
        if (plan.id !== planId) return plan;
        const next: Plan = {
          ...plan,
          ...updates,
          assignedMemberIds: updates.assignedMemberIds ?? plan.assignedMemberIds,
          members: (updates.assignedMemberIds ?? plan.assignedMemberIds).length
        };
        backendRepository.savePlan(next).catch(console.warn);
        return next;
      }));
    },
    deletePlan: (planId: string) => { setPlans((items) => items.filter((plan) => plan.id !== planId)); backendRepository.deletePlan(planId).catch(console.warn); },
    addPayment: (payment: Omit<Payment, "id" | "date">) => { const created = { ...payment, id: `pay${Date.now()}`, date: today() } satisfies Payment; setPayments((items) => [created, ...items]); backendRepository.savePayment(created).catch(console.warn); },
    addExpense: (expense: Omit<Expense, "id" | "date">) => { const created = { ...expense, id: `e${Date.now()}`, date: today() } satisfies Expense; setExpenses((items) => [created, ...items]); backendRepository.saveExpense(created).catch(console.warn); },
    deleteExpense: (expenseId: string) => { setExpenses((items) => items.filter((expense) => expense.id !== expenseId)); backendRepository.deleteExpense(expenseId).catch(console.warn); }
  }), [plans, payments, expenses]);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
export function useFinance() { const value = useContext(FinanceContext); if (!value) throw new Error("useFinance must be used inside FinanceProvider"); return value; }
