import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { backendRepository } from "../backend/repository";
import { formatDisplayDate } from "../utils/date";
import { useAuth } from "./AuthContext";
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
type LoadState = "idle" | "loading" | "ready" | "error";
type FinanceValue = {
  status: LoadState;
  errorMessage: string | null;
  plans: Plan[];
  payments: Payment[];
  expenses: Expense[];
  addPlan: (plan: PlanInput) => Promise<Plan>;
  updatePlan: (planId: string, updates: PlanUpdate) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, "id" | "date">) => Promise<void>;
  addExpense: (expense: Omit<Expense, "id" | "date">) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  clearError: () => void;
};
const FinanceContext = createContext<FinanceValue | null>(null);
export function FinanceProvider({ children }: { children: ReactNode }) {
  const { ready } = useOnboarding();
  const { loading: authLoading, session, isBackendConfigured } = useAuth();
  const [status, setStatus] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    if (!ready || authLoading) return;

    let active = true;
    setErrorMessage(null);

    if (isBackendConfigured && !session) {
      setPlans([]);
      setPayments([]);
      setExpenses([]);
      setStatus("ready");
      return () => {
        active = false;
      };
    }

    setStatus("loading");
    backendRepository
      .loadAll()
      .then((data) => {
        if (!active) return;
        if (!data) {
          setPlans(isBackendConfigured ? [] : initialPlans);
          setPayments(isBackendConfigured ? [] : initialPayments);
          setExpenses(isBackendConfigured ? [] : initialExpenses);
          setStatus("ready");
          return;
        }
        setPlans(data.plans);
        setPayments(data.payments);
        setExpenses(data.expenses);
        setStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        console.warn(error);
        setPlans(isBackendConfigured ? [] : initialPlans);
        setPayments(isBackendConfigured ? [] : initialPayments);
        setExpenses(isBackendConfigured ? [] : initialExpenses);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "We couldn't load finance data right now.");
      });

    return () => {
      active = false;
    };
  }, [authLoading, isBackendConfigured, ready, session]);

  const today = () => formatDisplayDate(new Date());
  const value = useMemo(() => ({ status, errorMessage, plans, payments, expenses,
    clearError: () => setErrorMessage(null),
    addPlan: async (plan: PlanInput) => {
      const created = { ...plan, id: `p${Date.now()}`, members: plan.assignedMemberIds?.length ?? 0, active: true, assignedMemberIds: plan.assignedMemberIds ?? [] } satisfies Plan;
      setPlans((items) => [created, ...items]);
      setErrorMessage(null);
      try {
        await backendRepository.savePlan(created);
      } catch (error) {
        setPlans((items) => items.filter((item) => item.id !== created.id));
        setErrorMessage(error instanceof Error ? error.message : "We couldn't save the plan.");
        throw error;
      }
      return created;
    },
    updatePlan: async (planId: string, updates: PlanUpdate) => {
      const currentPlan = plans.find((plan) => plan.id === planId);
      if (!currentPlan) return;
      const nextPlan: Plan = {
        ...currentPlan,
        ...updates,
        assignedMemberIds: updates.assignedMemberIds ?? currentPlan.assignedMemberIds,
        members: (updates.assignedMemberIds ?? currentPlan.assignedMemberIds).length
      };
      setPlans((items) => items.map((plan) => plan.id === planId ? nextPlan : plan));
      setErrorMessage(null);
      try {
        await backendRepository.savePlan(nextPlan);
      } catch (error) {
        setPlans((items) => items.map((plan) => plan.id === planId ? currentPlan : plan));
        setErrorMessage(error instanceof Error ? error.message : "We couldn't update the plan.");
        throw error;
      }
    },
    deletePlan: async (planId: string) => {
      const currentPlan = plans.find((plan) => plan.id === planId);
      if (!currentPlan) return;
      setPlans((items) => items.filter((plan) => plan.id !== planId));
      setErrorMessage(null);
      try {
        await backendRepository.deletePlan(planId);
      } catch (error) {
        setPlans((items) => [currentPlan, ...items]);
        setErrorMessage(error instanceof Error ? error.message : "We couldn't delete the plan.");
        throw error;
      }
    },
    addPayment: async (payment: Omit<Payment, "id" | "date">) => {
      const created = { ...payment, id: `pay${Date.now()}`, date: today() } satisfies Payment;
      setPayments((items) => [created, ...items]);
      setErrorMessage(null);
      try {
        await backendRepository.savePayment(created);
      } catch (error) {
        setPayments((items) => items.filter((item) => item.id !== created.id));
        setErrorMessage(error instanceof Error ? error.message : "We couldn't record the payment.");
        throw error;
      }
    },
    addExpense: async (expense: Omit<Expense, "id" | "date">) => {
      const created = { ...expense, id: `e${Date.now()}`, date: today() } satisfies Expense;
      setExpenses((items) => [created, ...items]);
      setErrorMessage(null);
      try {
        await backendRepository.saveExpense(created);
      } catch (error) {
        setExpenses((items) => items.filter((item) => item.id !== created.id));
        setErrorMessage(error instanceof Error ? error.message : "We couldn't save the expense.");
        throw error;
      }
    },
    deleteExpense: async (expenseId: string) => {
      const currentExpense = expenses.find((expense) => expense.id === expenseId);
      if (!currentExpense) return;
      setExpenses((items) => items.filter((expense) => expense.id !== expenseId));
      setErrorMessage(null);
      try {
        await backendRepository.deleteExpense(expenseId);
      } catch (error) {
        setExpenses((items) => [currentExpense, ...items]);
        setErrorMessage(error instanceof Error ? error.message : "We couldn't delete the expense.");
        throw error;
      }
    }
  }), [errorMessage, expenses, payments, plans, status]);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
export function useFinance() { const value = useContext(FinanceContext); if (!value) throw new Error("useFinance must be used inside FinanceProvider"); return value; }
