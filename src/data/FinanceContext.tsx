import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { backendRepository } from "../backend/repository";

export type Plan = { id: string; name: string; amount: number; billingCycle: "Monthly" | "Quarterly"; members: number; active: boolean };
export type Payment = { id: string; memberId: string; amount: number; date: string; method: "Cash" | "UPI" | "Bank" };
export type Expense = { id: string; title: string; category: string; amount: number; date: string };

const initialPlans: Plan[] = [
  { id: "p1", name: "Standard Shop", amount: 18500, billingCycle: "Monthly", members: 2, active: true },
  { id: "p2", name: "Premium Corner", amount: 27500, billingCycle: "Monthly", members: 1, active: true },
  { id: "p3", name: "Storage Unit", amount: 12000, billingCycle: "Monthly", members: 0, active: false }
];
const initialPayments: Payment[] = [
  { id: "pay1", memberId: "m1", amount: 18500, date: "05 Jul 2026", method: "UPI" },
  { id: "pay2", memberId: "m4", amount: 15000, date: "03 Jul 2026", method: "Bank" },
  { id: "pay3", memberId: "m1", amount: 18500, date: "05 Jun 2026", method: "Cash" }
];
const initialExpenses: Expense[] = [
  { id: "e1", title: "Common area electricity", category: "Utilities", amount: 4200, date: "02 Jul 2026" },
  { id: "e2", title: "Plumbing repair", category: "Maintenance", amount: 2800, date: "28 Jun 2026" },
  { id: "e3", title: "Property tax installment", category: "Tax", amount: 12500, date: "15 Jun 2026" }
];

type FinanceValue = { plans: Plan[]; payments: Payment[]; expenses: Expense[]; addPlan: (plan: Omit<Plan, "id" | "members" | "active">) => void; addPayment: (payment: Omit<Payment, "id" | "date">) => void; addExpense: (expense: Omit<Expense, "id" | "date">) => void };
const FinanceContext = createContext<FinanceValue | null>(null);
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState(initialPlans); const [payments, setPayments] = useState(initialPayments); const [expenses, setExpenses] = useState(initialExpenses);
  useEffect(() => { backendRepository.loadAll().then((data) => { if (!data) return; if (data.plans.length) setPlans(data.plans); if (data.payments.length) setPayments(data.payments); if (data.expenses.length) setExpenses(data.expenses); }).catch(console.warn); }, []);
  const today = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const value = useMemo(() => ({ plans, payments, expenses,
    addPlan: (plan: Omit<Plan, "id" | "members" | "active">) => { const created = { ...plan, id: `p${Date.now()}`, members: 0, active: true } satisfies Plan; setPlans((items) => [created, ...items]); backendRepository.savePlan(created).catch(console.warn); },
    addPayment: (payment: Omit<Payment, "id" | "date">) => { const created = { ...payment, id: `pay${Date.now()}`, date: today() } satisfies Payment; setPayments((items) => [created, ...items]); backendRepository.savePayment(created).catch(console.warn); },
    addExpense: (expense: Omit<Expense, "id" | "date">) => { const created = { ...expense, id: `e${Date.now()}`, date: today() } satisfies Expense; setExpenses((items) => [created, ...items]); backendRepository.saveExpense(created).catch(console.warn); }
  }), [plans, payments, expenses]);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
export function useFinance() { const value = useContext(FinanceContext); if (!value) throw new Error("useFinance must be used inside FinanceProvider"); return value; }
