import type { Expense, Payment, Plan } from "../data/FinanceContext";
import type { Member } from "../data/members";
import { supabase } from "./client";

async function ownerId() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const backendRepository = {
  loadAll: async () => {
    if (!supabase || !(await ownerId())) return null;
    const [members, plans, payments, expenses] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("plans").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("paid_at", { ascending: false }),
      supabase.from("expenses").select("*").order("spent_at", { ascending: false })
    ]);
    const error = members.error ?? plans.error ?? payments.error ?? expenses.error;
    if (error) throw error;
    return {
      members: (members.data ?? []).map((m) => ({ id: m.id, name: m.name, business: m.business, phone: m.phone, unit: m.unit, monthlyRent: Number(m.monthly_rent), dueDay: m.due_day, status: m.status, joinedOn: m.joined_on, balance: Number(m.balance) })) as Member[],
      plans: (plans.data ?? []).map((p) => ({ id: p.id, name: p.name, amount: Number(p.amount), billingCycle: p.billing_cycle, members: p.member_count, active: p.active })) as Plan[],
      payments: (payments.data ?? []).map((p) => ({ id: p.id, memberId: p.member_id, amount: Number(p.amount), date: p.paid_at, method: p.method })) as Payment[],
      expenses: (expenses.data ?? []).map((e) => ({ id: e.id, title: e.title, category: e.category, amount: Number(e.amount), date: e.spent_at })) as Expense[]
    };
  },
  saveMember: async (member: Member) => {
    const owner = await ownerId(); if (!supabase || !owner) return;
    const { error } = await supabase.from("members").upsert({ id: member.id, owner_id: owner, name: member.name, business: member.business, phone: member.phone, unit: member.unit, monthly_rent: member.monthlyRent, due_day: member.dueDay, status: member.status, joined_on: member.joinedOn, balance: member.balance });
    if (error) throw error;
  },
  markMemberPaid: async (memberId: string) => { if (!supabase) return; const { error } = await supabase.from("members").update({ status: "Paid", balance: 0 }).eq("id", memberId); if (error) throw error; },
  savePlan: async (plan: Plan) => { const owner = await ownerId(); if (!supabase || !owner) return; const { error } = await supabase.from("plans").upsert({ id: plan.id, owner_id: owner, name: plan.name, amount: plan.amount, billing_cycle: plan.billingCycle, member_count: plan.members, active: plan.active }); if (error) throw error; },
  savePayment: async (payment: Payment) => { const owner = await ownerId(); if (!supabase || !owner) return; const { error } = await supabase.from("payments").upsert({ id: payment.id, owner_id: owner, member_id: payment.memberId, amount: payment.amount, paid_at: payment.date, method: payment.method }); if (error) throw error; },
  saveExpense: async (expense: Expense) => { const owner = await ownerId(); if (!supabase || !owner) return; const { error } = await supabase.from("expenses").upsert({ id: expense.id, owner_id: owner, title: expense.title, category: expense.category, amount: expense.amount, spent_at: expense.date }); if (error) throw error; }
};
